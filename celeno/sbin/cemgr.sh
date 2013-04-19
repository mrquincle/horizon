#! /bin/sh

. /sbin/eeprom_config.sh

usage ()
{
    echo -en "Usage: cemgr.sh [option]...\n"
    echo -en "Options:\n\n"
    echo -en " mac_addr_get <interface>            : Get ethernet <interface> (all,eth2,eth3,ra0,rai0) <mac> address.\n"
    echo -en " mac_addr_set <interface>=<mac>      : Set ethernet <interface> (eth2,eth3,ra0,rai0) <mac> address\n"
    echo -en " mac_addr_set <interface>=<mac>,<num>: Set wireless <interface> (ra0,rai0) <mac> address. <num>=max bssid number.\n"
    echo -en " max_bssid_get <interface>           : Get wireless <interface> (all,ra0,rai0) max bssid number.\n"
    echo -en " max_bssid_set <interface>=<num>     : Set wireless <interface> (ra0,rai0) max bssid number <num>.\n\n"

    # eeprom commands
    echo -en " eeprom_check                        : check all eeprom sections magic numbers\n"
    echo -en " eeprom_restore_all                  : restore all eeprom defaults from file\n"
    echo -en " eeprom_restore_celeno               : restore eeprom celeno section defaults from file\n"
    echo -en " eeprom_show                         : Display EEPROM parameters\n\n"
    echo -en " load_mode_set <0 | 1>               : Set load mode (0=Production 1=Operational)\n\n"
    echo -en " serial_num_set <serial>             : Set board serial number (serial length <= 14 ascii characters)\n\n"
    echo -en " board_pn_set <pn>                   : Set board part number (decimal format)\n"
    echo -en " board_pn_get                        : Get board part number\n\n"
    echo -en " flash_size_set <flash size>         : Set flash size in MB\n\n"
    echo -en " jffs_size_set <jffs size>           : Set jffs size in sectors\n\n"
    echo -en " client_image_size_set <image size>  : Set ClientImage size in sectors\n\n"
    echo -en " image_mode_set <mode>               : Set image mode=<single | dual-factory | dual-flip>\n\n"
    echo -en " wps_pin_set <interface> <pin>       : Set wireless pin (8 decimal digits)\n\n"
    echo -en " phy_master_set <PHY1 | PHY2>        : Set 'master' PHY\n"
    echo -en " phy_mdio_cfg_set default|<0xvalue>  : Set PHY1 MDIO configuration\n"
    echo -en " phy_addr_set <addr1> <addr2>        : Set address (0 to 31) for PHY1 and PHY2\n"
    echo -en " phy_mode_set <PHY> < <val> <0xvalue> | [param1 val1] [param2 val2] [param3 val3] [param4 val4] >\n"
    echo -en "    phy_mode_set where paramn=<duplex | speed | pause | interface>  PHY=<1|2>\n"
    echo -en "    phy_mode_set where valn: duplex=<half|full>, speed=<auto|10M|100M|1G>\n"
    echo -en "    phy_mode_set where pause=<no|r|t|rt|tr> interface=<mii | rgmii | no>\n"
    echo -en "    example: phy_mode_set 2 interface mii speed 10M\n"
    echo -en "    example: phy_mode_set 1 val 0x01\n\n"
    echo -en " gpio_show                           : Show GPIO params\n"
    echo -en " gpio_set <param> <value>            : Set GPIO parameter\n"
    echo -en "     gpio_set where param=<magic (2 hex bytes) | version | mode (1 hex byte)>\n"
    echo -en "     gpio_set where param=<leds (4 hex bytes)| dir (4 hex bytes) | pol (4 hex bytes)>\n"
    echo -en "     gpio_set where param=<resetleds (4 hex bytes) | bootleds (4 hex bytes) | errleds (4 hex bytes)>\n"
    echo -en "     gpio_set where param=<resetop | bootop | errop | resetperiod | resetindex>\n"
    echo -en "     gpio_set where op can be 0 (off), 1 (on), 2x (blink), 3x (running); 0<=x<=9\n"
    echo -en "     example: gpio_set resetop 33 , \"run\" leds during reset with interval (3+1)*100ms\n\n"
    echo -en " op_mode_set <ap | sta>              : Set operation mode and restore defaults\n\n"
    echo -en " image_show                          : Display images information.\n\n"
    echo -en " nvram_show                          : Display NVRAM parameters\n"
    echo -en " nvram_clear_param <platform> <param> : Clear NVRAM parameter\n\n"
    echo -en " start_wps_pbc                       : Start wps pbc process\n"
    echo -en " start_wps_pin [pin code]            : Start wps pin process (pin code is required in STA mode only)\n\n"
    echo -en " ated                                : Restart ATE daemon\n\n"
    echo -en " active_ants_set <bitmap>            : Set active antennas (Bits 2:0 -> Chains 2-0)\n\n"
    echo -en " celog_show                          : Get logs from logger service\n\n"
    echo -en " vlan_config_show			   : Show VLAN configuration\n\n"
if [ "$is_sta_mode" == "0" ]; then
    echo -en " remote_log_set <params...>          : Config remote logging parameters\n"
    echo -en "                                       Usage: remote_log_set <0(dis) | 1(en)> <server> <folder> <username> <password> <interval>\n\n"
fi
    #echo -en "  iperf <params..>              : Run Tx Iperf: iperf tx udp [throughput (10M)] [length (1500B)] [duration] [rx ip addr]\n"
    #echo -en "                                                 iperf tx tcp [duration] [rx ip addr]\n"
    #echo -en "                                   Run Rx Iperf: iperf rx [udp/tcp]\n"
    #echo -en "                                   Stop   Iperf: iperf stop\n\n"
    exit
}

check_args_and_mode ()
{
    if [ "$args_num" != "$1" ]; then
        echo -en "ERROR: Wrong number of arguments. $1 arguments are expected.\n\n"
        usage
	exit
    fi
    if [ "$is_sta_mode" == "1" -a "$2" == "ap" ] || [ "$is_sta_mode" == "0" -a "$2" == "sta" ]; then
        usage
        exit
    fi
}

usage_and_exit()
{
    usage | grep "$1"
    exit
}

max_bssid_num_get_single()
{
    local interface=$1

    if [ -z "$interface" ]
    then
        return 1
    fi

    case "$interface" in
    "ra0")
        eeprom_read_dec8 $EEPROM_MAX_BSSID_ADDR
        max_bssid_num=$(($eeprom_val & 0x0F))
        ;;
    "rai0")
        if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" != "y" ]
        then
            echo -en "ERROR: Unsupported interface [$interface]! Skipping.\n\n"
            return 1
        fi

        eeprom_read_dec8 $EEPROM_MAX_BSSID_ADDR
        max_bssid_num=$((($eeprom_val & 0xF0) >> 4))
        ;;
    "eth2"|"eth3")
        echo -en "WARNING: Getting Max MBSSID Num for $interface is irrelevant. Ignoring.\n\n"
        return 1
        ;;
    *)
        echo -en "ERROR: Unsupported interface [$interface]! Aborting.\n\n"
        return 1
        ;;
    esac

    # always threat value "0" as "1"
    if [ "$max_bssid_num" -eq "0" ]; then
        max_bssid_num=1
    fi

    return 0
}

