#! /bin/sh

. /sbin/config.sh

#EEDEBUG="y"
EEDEBUG="n"

if [ "$EEDEBUG" = "y" ]; then
  output_dev="/dev/console"
else
  output_dev="/dev/null"
fi

# invocation  : get_eeprom_value GPIO_VERSION
# output      : 0x01
# exit status : 0 on success, not 0 on fault
get_eeprom_value()
{
    local readonly param=$1
    local output

    output=$( cemgr2 g "$param" )
    if [ $? -ne 0 ]; then
        echo "get_eeprom_value: can't access \"$param\"" > /dev/console
        return 1
    fi

    echo "$output" | sed -rn '
        /\[/ {
            s/.*\[(.*)\].*/\1/p
            q
        }
    '

    return 0
}

EEPROM_5G_MAGIC_ADDR=0
EEPROM_RA0_MAC_1_ADDR=4
EEPROM_RA0_MAC_2_ADDR=6
EEPROM_RA0_MAC_3_ADDR=8
EEPROM_ETH3_MAC_1_ADDR=22
EEPROM_ETH3_MAC_2_ADDR=24
EEPROM_ETH3_MAC_3_ADDR=26
EEPROM_ETH2_MAC_1_ADDR=28
EEPROM_ETH2_MAC_2_ADDR=2A
EEPROM_ETH2_MAC_3_ADDR=2C
EEPROM_2_4G_MAGIC_ADDR=200
EEPROM_RAI0_MAC_1_ADDR=204
EEPROM_RAI0_MAC_2_ADDR=206
EEPROM_RAI0_MAC_3_ADDR=208

EEPROM_CELENO_MAGIC_ADDR=350
EEPROM_VERSION_ADDR=352
EEPROM_BOARD_PN_ADDR=354
EEPROM_BOARD_REV_ADDR=356
EEPROM_ACTIVE_ANTS_ADDR=358
EEPROM_MAX_BSSID_ADDR=359
EEPROM_LOAD_MODE_ADDR=35A
EEPROM_SERIAL_NUM_1_ADDR=35C
EEPROM_SERIAL_NUM_2_ADDR=35E
EEPROM_SERIAL_NUM_3_ADDR=360
EEPROM_SERIAL_NUM_4_ADDR=362
EEPROM_SERIAL_NUM_5_ADDR=364
EEPROM_SERIAL_NUM_6_ADDR=366
EEPROM_SERIAL_NUM_7_ADDR=368
EEPROM_52_WIRELESS_PIN_ADDR=36A
EEPROM_24_WIRELESS_PIN_ADDR=3A0
EEPROM_ETH_PHY1_ADDR=372
EEPROM_ETH_PHY1_MODE=373
EEPROM_ETH_PHY2_ADDR=374
EEPROM_ETH_PHY2_MODE=375
EEPROM_ETH_PHY_MASTER=376
EEPROM_GPIO_MAGIC_ADDR=378
EEPROM_GPIO_VERSION=37A
EEPROM_GPIO_MODE=37B
EEPROM_GPIO_LEDS=37C
EEPROM_GPIO_DIRECTIONS_BITMAP=380
EEPROM_GPIO_POLARITIES_BITMAP=384
EEPROM_GPIO_RESET_LEDS_BITMAP=388
EEPROM_GPIO_BOOT_LEDS_BITMAP=38C
EEPROM_GPIO_ERROR_LEDS_BITMAP=390
EEPROM_GPIO_RESET_OP=394
EEPROM_GPIO_BOOT_OP=395
EEPROM_GPIO_ERROR_OP=396
EEPROM_RESET_PERIOD=398
EEPROM_RESET_INDEX=39A
EEPROM_FLASH_SIZE=39C
EEPROM_JFFS_SIZE=39D
EEPROM_IMAGE_MODE=39E
EEPROM_CLIENT_IMAGE_SIZE=39F # in sectors
EEPROM_LAST_ADDRESS=3FF

EEPROM_FLASH_OFFSET=0x40000
EEPROM_ETH_SUPPORT_VER=4
EEPROM_NOT_AVAIL_STR="N/A"
WLAN_2_4_UP=`lsmod | grep RT3090_ap`
if [ "$WLAN_2_4_UP" != "" ]; then
    EFUSE_USED=`cat /sys/module/RT3090_ap/parameters/g_iEfuse`
else
    EFUSE_USED=0
fi
eeprom_val=0

eeprom_read_hex8()
{
    # this function is used to read 8 bit value from eeprom
    # value is stored in the global variable eeprom_val in hex format \ 2 digits \ upper case
    # address is $1

    if [ $((0x$1)) -gt $((0x$EEPROM_LAST_ADDRESS)) ]
    then
        eeprom_val=FF
        return
    fi

    eeprom_val=`cemgr2 r $1 1 | sed 1d | cut -b11-12 | tr -d ' ' | awk '{print toupper($0)}'`
    echo "eeprom_read_hex8: $eeprom_val" > $output_dev
}

eeprom_write_hex8()
{
    # this function is used to write 8 bit hex value in eeprom
    # address is $1
    # value is $2

    if [ $((0x$1)) -gt $((0x$EEPROM_LAST_ADDRESS)) ]
    then
        return
    fi

    cemgr2 w $1 $2
    echo "eeprom_write_hex8: $1 $2" > $output_dev
}

eeprom_read_hex16()
{
    # this function is used to read 16 bit value from eeprom
    # value is stored in the global variable eeprom_val in hex format \ 4 digits \ upper case
    # address is $1

    if [ $((0x$1)) -gt $((0x$EEPROM_LAST_ADDRESS)) ]
    then
        eeprom_val=FFFF
        return
    fi

    eeprom_val=`cemgr2 r $1 2 2 | sed 1d | cut -c11-15 | tr -d ' ' | awk '{print toupper($0)}'`
    echo "eeprom_read_hex16: $eeprom_val" > $output_dev
}

eeprom_write_hex16()
{
    # this function is used to write 16 bit hex value in eeprom
    # address is $1
    # value is $2

    eeprom_write_hex16_val_low=`echo $2 | cut -b3-4`
    if [ -z "$eeprom_write_hex16_val_low" ]; then
        eeprom_write_hex16_val_low=0
    fi

    eeprom_write_hex16_val_high=`echo $2 | cut -b1-2`
    if [ -z "$eeprom_write_hex16_val_high" ]; then
        eeprom_write_hex16_val_high=0
    fi

    eeprom_write_hex8 $1 $eeprom_write_hex16_val_low
    eeprom_write_hex16_high_addr=`echo $((0x$1 + 1)) | awk '{printf("%x", $0)}'`
    eeprom_write_hex8 $eeprom_write_hex16_high_addr $eeprom_write_hex16_val_high
    echo "eeprom_write_hex16: $1 $2" > $output_dev
}

eeprom_read_hex32()
{
    # this function is used to read 32 bit value from eeprom
    # value is stored in the global variable eeprom_val in hex format \ 8 digits \ upper case
    # address is $1

    eeprom_read_hex16 $1
    eeprom_read_hex32_val_low=$eeprom_val
    eeprom_read_hex32_high_addr=`echo $((0x$1+2)) | awk '{printf ("%x", $0)}'`
    eeprom_read_hex16 $eeprom_read_hex32_high_addr
    eeprom_read_hex32_high=$eeprom_val
    eeprom_val="$eeprom_read_hex32_high$eeprom_read_hex32_val_low"
    echo "eeprom_read_hex32: $eeprom_val" > $output_dev
}

eeprom_write_hex32()
{
    # this function is used to write 32 bit hex value in eeprom
    # address is $1
    # value is $2

    eeprom_write_hex32_val_low=`echo $2 | cut -b5-9`
    if [ -z "$eeprom_write_hex32_val_low" ]; then
        eeprom_write_hex32_val_low=0
    fi

    eeprom_write_hex32_val_high=`echo $2 | cut -b1-4`
    if [ -z "$eeprom_write_hex32_val_high" ]; then
        eeprom_write_hex32_val_high=0
    fi

    eeprom_write_hex16 $1 $eeprom_write_hex32_val_low
    eeprom_write_hex32_high_addr=`echo $((0x$1 + 2)) | awk '{printf("%x", $0)}'`
    eeprom_write_hex16 $eeprom_write_hex32_high_addr $eeprom_write_hex32_val_high
    echo "eeprom_write_hex32: $1 $2" > $output_dev
}

eeprom_read_dec8()
{
    # this function is used to read 8 bit value from eeprom
    # value is stored in the global variable eeprom_val in decimal format
    # address is $1

    eeprom_read_hex8 $1
    eeprom_val=$((0x$eeprom_val))
}

eeprom_write_dec8()
{
    # this function is used to write 16 bit decimal value in eeprom
    # address is $1
    # value is $2

    val=`echo $2 | awk '{printf("%02x", $0)}'`
    eeprom_write_hex8 $1 $val
}

eeprom_read_dec16()
{
    # this function is used to read 16 bit value from eeprom
    # value is stored in the global variable eeprom_val in decimal format
    # address is $1

    eeprom_read_hex16 $1
    eeprom_val=$((0x$eeprom_val))
}

eeprom_write_dec16()
{
    # this function is used to write 16 bit decimal value in eeprom
    # address is $1
    # value is $2

    eeprom_write_dec16_val=`echo $2 | awk '{printf("%04x", $0)}'`
    eeprom_write_hex16 $1 $eeprom_write_dec16_val
}

eeprom_read_dec32()
{
    # this function is used to read 32 bit value from eeprom
    # value is stored in the global variable eeprom_val in decimal format
    # address is $1

    eeprom_read_hex32 $1
    eeprom_val=$((0x$eeprom_val))
}

eeprom_write_dec32()
{
    # this function is used to write 32 bit decimal value in eeprom
    # address is $1
    # value is $2

    eeprom_write_dec32_val=`echo $2 | awk '{printf("%08x", $0)}'`
    eeprom_write_hex32 $1 $eeprom_write_dec32_val
}

eeprom_parse_phy_mode()
{
   speed=$((($1 >> 4) & 0x7))
   if [ "$speed" == "0" ]; then
       speed="auto"
       duplex=$EEPROM_NOT_AVAIL_STR
       pause=$EEPROM_NOT_AVAIL_STR
   elif [ "$speed" == "1" ]; then
       speed="10M"
   elif [ "$speed" == "2" ]; then
       speed="100M"
   elif [ "$speed" == "3" ]; then
        speed="1G"
   else
       speed=$EEPROM_NOT_AVAIL_STR
       duplex=$EEPROM_NOT_AVAIL_STR
       pause=$EEPROM_NOT_AVAIL_STR
   fi
   
    interface=$((($1 >> 0) & 0x3))
    if [ "$interface" == "0" ]; then
        interface="mii"
    elif [ "$interface" == "1" ]; then
        interface="rgmii"
    else
        interface=$EEPROM_NOT_AVAIL_STR
    fi
    
    if [ "$speed" != "auto" -a "$speed" != "$EEPROM_NOT_AVAIL_STR"  ]; then
        duplex=$((($1 >> 7) & 0x1))
        if [ "$duplex" == "0" ]; then
            duplex="half"
        elif [ "$duplex" == "1" ]; then
            duplex="full"
        else
            duplex=$EEPROM_NOT_AVAIL_STR
        fi

        pause=$((($1 >> 2) & 0x3))
        if [ "$pause" == "0" ]; then
            pause="none"
        elif [ "$pause" == "1" ]; then
            pause="rx only"
        elif [ "$pause" == "2" ]; then
            pause="tx only"
        elif [ "$pause" == "3" ]; then
            pause="tx and rx"
        else
            pause=$EEPROM_NOT_AVAIL_STR
        fi
    fi
}

# description: this function is used to read $3 bytes of binary data from a $1
# file name starting at $2 offset and write it to eeprom memory in the same
# $2 offset.
# parameters:
# param 1 - binary file name
# param 2 - start offset in file (0xhex format)
# param 3 - how many bytes to copy (decimal format) - must be aligned to 2
#           if not we do ceiling so 9 bytes and 10 bytes is the same
#

DEFAULT_EEPROM_FILE_NAME="eeprom.factory.bin"
DEFAULT_EEPROM_FILE_PATH="/etc/Wireless/RT2860"

eeprom_write_from_file()
{
    cd $DEFAULT_EEPROM_FILE_PATH

    if [ ! -f $1 ]; then
        cd - > /dev/null
        echo "$1 file not found, aborting ..."
        return 1
    fi

    FDATA=`od -x -v +$2 $1 | awk '{print $2" "$3" "$4" "$5" "$6" "$7" "$8" "$9}'`
#    echo $FDATA
    OFFSET=$2

    if [ "$3" == "" ]; then
        if [ "$OFFSET" = "0" ]; then
            # full eeprom burn
            i2ccmd eeprom write $DEFAULT_EEPROM_FILE_PATH/$1
            return
        fi

        LAST="UNBOUNDED"
    else
        LAST=`echo $(($((0x$OFFSET)) + $3 - 1)) | awk '{printf ("%x", $0)}'`
    fi

    echo "start=0x$OFFSET end=0x$LAST" > $output_dev

    for n in $FDATA
    do

        if [ $LAST != "UNBOUNDED" ]; then
            if [ $((0x$OFFSET)) -gt $((0x$LAST)) ]; then
                break
            fi
        fi

        eeprom_write_hex16 $OFFSET $n
        echo "writing $n to eeprom at $OFFSET offset." > $output_dev
        OFFSET=`echo $((0x$OFFSET + 2)) | awk '{printf ("%x", $0)}'`
    done

    cd - > /dev/null
    return 0
}

restore_eeprom_celeno_section()
{
    echo "restoring eeprom celeno section" > $output_dev
    # we start at offset 356 because:
    # 350 - CECE Celeno EEPROM magic will be set after all the section is copied.
    # 352 - EEPROM version will be set after all the section is copied. 
    # 354 - Board Type is never to be changed by definition.
    eeprom_write_from_file $DEFAULT_EEPROM_FILE_NAME $EEPROM_BOARD_REV_ADDR
    # if OK - update eeprom version
    if [ "$?" == 0  ]; then
        eeprom_write_hex16 $EEPROM_LOAD_MODE_ADDR 0001
    	eeprom_write_from_file $DEFAULT_EEPROM_FILE_NAME $EEPROM_CELENO_MAGIC_ADDR 4
    else
        echo "restoring eeprom celeno section failed!!!"
    fi
}

restore_eeprom_all()
{
    echo "restoring all eeprom" > $output_dev

    eeprom_write_from_file $DEFAULT_EEPROM_FILE_NAME $EEPROM_5G_MAGIC_ADDR

    # if OK - set load mode to operational 
    if [ "$?" == 0  ]; then
        echo "restoring eeprom OK !!!" > $output_dev
        if [ "$1" != "production" ] ; then
            eeprom_write_hex16 $EEPROM_LOAD_MODE_ADDR 0001
        fi
    else
        echo "restoring eeprom Failed !!!"
    fi
}

restore_eeprom_gpio_section()
{
    echo "restoring celeno gpio section" > $output_dev
    eeprom_write_from_file $DEFAULT_EEPROM_FILE_NAME $EEPROM_GPIO_MAGIC_ADDR 36
    if [ "$?" != 0  ]; then
        echo "restoring eeprom celeno gpio section failed!!!"
    fi
}

mac_addr_validate()
{
    local test_mac_addr=$1

    if [ -z "$test_mac_addr" ]
    then
        echo -en "ERROR: Illegal format [$test_mac_addr]! Aborting.\n\n"
        return 1
    fi

    local len=`expr length $test_mac_addr`
    if [ $len -ne 12 ]
    then
        echo -en "ERROR: Illegal mac address length [$len != 12]!\nExample for valid format: 001122334455. Aborting.\n\n"
        return 1
    fi

    local illegal_chars=`echo $test_mac_addr | sed -e 's/[0-9a-fA-F]//g'`
    if [ -n "$illegal_chars" ]
    then
        echo -en "ERROR: Illegal characters [$illegal_chars] in mac address [$test_mac_addr]!\nExample for valid format: 001122334455. Aborting.\n\n"
        return 1
    fi

    if [ "$test_mac_addr" = "FFFFFFFFFFFF" ]
    then
        echo -en "ERROR: MAC address is [$test_mac_addr] is Broadcast!\nExample for valid format: 001122334455. Aborting.\n\n"
        return 1
    fi

    local first_byte=`echo $test_mac_addr | cut -b1-2`
    local lsb_bit=$(( 0x$first_byte & 0x01 ))
    if [ $lsb_bit -ne 0 ]
    then
        echo -en "ERROR: MAC address is not Unicast!\nLeast significant bit in first byte [$first_byte] is set!\nExample for valid format: 001122334455. Aborting.\n\n"
        return 1
    fi

    return 0
}

# round $1 up to nearest power of two
up2pow()
{
	local n=1

	if [ -n "$1" ] && [ $1 -ge 0 ]
	then
		while [ $n -lt $1 ]
		do
			n=$(( $n << 1 ))
		done

		NEAREST_2_POWER=$n
	else
		echo "$0: wrong parameter passed"
	fi
}

check_MBSS()
{
	if [ -z "$1" ] || [ "$1" != "ra0" -a "$1" != "rai0" ]
	then
		return 0
	fi

	local MAIN_IF=$1
	local readonly MIN_VALID_MBSS=1
	local readonly MAX_VALID_MBSS=8
        local Val=""
        local TmpVal=""
        local MAX_MBSS=""
        local MAC_LSB=""

	if [ -z "$3" ]
	then
		Val=$(ifconfig $MAIN_IF | awk -F':' '/HWaddr/ { gsub(/[[:space:]]/,""); print $7 }')
	else
		mac_addr_validate $3
		if [ $? -ne 0 ]
		then
			return 1
		fi

		Val=`echo $3 | cut -c11-12`
	fi

	TmpVal=$((0x$Val))
	if [ $TmpVal -eq $TmpVal 2> /dev/null ]
	then
		MAC_LSB=$Val
	else
		echo "$0: error getting $MAIN_IF MAC address"
		return 1
	fi

	if [ -z "$2" ]
	then
		Val=$(/sbin/cemgr.sh max_bssid_get "$MAIN_IF" | awk '/Max BSSID Num/ {print $7}')
	else
		Val=$2
	fi

	TmpVal=$(($Val))
	if [ "$TmpVal" -eq "$TmpVal" 2> /dev/null ] && [ -n "$TmpVal" ]
	then
		if [ "$TmpVal" -lt "$MIN_VALID_MBSS" ] || [ "$TmpVal" -gt "$MAX_VALID_MBSS" ]
		then
			echo -en "$1 ERROR: Illegal max bssid num [$TmpVal]!" \
				"Valid range is $MIN_VALID_MBSS-$MAX_VALID_MBSS. Aborting.\n\n"
			return 1
		fi

                MAX_MBSS=$Val
	else
		echo "$0: error getting max BSSID num"
		return 1
	fi

	up2pow $MAX_MBSS
	if [ -z "$NEAREST_2_POWER" ]; then
		echo "$0: rounding error"
		return 1
	fi

	if [ $(( $((0x$MAC_LSB)) % $NEAREST_2_POWER )) -ne 0 ]
	then
		cat - <<- EOT
			WARNING: least significant BSSID byte (0x$MAC_LSB) should be multiple
			of max MBSS number ($MAX_MBSS) which is rounded up to the power of
			two ($NEAREST_2_POWER). You will not be able to use MBSS.
EOT

		return 1
	fi

	return 0
}

