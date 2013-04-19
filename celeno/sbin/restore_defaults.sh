#! /bin/sh

. /sbin/config.sh
# Usage: restore_defaults.sh {platform}  [mode]
#        (mode == "")                 -->  restore default + reboot
#        (mode == sw_update)          -->  restore default but keep parameters value according to "keep" file + reboot
#        (mode == ap) or ($2 == sta)  -->  restore default to ap/sta mode without reboot (used for production)
#
# Restore defaults according to operation mode and taking into account "keep" values.
# The state machine is as follows:
# OLD_NVRAM DEFAULTS_FILE keep_file ACTION
#     0          0         *        do nothing
#     0          1         *        update NVRAM with default value
#     1          0         *        remove from NVRAM the abcent default value
#     1          1         0        update NVRAM with default value
#     1          1         1        if software update, keep the old NVRAM value

if [ -z "$1" ]; then
    echo "PLATFORM is not defined in restore_defaults!"
    echo "Usage: restore_defaults.sh <platform>"
    echo "             platform can be 2860 or 3090."
    exit 1
fi

if [ "$1" != "2860" -a "$1" != "3090" ]; then
    echo "PLATFORM is $1 and not 2860 or 3090"
    exit 2
elif [ "$1" = "3090" ] && [ "$CONFIG_RT3090_AP" = "" ]; then
    echo "PLATFORM is $1 and not 2860"
    exit 2
fi

if [ "$1" == "3090" ]; then
    PLATFORM_NVRAM="rtdev"
else
    PLATFORM_NVRAM="$1"
fi

PLATFORM="$1"

echo "Restore defaults for platform $PLATFORM"

# Debug mode
# output_dev="/dev/console"
output_dev="/dev/null"

is_mode_change=0

if [ "$2" == "" ]; then
    if [ "$1" != "3090" ]; then
        reboot_device=1
    fi
    is_sta_mode=`nvram_get $PLATFORM_NVRAM ethConvert`
elif [ "$2" == "sw_update" ]; then
    is_software_update=1
    is_sta_mode=`nvram_get $PLATFORM_NVRAM ethConvert`
elif [ "$2" == "ap" ]; then
    is_sta_mode=0
    is_mode_change=1
elif [ "$2" == "sta" ]; then
    is_sta_mode=1
    is_mode_change=1
else
    echo "ERROR: Unknown mode [$2] !!! Aborting."
    exit 1
fi

echo "is_software_update=$is_software_update is_sta_mode=$is_sta_mode reboot_device=$reboot_device" > "$output_dev"

if [ "$PLATFORM" == "2860" ]; then
    chip=CL1800
else
    chip=RT3090
fi

path=/etc_ro/Wireless/RT"$PLATFORM"AP/"$chip"
if [ "$is_sta_mode" == "1" ]; then
    default_file="$path"_sta_default
else
    default_file="$path"_ap_default
fi

keep_file="$path"_keep_on_sw_update
if [ "$is_software_update" != "1" ]; then
    keep_file="$path"_keep_on_restore_defaults
fi

echo "default_file=$default_file keep_file=$keep_file" > $output_dev

if [ ! -f "$default_file" -a ! -h "$default_file" ]; then
    echo "ERROR: No defaults file! Aborting."
    exit 1
fi

if [ ! -f "$keep_file" -a ! -h "$keep_file" ]; then
    echo "ERROR: No keep file! Aborting."
    exit 1
fi

if [ "$is_software_update" != "1" ]; then
    touch /sbin/restore_defaults_in_process
fi

if [ "$is_mode_change" = "0" ]; then
	if [ "$PLATFORM" = "2860" ]; then
		if [ -e /sys/class/net/ra0 ]; then
			DISSASSOC_REASON_FACTORY_RESET=20000
			IFF_UP=0x0001

			if [ $(( $( cat /sys/class/net/ra0/flags ) & IFF_UP )) -ne 0 ]; then
				if [ -e /sys/module/rt2860v2_sta ]; then
					iwpriv ra0 set NotifyFactoryReset=1
				elif [ -e /sys/module/rt2860v2_ap ]; then
					iwpriv ra0 set DisconnectAll="$DISSASSOC_REASON_FACTORY_RESET"
				fi

				sleep 2

				# to send disconnect event ...
				ifconfig ra0 down
			fi
		fi
	else
		if [ -e /sys/class/net/rai0 ]; then
			ifconfig rai0 down
		fi
	fi
fi

#IPAutoAssign settings restoring
if [ "$is_software_update" != "1" ]; then
	reset_autoassign_flags.sh
fi

#Erasing flag that means uboot got RSN credentials
nvram_set uboot "RescueGotCredentials" "0"

old_nvram_tmp_value="/tmp/${PLATFORM}_old"
new_nvram_tmp_value="/tmp/${PLATFORM}_new"

echo "Read nvram to $old_nvram_tmp_value" > "$output_dev"
celeno_init show "$PLATFORM_NVRAM" > "$old_nvram_tmp_value"

echo "Create new nvram in $new_nvram_tmp_value" > "$output_dev"
cat "$default_file" >"$new_nvram_tmp_value"
echo >>"$new_nvram_tmp_value"

echo "Update the new NVRAM temp file with _DEFAULT_s from the old NVRAM" > "$output_dev"
sed -n -e "s/\(.*\)#.*/\1/" -e "s/^_DEFAULT_\(.\+\)=\(.*\)/\1=\2\n_DEFAULT_\1=\2/p" <"$old_nvram_tmp_value" >>"$new_nvram_tmp_value"