max_bssid_num_set_single()
{
    local interface=$1
    local max_bssid_num=$2

    if [ -z "$interface" -o -z "$max_bssid_num" ]
    then
        return 1
    fi

    case "$interface" in
    "ra0")
        echo -en "Setting Max MBSSID Num [$max_bssid_num] for $interface.\n"
        eeprom_read_dec8 $EEPROM_MAX_BSSID_ADDR
        new_max_bssid_num=$((($max_bssid_num & 0x0F) | ($eeprom_val & 0xF0)))
        eeprom_write_dec8 $EEPROM_MAX_BSSID_ADDR $new_max_bssid_num
        ;;
    "rai0")
        if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" != "y" ]
        then
            echo -en "ERROR: Unsupported interface [$interface].\n\n"
            return 1
        fi

        echo -en "Setting Max MBSSID Num [$max_bssid_num] for $interface.\n"
        eeprom_read_dec8 $EEPROM_MAX_BSSID_ADDR
        new_max_bssid_num=$(((($max_bssid_num & 0x0F) << 4 ) | ($eeprom_val & 0x0F)))
        eeprom_write_dec8 $EEPROM_MAX_BSSID_ADDR $new_max_bssid_num
        ;;
    "eth2"|"eth3")
        echo -en "WARNING: Setting Max MBSSID Num for $interface is irrelevant. Ignoring.\n\n"
        return 1
        ;;
    *)
        echo -en "ERROR: Unsupported interface [$interface]! Aborting.\n\n"
        return 1
        ;;
    esac

    return 0
}

mac_addr_get_single()
{
    local interface=$1
    local for_display=$2
    local mac_addr_base=0

    case "$interface" in
    "eth2")
        mac_addr_base=$EEPROM_ETH2_MAC_1_ADDR
        ;;
    "eth3")
        mac_addr_base=$EEPROM_ETH3_MAC_1_ADDR
        ;;
    "ra0")
        mac_addr_base=$EEPROM_RA0_MAC_1_ADDR
        ;;
    "rai0")
        if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" != "y" ]
        then
            echo -en "ERROR: Unsupported interface [$interface]! Aborting.\n\n" 
            return 1
        fi

        mac_addr_base=$EEPROM_RAI0_MAC_1_ADDR
        ;;
    *)
        echo -en "ERROR: Unsupported interface [$interface]! Aborting.\n\n" 
        return 1
        ;;
    esac

    local i=0
    mac_addr_full=""
    while [ $i -lt 6 ]
    do
        curr_mac_addr=$(( $((0x$mac_addr_base)) + $i))
        curr_mac_addr=`echo $curr_mac_addr | awk '{printf("%x", $0)}'`
        eeprom_read_hex8 $curr_mac_addr
        mac_addr_full=$mac_addr_full$eeprom_val
        if [ "$for_display" = "yes" -a $i -lt 5 ]
        then
            mac_addr_full=$mac_addr_full":"
        fi
        i=$(($i + 1))
    done

    return 0
}

mac_addr_get()
{
    local if_list=""

    if [ $args_num -eq 0 ]
    then
        if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" = "y" ]
        then
            if_list="ra0 rai0 eth2 eth3 "
        else
            if_list="ra0 eth2 eth3 "
        fi
    elif [ $args_num -eq 1 ]
    then
        if [ "$1" = "all" ]
        then
            if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" = "y" ]
            then
                if_list="ra0 rai0 eth2 eth3 "
            else
                if_list="ra0 eth2 eth3 "
            fi
        else
            if_list=$1
        fi
    else
        if_list=$*
    fi

    for curr_if in $if_list
    do
        mac_addr_get_single $curr_if yes
        if [ $? -ne 0 ]
        then
            exit
        fi

        local display_mac_addr=$mac_addr_full
        echo -en "$curr_if mac address=[$display_mac_addr]"

        local curr_max_bssid_num=0
        if [ "$curr_if" = "ra0" -o "$curr_if" = "rai0" ]
        then
            max_bssid_num_get_single $curr_if
            if [ $? -eq 0 ]
            then
                curr_max_bssid_num=$max_bssid_num
            fi
        fi

        if [ $curr_max_bssid_num -ne 0 ]
        then
            echo -en ", Max BSSID Num=$curr_max_bssid_num\n"
        else
            echo -en "\n"
        fi
    done
}

check_duplicate_mac_addr()
{
    local interface=$1
    local check_mac_addr=$2
    local if_list=""

    if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" = "y" ]
    then
        if_list="ra0 rai0 eth2 eth3 "
    else
        if_list="ra0 eth2 eth3 "
    fi
    
    for curr_if in $if_list
    do
        if [ "$interface" != "$curr_if" ]
        then
            mac_addr_get_single $curr_if
            if [ $? -ne 0 ]
            then
                return 1
            fi

            local test_mac_addr=$mac_addr_full
            if [ "$test_mac_addr" = "$check_mac_addr" ]
            then
                echo -en "ERROR: MAC address for $interface [$check_mac_addr] is the same as MAC address for $curr_if [$test_mac_addr] !!!. Aborting\n\n"
                return 1 
            fi
        fi
    done

    return 0
}

mac_addr_set_single()
{
    local interface=$1
    local new_mac_addr=`echo $2 | awk '{print toupper($0)}'`
    local mac_addr_base=0

    mac_addr_validate $new_mac_addr
    if [ $? -ne 0 ]
    then
        return 1
    fi

    check_duplicate_mac_addr $interface $new_mac_addr
    if [ $? -ne 0 ]
    then
        return 1
    fi

    case "$interface" in
    "eth2")
        mac_addr_base=$EEPROM_ETH2_MAC_1_ADDR
        ;;
    "eth3")
        mac_addr_base=$EEPROM_ETH3_MAC_1_ADDR
        ;;
    "ra0")
        mac_addr_base=$EEPROM_RA0_MAC_1_ADDR
        ;;
    "rai0")
        if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" != "y" ]
        then
            echo -en "ERROR: Unsupported interface [$interface]! Aborting.\n\n" 
            return 1
        fi

        mac_addr_base=$EEPROM_RAI0_MAC_1_ADDR
        ;;
    *)
        echo -en "ERROR: Unsupported interface [$interface]! Aborting.\n\n" 
        return 1
        ;;
    esac

    # set interface mac addr
    echo "Setting $interface mac address [$new_mac_addr]."

    local i=0
    while [ $i -lt 6 ]
    do
        curr_mac_addr=$(( $((0x$mac_addr_base)) + $i))
        curr_mac_addr=`echo $curr_mac_addr | awk '{printf("%x", $0)}'`

        local j=$(($i * 2 + 1))
        local k=$(($i * 2 + 2))
        local curr_mac_val=`echo $new_mac_addr | cut -b$j-$k`
        eeprom_write_hex8 $curr_mac_addr $curr_mac_val
        i=$(($i + 1))
    done

    # check
    mac_addr_get_single $interface
    if [ $? -ne 0 ]
    then
        echo -en "ERROR: reading $interface mac address from eeprom failed! Aborting.\n\n"
        return 1 
    fi

    local test_mac_addr=$mac_addr_full
    if [ "$test_mac_addr" != "$new_mac_addr" ]
    then
        echo -en "ERROR: writing $interface mac address to eeprom failed! Aborting.\n\n"
        return 1 
    fi

    return 0
}

