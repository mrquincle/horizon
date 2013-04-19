#!/bin/sh

readonly DEFAULT_DHCP_DISCOVER_TIMEOUT=10
readonly DEFAULT_DHCP_DISCOVER_RETRY=3

. /sbin/config.sh
. /sbin/eeprom_config.sh
. /sbin/gmm_hw.sh


ap_sta_mode="unknown"
autodetect_mode="unknown"
is_autodetected_by_dhcp="0"

debug()
{
    echo -n "$0: "
    echo $*;
}


get_gpio_bitmap()
{
    bitmap=0x0
    i=0
    while [ "$i" -lt "32" ]; do
        bit_val=`cegpio get $i | awk '{print $3}'`
        pos=$(( 1 << $i ))
        if [ "$bit_val" = "1" ]; then
            let "bitmap=$bitmap|$pos"
        fi
        i=$(( i + 1 ))
    done
}


get_gpio_state()
{
#    gpio_state=$(( `cegpio llread | awk '{print $3}'` ))
    get_gpio_bitmap
    gpio_state=$bitmap
    gpio_state_str=`echo $gpio_state | awk '{printf("0x%08X\n", $1)}'`
    debug "gpio_state1: $gpio_state_str"

    # debounce
    sleep 1
#    gpio_state2=$(( `cegpio llread | awk '{print $3}'` ))
    get_gpio_bitmap
    gpio_state2=$bitmap
    gpio_state_str2=`echo $gpio_state2 | awk '{printf("0x%08X\n", $1)}'`
    debug "gpio_state2: $gpio_state_str2"
}


get_hw_switch_state()
{
    if [ -z "$operation_mode_hw_switch_desc" ]; then
        debug "No HW switch descriptor"
        hw_switch_state="unknown"
        return
    fi

    get_gpio_state

    hw_switch_state=$(
        found=0
        while read -r LINE; do
            if [ -z "$LINE" ]; then
                continue
            fi

            mode=`echo "$LINE" | awk '{print $1}'`
            bitmap=$(( `echo "$LINE" | awk '{print $2}'` ))
            bitmask=$(( `echo "$LINE" | awk '{print $3}'` ))

            if [ $(( $gpio_state & $bitmask )) -eq $bitmap ]; then
                if [ $(( $gpio_state & $bitmask )) -eq $(( $gpio_state2 & $bitmask )) ]; then
                    echo "$mode"
                else
                    echo "unknown"
                fi
                found=1
                break
            fi
        done << __EOF__
        $operation_mode_hw_switch_desc
__EOF__
        if [ "$found" = "0" ]; then
            echo "unknown"
        fi
    )
}


check_operational_mode()
{
    if [ "$( get_eeprom_value EEPROM_Magic )" != "0xCECE" ]; then
        debug "ERROR: Illegal eeprom magic! ($eeprom_val)"
        exit 1
    fi

    if [ "$( get_eeprom_value Load_Mode )" != "1" ]; then
        debug "Production mode! Exiting"
        exit 1
    fi

    if [ "$CONFIG_CELENO_INIC_MODE" = "y" ]; then
        debug "iNIC mode! Exiting"
        exit 1
    fi
}


get_ap_sta_mode()
{
    ap_sta_mode=`nvram_get 2860 ethConvert`
    if [ "$ap_sta_mode" = "1" ]; then
        ap_sta_mode="sta"
    else
        ap_sta_mode="ap"
    fi
}

# arguments:
#   $1: mode <"ap" | "sta">
#   $2: set is_autodetected_by_dhcp to 1 <"0" | "1">
set_mode()
{
    if [ "$#" = "2" ]; then
        if [ "$1" = "sta" ]; then
            real_val="1"
        else
            real_val="0"
        fi

        nvram_set ethConvert "$real_val"

        cemgr.sh op_mode_set "$1"
        if [ "$2" = "1" ]; then
            set_dhcp_autodetected_state "1"
        fi
        # Save active Autodetect Mode after reboot
        set_autodetect_mode "1"
        ce_reset.sh ConfigChangeReset
    else
        debug "set_mode() bad argument number"
    fi
}


get_autodetect_mode()
{
    autodetect_mode=`nvram_get 2860 AutoDetectMode`
}


set_autodetect_mode()
{
    nvram_set AutoDetectMode "$1"
}


get_dhcp_autodetected_state()
{
    is_autodetected_by_dhcp=`nvram_get 2860 AutoDetectProcessDone`
}


set_dhcp_autodetected_state()
{
    nvram_set AutoDetectProcessDone "$1"
}


get_dhcp_discover_timeout()
{
    dhcp_discover_timeout=`nvram_get 2860 AutoDetectGWTimeout`
    if [ -z "$dhcp_discover_timeout" ]; then
        dhcp_discover_timeout="$DEFAULT_DHCP_DISCOVER_TIMEOUT"
    fi
    debug "DHCP timeout: $dhcp_discover_timeout"
}


get_dhcp_discover_retry()
{
    dhcp_discover_retry=`nvram_get 2860 AutoDetectGWRetry`
    if [ -z "$dhcp_discover_retry" ]; then
        dhcp_discover_retry="$DEFAULT_DHCP_DISCOVER_RETRY"
    fi
    debug "DHCP retry: $dhcp_discover_retry"
}


find_dhcp_server()
{
    get_dhcp_discover_timeout
    get_dhcp_discover_retry

    udhcpc -D -T "$dhcp_discover_timeout" -t "$dhcp_discover_retry" -i "br0" -l "br0" > /dev/null 2> /dev/null
    if [ "$?" = "0" ]; then
        is_dhcp_server_found="1"
    else
        is_dhcp_server_found="0"
    fi
}


lan_up()
{
    /etc/init.d/bridge.sh start
    /etc/init.d/ethernet.sh
}


lan_down()
{
    /etc/init.d/bridge.sh stop
}
#-------------------------------------------------------------------------------

check_operational_mode

get_autodetect_mode
if [ "$autodetect_mode" = "1" ]; then
    echo "Start of AP/Client mode autodection ..."
    celog "Start of AP/Client mode autodection"
    get_ap_sta_mode
    get_dhcp_autodetected_state
    get_hw_switch_state
    debug "HW switch state: [${hw_switch_state}]"
    if [ "$hw_switch_state" = "auto" ] || [ "$hw_switch_state" = "unknown" ]; then
        if [ "$is_autodetected_by_dhcp" = "0" ]; then
            debug "Start autodetection by DHCP ..."
            lan_up
            find_dhcp_server
            if [ "$is_dhcp_server_found" = "1" ]; then
                new_mode="ap"
                debug "DHCP server found"
            else
                new_mode="sta"
                debug "DHCP server not found"
            fi

            if [ "$ap_sta_mode" != "$new_mode" ]; then
                echo "New network configuration. Changing mode to [${new_mode}] ..."
                celog "New network configuration. Changing mode to [${new_mode}]"
                set_mode "$new_mode" "1"
            else
                set_dhcp_autodetected_state "1"
            fi
            lan_down
        fi
    elif [ "$hw_switch_state" = "ap" ] || [ "$hw_switch_state" = "sta" ]; then
        if [ "$hw_switch_state" != "$ap_sta_mode" ]; then
            echo "New HW switch position. Changing mode to [${hw_switch_state}] ..."
            celog "New HW switch position. Changing mode to [${hw_switch_state}]"
            set_mode "$hw_switch_state" "0"
        fi
    else
        debug "ERROR: Illegal HW switch state: [${hw_switch_state}]"
    fi
fi

exit 0