echo "Update the new NVRAM temp file with keep values" > "$output_dev"
sed -e "s/\(.*\)#.*/\1/" -e "/^[[:space:]]*$/d" <"$keep_file" >"${new_nvram_tmp_value}.keep"
sed -e "s/\(.*\)#.*/\1/" -e "/^[[:space:]]*$/d" <"$new_nvram_tmp_value" |
awk -F'=' -v keeps="${new_nvram_tmp_value}.keep" -v nvram="$old_nvram_tmp_value" -v warningsFile="${new_nvram_tmp_value}.wrn" '
BEGIN {
	while ((getline <keeps) > 0)
		keep[$0];
	while ((getline) > 0) {
		print $0
		if ($0 = "Default")
			break;
	}
	OFS = "=";
}
{
	if (NF>=2)
		defs[$1] = substr($0, length($1) + 2);
}
END {
	while ((getline <nvram) > 0) {
		isDefault=$1 in defs;
		isKeep=$1 in keep;
		if (isDefault) {
			if (isKeep) {
				print $0;
			} else {
				print $1, defs[$1];
			}
			delete keep[$1];
			delete defs[$1];
		}
		else
		{
			if (isKeep)
				print "Warning: Key \"" $1 "\" was found in the keep file but has no defaults." >warningsFile;
		}
	}
	for (defaultKey in defs)
		print defaultKey, defs[defaultKey];
} ' >"${new_nvram_tmp_value}.tmp"
mv "${new_nvram_tmp_value}.tmp" "$new_nvram_tmp_value"
cat "${new_nvram_tmp_value}.wrn" 2>/dev/null
rm -f "${new_nvram_tmp_value}.wrn" "${new_nvram_tmp_value}.keep"

echo "Clear NVRAM" > "$output_dev"
# Restore nvram defaults
celeno_init clear "$PLATFORM_NVRAM"
sleep 2 # Ralink

echo "Renew NVRAM with $new_nvram_tmp_value" > "$output_dev"
celeno_init renew "$PLATFORM_NVRAM" "$new_nvram_tmp_value"

echo "Remove $old_nvram_tmp_value and $new_nvram_tmp_value " > "$output_dev"
rm -f "$old_nvram_tmp_value" "$new_nvram_tmp_value"

tr069_writeconfig() {
    TR069DM=`nvram_get $PLATFORM_NVRAM TR069DM`
    if [ "$TR069DM" == "TR098" ] ; then
        cp -f /etc_ro/tr069/tr.xml /etc_ro/tr069/tr.conf /etc/tr069
    else
        cp -f /etc_ro/tr069/tr106.xml /etc/tr069/tr.xml
        cp -f /etc_ro/tr069/tr106.conf /etc/tr069/tr.conf
    fi
    TR069OUI=`nvram_get $PLATFORM_NVRAM TR069OUI`
    if [ -n "$TR069OUI" ]; then
        sed -i "s/001C51/$TR069OUI/g" /etc/tr069/tr.conf
    fi
    TR069VA=`nvram_get $PLATFORM_NVRAM TR069VA`
    if [ -n "$TR069VA" ]; then
        sed -i "s/001C51/$TR069VA/g" /etc/tr069/tr.xml
    fi
}

if [ "$is_software_update" == "1" ]; then
    # Overwrite TR-069 config during sw update
    cp -r /etc_ro/tr069 /etc
    tr069restore.sh
    rm -f /etc/tr069/libdev.so /etc/tr069/client.crt /etc/tr069/client.key /etc/tr069/ca.pem /etc/tr069/tr106.xml /etc/tr069/tr106.conf
    rm -f /etc/tr069/*pwd* >/dev/null 2>/dev/null
    tr069_writeconfig
else
    tr069restore.sh
    # Reset event after restore defaults or FactoryReset
    rm -f /etc/tr069/.FLAG_NEED_FACTORY_RESET
    line=`cat /etc/tr069/tr.xml | head -n 2 | grep InternetGatewayDevice | sed s/\"//g`
    if [ "$TR069DM" == "TR098" ] ; then
        if [ -z "$line" ] ; then
            echo "TR-069: overwriting configuration files" > /dev/console
            echo "reason: TR069DM data model parameter changed to TR098" > /dev/console
            tr069_writeconfig
        fi
    else
        if [ -n "$line" ] ; then
            echo "TR-069: overwriting configuration files" > /dev/console
            echo "reason: TR069DM data model parameter changed to TR106" > /dev/console
            tr069_writeconfig
        fi
    fi
    rm -f /etc/tr069/.FLAG_BOOTSTRAP >/dev/null
    tr069_writeconfig
fi
tr069save.sh -f

if [ "$is_software_update" != "1" ]; then
    if [ "$is_mode_change" = "0" ]; then
        if [ -e /sys/module/rt2860v2_sta ]; then
            # schedule event notification to AP
            # "The device has been reset to factory defaults on STA %s (%s)"
            nvram_set SystemResetInfo FactoryReset
        else
            celog "The device has been reset to factory defaults on AP"
        fi
    fi

    # always set operational mode when restoring default!
    cemgr.sh load_mode_set 1
    nvram_set AutoDetectProcessDone 0
fi

if [ "$reboot_device" == "1" ]; then
    # reboot is done only if it is not software update
    echo "Reboot" > $output_dev
    reboot
fi