mac_addr_set()
{
    if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" = "y" ]
    then
        if [ $args_num -lt 1 -o $args_num -gt 4 ]
        then
            echo -en "ERROR: Wrong number of argumnets. 1-4 arguments are expected.\n\n"
            exit
        fi
    else
        if [ $args_num -lt 1 -o $args_num -gt 3 ]
        then
            echo -en "ERROR: Wrong number of argumnets. 1-3 arguments are expected.\n\n"
            exit
        fi
    fi

    while [ -n "$1" ]
    do
        local equal_exist=`echo $1 | sed -e 's/[^\=]//g'`
        if [ -z "$equal_exist" ]
        then
            echo -en "ERROR: Illegal format ($1)! Aborting.\n\n"
            exit
        fi

        local comma_exist=`echo $1 | sed -e 's/[^\,]//g'`
        local interface=`echo $1 | awk -F'=' '{print $1}'`
        local mac_value=`echo $1 | awk -F'=' '{print $2}'`

        if [ -z "$interface" -o -z "$mac_value" ]
        then
            echo -en "ERROR: Illegal format ! Aborting.\n\n"
            exit
        fi

        local new_mac_addr=""
        local new_max_bssid_num=""
        if [ -n "$comma_exist" ]
        then
            # take first part and eat any ':'
            new_mac_addr=`echo $mac_value | awk -F',' '{print $1}' | sed -e 's/://g'`
            new_max_bssid_num=`echo $mac_value | awk -F',' '{print $2}'`

            if [ -z "$new_max_bssid_num" ]
            then
                echo -en "ERROR: Illegal format ! Aborting.\n\n"
                exit
            fi
        else
            # take whole value and eat any ':'
            new_mac_addr=`echo $mac_value | sed -e 's/://g'`
            new_max_bssid_num=""
        fi

        mac_addr_set_single $interface $new_mac_addr
        if [ $? -ne 0 ]
        then
            exit
        fi

        if [ "$interface" = "ra0" -o "$interface" = "rai0" ]
        then
            if [ -n "$new_max_bssid_num" ]
            then
                # check compatibility between new MAC addr and new max bssid num
                check_MBSS $interface $new_max_bssid_num $new_mac_addr
                if [ $? -ne 0 ]
                then
                    exit
                fi

                max_bssid_num_set_single $interface $new_max_bssid_num
                if [ $? -ne 0 ]
                then
                    exit
                fi
            else
                echo -en "    Skip setting Max MBSSID Num for $interface.\n"
                echo -en "    You may use max_bssid_set command later if you wish.\n"

                # check compatibility between new MAC addr and existing max bssid num
                max_bssid_num_get_single $interface
                if [ $? -ne 0 ]
                then
                    exit
                fi

                check_MBSS $interface $max_bssid_num $new_mac_addr
                if [ $? -ne 0 ]
                then
                    exit
                fi
            fi
        fi

        shift
    done

    echo -en "Done. (Changes will take place after reboot)\n\n"
}

max_bssid_num_get()
{
    local if_list=""
    local readonly MIN_VALID_MBSS=1
    local readonly MAX_VALID_MBSS=8

    if [ $args_num -eq 0 ]
    then
        if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" = "y" ]
        then
            if_list="ra0 rai0 "
        else
            if_list="ra0 "
        fi
    elif [ $args_num -eq 1 ]
    then
        if [ "$1" = "all" ]
        then
            if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" = "y" ]
            then
                if_list="ra0 rai0 "
            else
                if_list="ra0 "
            fi
        else
            if_list=$1
        fi
    else
        if_list=$*
    fi

    for curr_if in $if_list
    do
        max_bssid_num_get_single $curr_if
        if [ $? -ne 0 ]
        then
            exit
        fi

        echo -ne "Max BSSID Num for $curr_if is $max_bssid_num"

        if [ "$max_bssid_num" -ge "$MIN_VALID_MBSS" -o "$max_bssid_num" -le "$MAX_VALID_MBSS" ]
        then
           echo -en "\n"
        else
           echo -en " - out of range ($MIN_VALID_MBSS-$MAX_VALID_MBSS)!!!\n" \
               "Please use max_bssid_set command to fix it\n\n"
        fi
    done
}

max_bssid_num_set()
{
    if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" = "y" ]
    then
        if [ $args_num -lt 1 -o $args_num -gt 2 ]
        then
            echo -en "ERROR: Wrong number of argumnets. 1-2 arguments are expected.\n\n"
            exit
        fi
    else
        if [ $args_num -ne 1 ]
        then
            echo -en "ERROR: Wrong number of argumnets. 1 argument is expected.\n\n"
            exit
        fi
    fi

    while [ -n "$1" ]
    do
        local equal_exist=`echo $1 | sed -e 's/[^\=]//g'`
        if [ -z "$equal_exist" ]
        then
            echo -en "ERROR: Illegal format ($1)! Aborting.\n\n"
            exit
        fi

        local interface=`echo $1 | awk -F'=' '{print $1}'`
        local new_max_bssid_num=`echo $1 | awk -F'=' '{print $2}'`

        if [ -z "$interface" -o -z "$new_max_bssid_num" ]
        then
            echo -en "ERROR: Illegal format ! Aborting.\n\n"
            exit
        fi

        mac_addr_get_single $interface
        if [ $? -ne 0 ]
        then
            exit
        fi

        local curr_mac_addr=$mac_addr_full
        check_MBSS $interface $new_max_bssid_num $curr_mac_addr
        if [ $? -ne 0 ]
        then
            exit
        fi

        max_bssid_num_set_single $interface $new_max_bssid_num
        if [ $? -ne 0 ]
        then
            exit
        fi

        shift
    done
}

check_5G_magic ()
{
    eeprom_read_hex16 $EEPROM_5G_MAGIC_ADDR
    if [ "$eeprom_val" != "3883" ]; then
        echo -en "ERROR: Illegal 5G eeprom magic [$eeprom_val]! \n\n"
        return 1
    fi

    return 0
}

check_2_4G_magic ()
{
    eeprom_read_hex16 $EEPROM_2_4G_MAGIC_ADDR
    if [ "$eeprom_val" != "3092" ]; then
        echo -en "ERROR: Illegal 2.4G eeprom magic [$eeprom_val]! \n\n"
        return 1
    fi

    return 0
}

check_celeno_magic ()
{
    eeprom_read_hex16 $EEPROM_CELENO_MAGIC_ADDR
    if [ "$eeprom_val" != "CECE" ]; then
        echo -en "ERROR: Illegal celeno eeprom magic [$eeprom_val]! (This option requires full flash image update)\n\n"
        return 1 
    fi

    return 0
}

check_gpio_magic()
{
    eeprom_read_hex16 $EEPROM_GPIO_MAGIC_ADDR
    if [ "$eeprom_val" != "AD01" ]; then
        echo -en "ERROR: Illegal gpio magic [$eeprom_val]! (No leds blinking)\n\n"
        return 1
    fi

    return 0
}

check_is_eeprom_exist()
{
    eeprom_write_hex16 $EEPROM_5G_MAGIC_ADDR 1234
    eeprom_read_hex16 $EEPROM_5G_MAGIC_ADDR

    if [ "$eeprom_val" == "1234" ]; then
        return 0 
    else
        return 1 
    fi
}

check_eeprom_magic_keys()
{
    check=valid

    check_5G_magic
    if [ $? = 1 ]; then
      echo "$0: 5G magic is not valid !!!" > $output_dev
      check=5G
    fi

    if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" = "y" -a "$EFUSE_USED" != "1" ]; then
      check_2_4G_magic
      if [ $? = 1 ]; then
        echo "$0: 2.4G magic is not valid !!!" > $output_dev
        check=2_4G
      fi
    fi

    check_celeno_magic
    if [ $? = 1 ]; then
      echo "$0: celeno magic is not valid !!!" > $output_dev
      check=celeno
    fi

    if [ "$check" == "valid" ]; then
        echo "check_eeprom_magic_keys: valid" > $output_dev
        return 0
    elif [ "$check" == "celeno" ]; then
        echo "check_eeprom_magic_keys: celeno invalid" > $output_dev
        return 1
    else
    	echo "check_eeprom_magic_keys: corrupted" > $output_dev
    	return 2
    fi
}

##############################################################################################
# Return Code: This eeprom check can return the following eeprom status: 
# 1. "eeprom status: valid"
# eeprom exist & valid - i.e. go on with regular wireless boot
# 2. "eeprom status: corrupted"
# invalid eeprom - i.e. boot without wireless drivers or restore all eeprom if in production
# 3. "eeprom status: celeno_restore"
# celeno eeprom section is invalid - i.e. boot without wireless drivers or restore celeno eeprom section if in production
# important note - the status returned must include "eeprom status:" in the string !!!
##############################################################################################
check_is_eeprom_valid_ext()
{

    check_eeprom_magic_keys
    rcode="$?"
    if [ "$rcode" == 1 ]; then
        echo "eeprom status: celeno restore"
        return 1
    elif [ "$rcode" == 2 ]; then
        echo "eeprom status: corrupted"
        return 1
    else
        echo "eeprom status: valid"
        return 0 
    fi
}

check_is_eeprom_valid()
{
    check_eeprom_magic_keys
    if [ "$?" != 0 ]; then
        echo "eeprom status: corrupted"
        exit 1
    fi

#    echo "eeprom status: valid"
    return 0
}

load_mode_set ()
{
    check_is_eeprom_valid

    # avoid unnecessary EEPROM write access
    eeprom_read_dec16 $EEPROM_LOAD_MODE_ADDR
    if [ "$eeprom_val" == "$1" ]; then
        echo -en "Setting load mode: nothing to do, already set\n"
        exit
    fi

    if [ "$1" == "0" ]; then
        echo -en "Setting load mode: Production\n"
    elif [ "$1" == "1" ]; then
        echo -en "Setting load mode: Operational\n"
    else
        usage
        exit
    fi
    
    # set load mode
    eeprom_write_dec16 $EEPROM_LOAD_MODE_ADDR $1

    # check
    eeprom_read_dec16 $EEPROM_LOAD_MODE_ADDR
    if [ "$eeprom_val" != "$1" ]; then
        echo -en "ERROR: writing load mode to eeprom failed! Aborting.\n\n"
        exit
    fi

    echo -en "Done. (Changes will take place after reboot)\n\n"
}

op_mode_set ()
{
    if [ "$1" == "ap" ]; then
        echo -en "Setting operation mode: AP\n"
        echo -en "Applying default settings ...\n"  
        restore_defaults.sh 2860 ap
    elif [ "$1" == "sta" ]; then
        echo -en "Setting operation mode: STA\n"
        echo -en "Applying default settings ...\n"  
        restore_defaults.sh 2860 sta
    else
        echo -en "ERROR: Unknown operation mode [$1]! Aborting.\n\n"
        exit
    fi
   
    echo -en "Done. (Do not perform any chnages in nvram until next reboot !!!)\n\n"
}

board_pn_set ()
{
    check_is_eeprom_valid

    # set board pn
    echo -en "Setting board part number: $1\n"
    eeprom_write_dec16 $EEPROM_BOARD_PN_ADDR $1

    # check
    eeprom_read_dec16 $EEPROM_BOARD_PN_ADDR
    if [ "$eeprom_val" != "$1" ]; then
        echo -en "ERROR: writing board part number to eeprom failed [$1 <> $eeprom_val]! Aborting.\n\n"
        exit
    fi
    echo -en "Done. (Changes will take place after reboot)\n\n"
}

board_pn_get ()
{
    check_is_eeprom_valid
    eeprom_read_dec16 $EEPROM_BOARD_PN_ADDR
    echo $eeprom_val > /var/run/board_pn
    echo $eeprom_val
}    

serial_num_set ()
{
    check_is_eeprom_valid

    serial_num_len=`expr length $1`
    if [ "$serial_num_len" -gt 14 ]; then
        echo -en "ERROR: Illegal serial number!. Serial number length should be less than or equal to 13 characters. Aborting.\n\n"
        exit
    fi

    echo -en "Setting serial number [$1].\n"

    cemgr2 s Serial_Number $1

    echo -en "Done. (Changes will take place after reboot)\n\n"
}

gpio_show ()
{
    check_gpio_magic

    eeprom_read_hex16 $EEPROM_GPIO_MAGIC_ADDR
    gpio_magic="0x$eeprom_val"

    eeprom_read_dec8 $EEPROM_GPIO_VERSION
    gpio_version="$eeprom_val"

    eeprom_read_hex8 $EEPROM_GPIO_MODE
    gpio_mode="0x$eeprom_val"

    eeprom_read_hex32 $EEPROM_GPIO_LEDS
    gpio_leds="0x$eeprom_val"

    eeprom_read_hex32 $EEPROM_GPIO_DIRECTIONS_BITMAP
    gpio_dir_leds="0x$eeprom_val"

    eeprom_read_hex32 $EEPROM_GPIO_POLARITIES_BITMAP
    gpio_pol_leds="0x$eeprom_val"

    eeprom_read_hex32 $EEPROM_GPIO_RESET_LEDS_BITMAP
    gpio_reset_leds_bitmap="0x$eeprom_val"

    eeprom_read_hex32 $EEPROM_GPIO_BOOT_LEDS_BITMAP
    gpio_boot_leds_bitmap="0x$eeprom_val"

    eeprom_read_hex32 $EEPROM_GPIO_ERROR_LEDS_BITMAP
    gpio_error_leds_bitmap="0x$eeprom_val"

    eeprom_read_dec8 $EEPROM_GPIO_RESET_OP
    gpio_leds_op_on_reset="$eeprom_val"

    eeprom_read_dec8 $EEPROM_GPIO_BOOT_OP
    gpio_leds_op_on_boot="$eeprom_val"

    eeprom_read_dec8 $EEPROM_GPIO_ERROR_OP
    gpio_leds_op_on_error="$eeprom_val"

    eeprom_read_dec16 $EEPROM_RESET_PERIOD
    gpio_reset_period="$eeprom_val"

    eeprom_read_dec8 $EEPROM_RESET_INDEX
    gpio_reset_index="$eeprom_val"

    # display params
    echo -en "GPIO Magic           : $gpio_magic\n"
    echo -en "GPIO Version         : $gpio_version\n"
    echo -en "GPIO Mode            : $gpio_mode\n"
    echo -en "GPIO led bits        : $gpio_leds\n"
    echo -en "GPIO direction bits  : $gpio_dir_leds\n"
    echo -en "GPIO polarity bits   : $gpio_pol_leds\n"
    echo -en "RESET leds bitmap    : $gpio_reset_leds_bitmap\n"
    echo -en "BOOT leds bitmap     : $gpio_boot_leds_bitmap\n"
    echo -en "ERROR leds bitmap    : $gpio_error_leds_bitmap\n"
    echo -en "Led op on reset      : $gpio_leds_op_on_reset\n"
    echo -en "Led op on boot       : $gpio_leds_op_on_boot\n"
    echo -en "Led op on error      : $gpio_leds_op_on_error\n"
    echo -en "Reset period         : $gpio_reset_period\n"
    echo -en "Reset index          : $gpio_reset_index\n"
    echo -en "\n"
}

image_show ()
{
    # get eeprom version
    eeprom_read_dec16 $EEPROM_VERSION_ADDR
    eeprom_version=$eeprom_val

    # get image mode
    if [ "$eeprom_version" -ge "4" ]; then
        eeprom_read_hex8 $EEPROM_IMAGE_MODE
        if [ "$eeprom_val" == "01" ]; then
            image_mode="Single"
        elif [ "$eeprom_val" == "02" ]; then
            image_mode="Dual (Factory mode)"
            is_dual_image=1
        elif [ "$eeprom_val" == "12" ]; then
            image_mode="Dual (Flip mode)"
            is_dual_image=1
        else
            image_mode="ERROR!!! [$((0x$eeprom_val))]"
        fi
    else
        image_mode="Single"
    fi

    # get active image
    active_image=`nvram_get uboot ActiveKernel`

    # get kernel images name
    primary_kernel_id=`dd if=/dev/mtdpart/Kernel bs=1 skip=32 count=28 2>/dev/null`
    if [ -e /dev/mtdpart/SecondaryKernel ]; then
        secondary_kernel_id=`dd if=/dev/mtdpart/SecondaryKernel bs=1 skip=32 count=28 2>/dev/null`
    fi

    # get flash size
    eeprom_read_dec8 $EEPROM_FLASH_SIZE
    flash_size="$eeprom_val MB"

    # get jffs size
    eeprom_read_dec8 $EEPROM_JFFS_SIZE
    jffs_size_inKB=$(($eeprom_val * 64))
    jffs_size="$eeprom_val sectors ($jffs_size_inKB KB)"

    # u-boot version
    uboot_version=`grep 'Celeno UBoot Version:.*-.*' /dev/mtdpart/Bootloader | sed 's/^.*: //'`

    if [ "$is_sta_mode" == "0" ]; then
        # get client image size
        eeprom_read_dec8 $EEPROM_CLIENT_IMAGE_SIZE
        client_image_size_inKB=$(($eeprom_val * 64))
        client_image_size="$eeprom_val sectors ($client_image_size_inKB KB)"
        if [ -e /dev/mtdpart/ClientImage ]; then
            client_image_id=`dd if=/dev/mtdpart/ClientImage bs=1 skip=32 count=28 2>/dev/null`
        fi
    fi

    # display params
    echo -en "u-boot version      : $uboot_version\n"
    if [ "$eeprom_version" -ge "$EEPROM_ETH_SUPPORT_VER" ]; then
        echo -en "Image mode          : $image_mode\n"
        if [ "$is_dual_image" == "1" ]; then
            echo -en "Active image        : $active_image\n"
        fi
    fi
    echo -en "Kernel image ID (1) : $primary_kernel_id\n"
    if [ "$is_dual_image" == "1" ]; then
        echo -en "Kernel image ID (2) : $secondary_kernel_id\n"
    fi
    if [ "$eeprom_version" -ge "$EEPROM_ETH_SUPPORT_VER" ]; then
        echo -en "Flash size          : $flash_size\n"
        echo -en "JFFS size           : $jffs_size\n"

        if [ "$is_sta_mode" == "0" ]; then
            echo -en "client image size   : $client_image_size\n"
            if [ "$client_image_id" != "" ]; then
                echo -en "client image id     : $client_image_id\n"
            fi
        fi
    fi
    echo -en "\n"
}

nvram_show ()
{
    if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" = "y" ]; then
        celeno_init show rtdev    
    fi
    celeno_init show 2860
}

nvram_clear_param ()
{
    if [ "$#" -eq "2" ]; then
        PLATFORM=$1
        old_nvram_tmp_value=/tmp/"$PLATFORM"_old
        new_nvram_tmp_value=/tmp/"$PLATFORM"_new
        echo "Default" > "$old_nvram_tmp_value"
        celeno_init show $PLATFORM >> "$old_nvram_tmp_value"
        is_exits=`cat "$old_nvram_tmp_value" | grep $2`
        if [ -z "$is_exits" ]; then
            echo "Parameter $2 does not exists in NVRAM"
            rm $old_nvram_tmp_value
            exit
        else
            echo "Deleting $2 from NVRAM"
            cat "$old_nvram_tmp_value" | awk -F'=' -v PARAM="$2" '($1 != PARAM) {print $0}' > "$new_nvram_tmp_value"
            celeno_init clear $PLATFORM
            celeno_init renew $PLATFORM "$new_nvram_tmp_value"
            #rm "$new_nvram_tmp_value"
        fi
        #rm $old_nvram_tmp_value
    else
        usage | grep "nvram_clear_param"
        exit
    fi
}

start_wps_pbc ()
{
    touch /sbin/wps_started
    if [ "$is_sta_mode" == "0" ]; then
        echo -en "Starting WPS-PBC process (AP) ...\n\n"
        celog "WPS has been started: WPS-PBC"
        iwpriv ra0 set WscMode=2
        iwpriv ra0 set WscGetConf=1
    elif [ "$is_sta_mode" == "1" ]; then

        iwpriv ra0 set WirelessMode="$(nvram_get WirelessMode)"

        echo -en "Starting WPS-PBC process (STA) ...\n"
        celog "WPS has been started: WPS-PBC"
        iwpriv ra0 wsc_cred_count 0
        iwpriv ra0 wsc_conf_mode 1
        iwpriv ra0 wsc_mode 2
        iwpriv ra0 wsc_start
    fi
}

start_wps_pin ()
{
    if [ "$is_sta_mode" == "0" ]; then
        # PIN code should be specified
        if [ "$args_num" != "1" ]; then
            echo -e "ERROR: Wrong number of arguments. 1 argument is expected.\n"
            exit
        fi

        wps_pin_len=`expr length $arg1`
        if [ "$wps_pin_len" != "8" ]; then
            echo -e "ERROR: Illegal WPS PIN code. PIN code length should be equal to 8. Aborting.\n"
            exit
        fi

        if [ "$arg1" -ge "0" ]; then
            touch /sbin/wps_started
        else
            echo -e "ERROR: Illegal WPS PIN code. PIN code should consists of decimal numbers only (0-9). Aborting.\n"
            exit
        fi

        echo -e "Starting WPS PIN process (AP) ...\n"
        celog "WPS has been started: WPS-PIN"
        iwpriv ra0 set WscConfMode=7
        iwpriv ra0 set WscMode=1
        iwpriv ra0 set WscPinCode="$arg1"
        iwpriv ra0 set WscGetConf=1
    elif [ "$is_sta_mode" == "1" ]; then
        if [ "$args_num" != "0" ]; then
            echo -e "ERROR: Wrong number of arguments. No arguments are expected.\n"
            exit
        fi

        iwpriv ra0 set WirelessMode="$(nvram_get WirelessMode)"

        echo -e "Starting WPS PIN process (STA) ...\n"
        celog "WPS has been started: WPS-PIN"
        iwpriv ra0 wsc_cred_count 0
        iwpriv ra0 wsc_conf_mode 1
        iwpriv ra0 wsc_mode 1
        iwpriv ra0 wsc_start
    fi
}

ated_restart ()
{
    killall -q ated
    ated
}

active_ants_set ()
{
    if [ "$1" -lt "0" -o "$1" -gt "7" ]; then
        echo -en "ERROR: Illegal value [$1]! Aborting.\n\n"
        exit
    fi
    iwpriv ra0 set ActiveAnts=$1  > $output_dev     
}

phy_addr_set()
{
    if [ "$1" -lt "0" -o "$1" -gt "31" ]; then
        if [ "$1" -ne "255" ]; then
            usage | grep "phy_addr_set"
            exit
        fi
    fi

    if [ "$2" -lt "0" -o "$2" -gt "31" ]; then
        if [ "$2" -ne "255" ]; then
            usage | grep "phy_addr_set"
            exit
        fi
    fi

    cemgr2 s Eth_Phy1_Addr "$1"
    cemgr2 s Eth_Phy2_Addr "$2"
}

phy_mode_set()
{
    if [ "$#" -ne "3" -a "$#" -ne "5" -a "$#" -ne "7" -a "$#" -ne "9" ]; then
        usage | grep "phy_mode_set"
        exit
    fi

    if [ "$1" -eq "1" ]; then
        eth_phy_mode_addr=$EEPROM_ETH_PHY1_MODE
    elif [ "$1" -eq "2" ]; then
        eth_phy_mode_addr=$EEPROM_ETH_PHY2_MODE
    else
        usage | grep "phy_mode_set"
        exit
    fi

    i=0
    for param in $1 $2 $3 $4 $5 $6 $7 $8 $9
    do
        index=$((index+1))
        eval phy_mode_arg$index=\"$param\"
    done

    if [ "$#" -eq "3" -a  "$2" == "val" ] ; then
        phy_mode="$(($3))"
    else
        eeprom_read_dec8 $eth_phy_mode_addr
        phy_mode=$eeprom_val
        for index in 2 4 6 8
        do
            eval param="\$phy_mode_arg$index"
            eval val="\$phy_mode_arg$((index + 1))"
            if [ "$param" == "duplex" ] ; then
                if [ "$val" == "full" ]; then
                    phy_mode=$((($phy_mode & 0x7f) | 0x80))
                elif [ "$val" == "half" ]; then
                    phy_mode=$((($phy_mode & 0x7f) | 0x00))
                else
                    echo "ERROR in duplex [$val]"
                fi
            elif [ "$param" == "speed" ] ; then
                if [ "$val" == "auto" ]; then
                    phy_mode=$((($phy_mode & 0x8f) | 0x00))
                elif [ "$val" == "10M" ]; then
                    phy_mode=$((($phy_mode & 0x8f) | 0x10))
                elif [ "$val" == "100M" ]; then
                    phy_mode=$((($phy_mode & 0x8f) | 0x20))
                elif [ "$val" == "1G" ]; then
                    phy_mode=$((($phy_mode & 0x8f) | 0x30))
                else
                    echo "ERROR in speed [$val]"
                fi
            elif [ "$param" == "pause" ] ; then
                if [ "$val" == "r" ]; then
                    phy_mode=$((($phy_mode & 0xf3) | 0x04))
                elif [ "$val" == "t" ]; then
                    phy_mode=$((($phy_mode & 0xf3) | 0x08))
                elif [ "$val" == "tr" -o "$val" == "rt" ]; then
                    phy_mode=$((($phy_mode & 0xf3) | 0x0c))
                 elif [ "$val" == "no" ]; then
                    phy_mode=$((($phy_mode & 0xf3) | 0x00))
                else
                    echo "ERROR in pause [$val]"
                fi
            elif [ "$param" == "interface" ] ; then
                if [ "$val" == "mii" ]; then
                    phy_mode=$((($phy_mode & 0xfc) | 0x00))
                elif [ "$val" == "rgmii" ]; then
                    phy_mode=$((($phy_mode & 0xfc) | 0x01))
                elif [ "$val" == "no" ]; then
                    phy_mode=255
                else
                    echo "ERROR in interface [$val]"
                fi
            else
                continue
            fi
        done
    fi

    eeprom_write_dec8 $eth_phy_mode_addr $phy_mode
}

phy_master_set()
{
    eeprom_read_dec8 $EEPROM_ETH_PHY_MASTER
    value=$(( eeprom_val & 0xf0 ))

    if [ "$1" == "PHY1" ]; then
       value=$(( value | 0x01 ))
    elif  [ "$1" == "PHY2" ]; then
       value=$(( value | 0x02 ))
    else
        usage | grep "phy_master_set"
        exit
    fi

    eeprom_write_dec8 $EEPROM_ETH_PHY_MASTER "$value"
}

phy_mdio_cfg_set()
{
    if [ "$1" = "default" ]; then
        mdio_cfg=0
    else
        mdio_cfg="$1"
        mdio_cfg=$(( mdio_cfg ))
        if [ "$mdio_cfg" -lt "0" ] || [ "$mdio_cfg" -gt "15" ]; then
            echo "MDIO configuration should be from [0x00..0x0f] range"
            exit
        fi
        mdio_cfg=$(( mdio_cfg | 0x02 ))
    fi

    eeprom_read_dec8 $EEPROM_ETH_PHY_MASTER
    eeprom_write_dec8 $EEPROM_ETH_PHY_MASTER $(( (eeprom_val & 0x0f) | (mdio_cfg << 4) ))
}

flash_size_set()
{
    if [ "$#" -eq "1" ]; then
       eeprom_write_dec8 $EEPROM_FLASH_SIZE $1
    else
        usage | grep "flash_size_set"
        exit
    fi
}

jffs_size_set()
{
    if [ "$#" -eq "1" ]; then
       eeprom_write_dec8 $EEPROM_JFFS_SIZE $1
    else
        usage | grep "jffs_size_set"
        exit
    fi
}

client_image_size_set()
{
    if [ "$#" -eq "1" ]; then
       eeprom_write_dec8 $EEPROM_CLIENT_IMAGE_SIZE $1
    else
        usage | grep "client_image_size_set"
        exit
    fi
}

image_mode_set()
{
    if [ "$1" == "single" ]; then
        eeprom_write_hex8 $EEPROM_IMAGE_MODE "1"
    elif  [ "$1" == "dual-factory" ]; then
        eeprom_write_hex8 $EEPROM_IMAGE_MODE "02"
    elif  [ "$1" == "dual-flip" ]; then
        eeprom_write_hex8 $EEPROM_IMAGE_MODE "12"
    else
        usage | grep "image_mode_set"
        exit
    fi
}

wps_pin_set()
{
    interface="$1"

    if [ "$interface" = "rai0" ] && [ "$CONFIG_RT3090_AP" != "" ]; then
        pin_addr="$EEPROM_24_WIRELESS_PIN_ADDR"
        pin_name="Wireless_PIN_2_4G"
    elif [ "$interface" = "ra0" ]; then
        pin_addr="$EEPROM_52_WIRELESS_PIN_ADDR"
        pin_name="Wireless_PIN"
    else
        usage_and_exit "wps_pin_set"
    fi

    if [ "$#" -eq "2" ]; then
        val="$2"
        if [ -z "${val##*[!0-9]*}" ]; then
            echo "PIN is not a number"
            usage_and_exit "wps_pin_set"
        fi

        len=${#val}
        if [ "$len" != "8" ] && [ "$len" != "16" ]; then
            echo "Invalid PIN length"
            usage_and_exit "wps_pin_set"
        fi

        if [ "$len" = "8" ]; then
            cemgr2 s "$pin_name" "$val"
        else
            echo "Hex format is supported but use of 8 decimal digit format is preferable"
            # omit 0x, if present
            val=${val#0x}
            val_low=`echo $val | cut -b9-16`
            val_high=`echo $val | cut -b1-8`
            eeprom_write_hex32 $pin_addr $val_low
            high_addr=$((0x$pin_addr + 4))
            high_addr=`echo $high_addr | awk '{printf("%x", $0)}'`
            eeprom_write_hex32 $high_addr $val_high
        fi

    else
        usage_and_exit "wps_pin_set"
    fi
}

gpio_set()
{
    if [ "$#" -ne "2" ]; then
        usage | grep "gpio_set"
        exit
    fi

    val=$2
    # omit 0x, if present
    val=${val#0x}

    if [ "$1" == "magic" ]; then
        echo "Reg=0x$EEPROM_GPIO_MAGIC_ADDR Val=0x$val"
        eeprom_write_hex16 $EEPROM_GPIO_MAGIC_ADDR $val
    elif [ "$1" == "version" ]; then
        echo "Reg=0x$EEPROM_GPIO_VERSION Val=0x$val"
        eeprom_write_dec8 $EEPROM_GPIO_VERSION $val
    elif [ "$1" == "mode" ]; then
        echo "Reg=0x$EEPROM_GPIO_MODE Val=0x$val"
        eeprom_write_hex8 $EEPROM_GPIO_MODE $val
    elif [ "$1" == "leds" ]; then
        echo "Reg=0x$EEPROM_GPIO_LEDS Val=0x$val"
        eeprom_write_hex32 $EEPROM_GPIO_LEDS $val
    elif [ "$1" == "dir" ]; then
        echo "Reg=0x$EEPROM_GPIO_DIRECTIONS_BITMAP Val=0x$val"
        eeprom_write_hex32 $EEPROM_GPIO_DIRECTIONS_BITMAP $val
    elif [ "$1" == "pol" ]; then
        echo "Reg=0x$EEPROM_GPIO_POLARITIES_BITMAP Val=0x$val"
        eeprom_write_hex32 $EEPROM_GPIO_POLARITIES_BITMAP $val
    elif [ "$1" == "resetleds" ]; then
        echo "Reg=0x$EEPROM_GPIO_RESET_LEDS_BITMAP Val=0x$val"
        eeprom_write_hex32 $EEPROM_GPIO_RESET_LEDS_BITMAP $val
    elif [ "$1" == "bootleds" ]; then
        echo "Reg=0x$EEPROM_GPIO_BOOT_LEDS_BITMAP Val=0x$val"
        eeprom_write_hex32 $EEPROM_GPIO_BOOT_LEDS_BITMAP $val
    elif [ "$1" == "errleds" ]; then
        echo "Reg=0x$EEPROM_GPIO_ERROR_LEDS_BITMAP Val=0x$val"
        eeprom_write_hex32 $EEPROM_GPIO_ERROR_LEDS_BITMAP $val
    elif [ "$1" == "resetop" ]; then
        echo "Reg=0x$EEPROM_GPIO_RESET_OP Val=0x$val"
        eeprom_write_dec8 $EEPROM_GPIO_RESET_OP $val
    elif [ "$1" == "bootop" ]; then
        echo "Reg=0x$EEPROM_GPIO_BOOT_OP Val=0x$val"
        eeprom_write_dec8 $EEPROM_GPIO_BOOT_OP $val
    elif [ "$1" == "errop" ]; then
        echo "Reg=0x$EEPROM_GPIO_ERROR_OP Val=0x$val"
        eeprom_write_dec8 $EEPROM_GPIO_ERROR_OP $val
    elif [ "$1" == "resetperiod" ]; then
        echo "Reg=0x$EEPROM_RESET_PERIOD Val=0x$val"
        eeprom_write_dec16 $EEPROM_RESET_PERIOD $val
    elif [ "$1" == "resetindex" ]; then
        echo "Reg=0x$EEPROM_RESET_INDEX Val=0x$val"
        eeprom_write_dec8 $EEPROM_RESET_INDEX $val
    else
        usage | grep "gpio_set"
        exit
    fi
}

celog_show()
{
    LOG_JFFS=/mnt/jffs/celog.bin
    LOG_PART=/dev/mtdpart/Log
    LOG_TMP=/tmp/celogd.log

    if killall -q -0 celogd; then
        killall -USR1 celogd
        sleep 1
        # get the log; remove junk; make the last log be the first one.
        cat $LOG_TMP | tr -d '\0' | awk '{ a[i++]=$0} END {for (j=i-1; j>=0;) print a[j--] }'
        rm -f $LOG_TMP
    else
        if [ -e $LOG_PART ]; then
            READ=$LOG_PART
        else
            READ=$LOG_JFFS
        fi
        # buffer_size/block_size = (64kb-4b)/4b = 16384
        dd if=$READ skip=1 bs=4 count=16384 2>/dev/null | tr -d '\0\377'
    fi
}
vlan_config_show()
{

    vlan_enabled=`nvram_get 2860 VlanSwitchEnable`
    echo VLAN switch enabled: VlanSwitchEnable = $vlan_enabled

    echo -e VLAN 4095 means untagged "\n"

    vlanIdMng=`nvram_get VlanIdMng`
    echo -e Management vlan : VlanIdMng = $vlanIdMng "\n"
    
    eth2Pvid=`nvram_get VlanEth2Pvid`
    eth3Pvid=`nvram_get VlanEth3Pvid`
    ra0Pvid=`nvram_get VlanRa0Pvid`
    rai0Pvid=`nvram_get VlanRai0Pvid`
    
    echo -e PVID: VlanEth2Pvid = $eth2Pvid VlanEth3Pvid = $eth3Pvid VlanRa0Pvid = $ra0Pvid VlanRai0Pvid = $rai0Pvid "\n"
    
    eth2TxUntag=`nvram_get VlanEth2TxUntag`
    eth3TxUntag=`nvram_get VlanEth3TxUntag`
    ra0TxUntag=`nvram_get VlanRa0TxUntag`
    rai0TxUntag=`nvram_get VlanRai0TxUntag`
    
    echo -e TxUntag: VlanEth2TxUntag = $eth2TxUntag VlanEth3TxUntag = $eth3TxUntag VlanRa0TxUntag = $ra0TxUntag VlanRai0TxUntag = $rai0TxUntag "\n"

    j=0
    while(true); do
    
	vlanId=`nvram_get VlanId$j`
    
	if [ "$vlanId" == "" ]; then      
	    break;                       
	fi         
	
	vlanMembers=VlanId$j\Members
	members=`nvram_get $vlanMembers`
	echo Members of VLAN $vlanId : VlanId$j\Members = $members
	
	let "j +=1"
    done    

}
remote_log_set ()
{
    if [ "$1" != "0" -a "$1" != "1" ]; then
        echo -en "ERROR: Illegal parameters! Aborting.\n\n"
        exit
    fi

    echo "Setting remote logging parameters:"
    echo "Enable ?           : $1"
    echo "FTP Server address : $2"
    echo "FTP Folder         : $3"
    echo "FTP Username       : $4"
    echo "FTP Password       : $5"
    echo "Interval (minutes) : $6"

    echo -en "\nPlease wait ...\n"
    nvram_set RemoteLogEnable $1 > $output_dev
    nvram_set RemoteLogFtpServerIp $2 > $output_dev
    nvram_set RemoteLogFtpFolder $3 > $output_dev
    nvram_set RemoteLogFtpUsername $4 > $output_dev
    nvram_set RemoteLogFtpPassword $5 > $output_dev
    nvram_set RemoteLogIntervalMinutes $6 > $output_dev

    # check
    RemoteLogEnable=`nvram_get RemoteLogEnable`
    RemoteLogFtpServerIp=`nvram_get RemoteLogFtpServerIp`
    RemoteLogFtpFolder=`nvram_get RemoteLogFtpFolder`
    RemoteLogFtpUsername=`nvram_get RemoteLogFtpUsername`
    RemoteLogFtpPassword=`nvram_get RemoteLogFtpPassword`
    RemoteLogIntervalMinutes=`nvram_get RemoteLogIntervalMinutes`
    if [ "$RemoteLogEnable" != "$1" -o "$RemoteLogFtpServerIp" != "$2" -o "$RemoteLogFtpFolder" != "$3" -o "$RemoteLogFtpUsername" != "$4" -o "$RemoteLogFtpPassword" != "$5" -o "$RemoteLogIntervalMinutes" != "$6" ]; then
        echo -en "ERROR: writing remote logging parameters to nvram failed! Aborting.\n\n"
        exit
    fi

    echo -en "Done. (Changes will take place after reboot)\n\n"
}

iperf_is_running ()
{
    is_running=`ps | grep -i iperf | grep -v grep`
    if [ "$is_running" != "" ]; then
        echo -en "Note: Iperf is already running !!! (Invoke 'cemgr.sh iperf stop' to stop it)\n"
    fi
}

iperf_go ()
{
    mode="$1"
    if [ "$mode" == "tx" ]; then
        # cemgr.sh iperf tx udp [throughput 10M] [length 1500B] [duration] [dest addr]
        # cemgr.sh iperf tx tcp [duration] [dest addr]
        transport="$2"
        if [ "$transport" == "udp" ]; then
            check_args_and_mode 6
            throughput="$3"
            length="$4"
            duration="$5"
            dest_addr="$6"
            echo -en "Runing Iperf: Tx UDP Throughput[$throughput] Length[$length] Duration[$duration] Dest[$dest_addr]\n\n"
            iperf_is_running
            iperf -c $dest_addr -u -P 1 -i 1 -p 5001 -l $length -f m -b $throughput -t $duration -T 1 &
        elif [ "$transport" == "tcp" ]; then
            check_args_and_mode 4
            duration="$3"
            dest_addr="$4"
            echo -en "Runing Iperf: Tx TCP Duration[$duration] Dest[$dest_addr]\n\n"
            iperf_is_running
            iperf -c $dest_addr -P 1 -i 1 -p 5001 -f k -t $duration -T 1 &
        else
            echo -en "Illegal parameter [$transport]! Aborting.\n\n"
        fi
    elif [ "$mode" == "rx" ]; then
        # cemgr.sh iperf rx udp
        # cemgr.sh iperf rx tcp
        check_args_and_mode 2
        transport="$2"
        if [ "$transport" == "udp" ]; then
            echo -en "Runing Iperf: Rx UDP\n"
            iperf_is_running
            iperf -s -u -P 0 -i 1 -p 5001 -f m &
        elif [ "$transport" == "tcp" ]; then
            echo -en "Runing Iperf: Tx TCP\n"
            iperf_is_running
            iperf -s -P 0 -i 1 -p 5001 -f m &
        else
            echo -en "Illegal parameter [$transport]! Aborting.\n"
        fi
        echo -en "Don't forget to run 'cemgr.sh iperf stop' to stop the process!\n\n"
    elif [ "$mode" == "stop" ]; then
        # cemgr.sh iperf stop
        check_args_and_mode 1
        echo -en "Stopping Iperf.\n\n"
        killall -q iperf
    else
        echo -en "Illegal parameter [$mode]! Aborting.\n\n"
    fi
}

#-------------
# Script Main
#-------------
echo -en "\n"

# check operation mode
is_sta_mode=`nvram_get ethConvert`
if [ "$is_sta_mode" != "0" -a "$is_sta_mode" != "1" ]; then
    echo -en "ERROR: Illegal operation mode (ethConvert=$is_sta_mode)! Aborting.\n\n"
    exit
fi

# check for verbose mode
if [ "$1" == "-v" ]; then
    debug=1
    output_dev="/dev/console"
    args_num=$(($# - 2))
    option=$2
    arg1=$3
    arg2=$4
    arg3=$5
    arg4=$6
    arg5=$7
    arg6=$8
    arg7=$9
    arg8=$10
    arg9=$11
else
    debug=0
    output_dev="/dev/null"
    args_num=$(($# - 1))
    option=$1
    arg1=$2
    arg2=$3
    arg3=$4
    arg4=$5
    arg5=$6
    arg6=$7
    arg7=$8
    arg8=$9
    arg9=$10
fi

# handle option
case "$option" in
    "help")
        usage
        ;;
    "eeprom_check")
        check_is_eeprom_valid_ext
        ;;
    "eeprom_restore_all")
        restore_eeprom_all $arg1
        ;;  
    "eeprom_restore_celeno")
        restore_eeprom_celeno_section
        ;;
    "mac_addr_get")
        mac_addr_get $arg1 $arg2 $arg3 $arg4
        ;;
    "mac_addr_set")
        mac_addr_set $arg1 $arg2 $arg3 $arg4
        ;;
    "max_bssid_get")
        max_bssid_num_get $arg1 $arg2
        ;;
    "max_bssid_set")
        max_bssid_num_set $arg1 $arg2
        ;;
    "load_mode_set")
        check_args_and_mode 1
        load_mode_set $arg1
        ;;
    "op_mode_set")
        check_args_and_mode 1
        op_mode_set $arg1
        ;;
    "board_pn_set")
        check_args_and_mode 1
        board_pn_set $arg1
        ;;
    "board_pn_get")
        check_args_and_mode 0
        board_pn_get 
        ;; 
    "serial_num_set")
        check_args_and_mode 1
        serial_num_set $arg1
        ;;
    "eeprom_show")
        check_args_and_mode 0
        cemgr2 e
        ;;
    "image_show")
        check_args_and_mode 0
        image_show
        ;;
    "nvram_show")
        check_args_and_mode 0
        nvram_show
        ;;
    "nvram_clear_param")
        nvram_clear_param $arg1 $arg2
        ;;
    "start_wps_pbc")
        check_args_and_mode 0
        start_wps_pbc
        ;;
    "start_wps_pin")
        # do not call check_args_and_mode
        # because on AP there are only one, and on STA there are no args
        start_wps_pin
        ;;
    "ated")
        check_args_and_mode 0
        ated_restart
        ;;
    "active_ants_set")
        check_args_and_mode 1
        active_ants_set $arg1
        ;;
    "phy_addr_set")
        check_args_and_mode 2
        phy_addr_set $arg1 $arg2
        ;;
    "phy_mode_set")
        phy_mode_set $arg1 $arg2 $arg3 $arg4 $arg5 $arg6 $arg7 $arg8 $arg9
        ;;
    "phy_master_set")
        phy_master_set $arg1
        ;;
    "phy_mdio_cfg_set")
        phy_mdio_cfg_set $arg1
        ;;
    "flash_size_set")
        flash_size_set $arg1
        ;;
    "jffs_size_set")
        jffs_size_set $arg1
        ;;
    "client_image_size_set")
        client_image_size_set $arg1
        ;;
    "image_mode_set")
        image_mode_set $arg1
        ;;
    "wps_pin_set")
        wps_pin_set $arg1 $arg2
        ;;
    "gpio_show")
        check_args_and_mode 0
        gpio_show
        ;;
    "gpio_set")
        gpio_set $arg1 $arg2 $arg3 $arg4 $arg5 $arg6 $arg7 $arg8 $arg9
        ;;
    "celog_show")
        check_args_and_mode 0
        celog_show
        ;;
    "vlan_config_show")
        check_args_and_mode 0
        vlan_config_show
        ;;
    "remote_log_set")
        check_args_and_mode 6 ap
        remote_log_set $arg1 $arg2 $arg3 $arg4 $arg5 $arg6
        ;;
    #"iperf")
    #    iperf_go $arg1 $arg2 $arg3 $arg4 $arg5 $arg6
    #    ;;
    *)
        usage
        ;;
esac

exit 0
