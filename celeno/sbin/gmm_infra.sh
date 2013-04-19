#!/bin/sh
. /sbin/config.sh

readonly STATE_OFF=0
readonly STATE_ON=1
readonly STATE_ACTIVE=2
readonly STATE_UNKNOWN=3
readonly MAX_NO_TRAFFIC_TIME=1000
readonly WPS_EAPOL_START_RECEIVED=4

trim()
{
    retval=$1
}

get_iwpriv_parameter()
{
	retval="`iwpriv "$1" show "$2" | sed '1s/[^:]*:\s*//; /^$/d; 1q'`"
}

get_specific_iwpriv_parameter()
{
	retval="`iwpriv "$1" show "$2" | sed -nr "1s/[^:]*:\s*//; /^$/d; s/^$3\s*=\s*(.*)/\1/p"`";
}

#sets buttons indexes according to file / constants 
ButtonsIndexesSet()
{
    if [ "$wps_button_gpio" != "" ]; then
        version_hex=`flash -r 40352 -c 1 | grep 352: | cut -d ' ' -f2`
        let version_dec=0x$version_hex
        if [ "$version_dec" -lt "4" ]; then
            cegpio buttonset $reset_button $reset_button_gpio
        else
            echo reset gpio as in eeprom
        fi
		cegpio buttonset $wps_button $wps_button_gpio
	else
		echo `gmm - no wps button index: $reset_button_gpio`
		echo `gmm - no wps button index: $wps_button_gpio`
	fi
}
#restoring deafaullts
RestoreDefaults()
{
            echo "restoring default settings due to user external request...."
            cegpio led $restore_defaults_bitmap $restore_defaults_state $restore_defaults_duration $restore_defaults_blink_interval_on $restore_defaults_blink_interval_off
            if [ "$part_number_dec" -eq "47" ]; then
                cegpio led $assoc_bitmap 0 -1
            fi

            if [ "$CONFIG_RT3090_AP" != "" ]; then
                /sbin/restore_defaults.sh 3090
            fi
            # 2860 makes reset
            /sbin/restore_defaults.sh 2860
            exit 0
}
#checks reset button - if pressed more then 10 seconds, restore defaults, if less, reboot
ResetButtonCheck()
{
    line=`cegpio buttonget $reset_button`
    set -- $line
    if [ "$4" -eq "0" ]; then
        if [ "$6" -gt "10000" ]; then
            RestoreDefaults
            exit 0
        fi
        if [ "$6" -gt "0" -a "$part_number_dec" -ne "82" -a "$part_number_dec" -ne "54" ]; then
            echo "rebooting due to user external request..."
            ce_reset.sh UIReset
            exit 0
        fi
    fi
    if [ "$4" -eq "1" ]; then
        if [ "$6" -gt "10000" ]; then
                RestoreDefaults
                exit 0
        fi
    fi
}

WPSPBCStart2860()
{
    if [ "$wlan_module_status_2860" = "up" ]; then
        cemgr.sh start_wps_pbc
    fi
}

WPSPBCStart3090()
{
    if [ "$wlan_module_status_3090" = "up" ]; then
        iwpriv rai0 set WscMode=2
        iwpriv rai0 set WscGetConf=1
    fi
}

WPSPBCStart()
{
    if [ "$wlan_module_status_2860" = "up" ] && [ "$wlan_module_status_3090" = "up" ]; then
        is_WPSConcurrency=1
    else
        is_WPSConcurrency=0
    fi
    WPSPBCStart2860
    WPSPBCStart3090
}

WPSPBCStop()
{
    echo "Stopping WPS on $1"

    iwpriv "$1" set WscGetConf=0
    iwpriv "$1" set WscStop=1
}

WPSProcessConcurrency()
{
    if [ $is_WPSConcurrency -eq 1 ]; then
        local interface="$1"
        local status="$2"
        local stop_interface="ra0"

        if [ $(( status )) -ge $WPS_EAPOL_START_RECEIVED ]; then
            if [ "$interface" = "ra0" ]; then
                stop_interface="rai0"
            fi
            WPSPBCStop "$stop_interface"
            is_WPSConcurrency=0
        fi
    fi
}

#checks wps button
WPSButtonCheck()
{
	line=`cegpio buttonget $wps_button`
	set -- $line
	if [ "$wps_check" -ne "0" ]; then
        cegpio buttonrst $wps_button
		return
	fi
	if [ "$6" -gt "2000" -o -e "/sbin/wps_started" ]; then
        if [ "$6" -gt "2000" ]; then
            WPSPBCStart
        else
            # Concurrency is managed in goahead
            is_WPSConcurrency=0
		fi
	    rm /sbin/wps_started
            #raises flag to check wps status
            wps_check="1"
            #resets press duration for wps button
            cegpio buttonrst $wps_button
            return
        fi	
}

WpsStatusParse()
{
    # for defines of following magic values search STATUS_WSC_ in driver

    case "$1" in
    0)
        retval="WPS not in use"
        ;;
    1)
        retval="Idle"
        ;;
    35)
        retval="Scanning..."
        ;;
    3|4|5|6|9|10|11|12|13|14|15|    \
    16|17|18|19|20|21|22|23|24|25|  \
    26|27|28|29|30|36|37|38|39|258)
        retval="In Process"
        ;;
    34)
        retval="Success"
        ;;
    2|7|8|31|32|33|257|258|259|260|261|262|263|264|265)
        retval="Failed"
        ;;
    *)
        echo "WpsStatusParse: error: wrong value given" >&2
        retval="Unknown status"
        return 1
        ;;
    esac
}

#puts wps status in retval
WpsStatusCheck()
{
    if [ "$1" == "rai0" ]; then
        local Chip="3090"
    else
        local Chip="2860"
    fi

    eval local module_status="\$wlan_module_status_$Chip"
    if [ "$module_status" != "up" ]; then
        return
    fi

    #if wps button was not pressed, WPS status does not nedd to be checked.
	#echo $wps_check
    if [ "$wps_check" -eq "0" ]; then
        return
    fi    
    #AP
    eval local ap_or_station="\$ap_or_station_$Chip"
    get_specific_iwpriv_parameter "$1" "WPSStatus" "WscStatus"
    WPSProcessConcurrency "$1" "$retval"
    WpsStatusParse "$retval"

    eval wps_state_$Chip=\"$retval\"

    if [ "$wps_state_2860" = "Success" ] || [ "$wps_state_3090" = "Success" ]; then
        retval="Success"
    elif [ "$wps_state_2860" = "In Process" ] || [ "$wps_state_3090" = "In Process" ] || \
       [ "$wps_state_2860" = "Scanning..." ] || [ "$wps_state_3090" = "Scanning..." ]
    then
        retval="In Process"
    fi

    if [ "$retval" != "$wps_state" ]; then
        case "$retval" in
            "In Process")
                no_traffic_time="0"
                cegpio led $wps_search_bitmap $wps_search_state $wps_search_duration $wps_search_blink_interval_on $wps_search_blink_interval_off
                wps_check="1"
                ;;
            "Success")
                cegpio buttonrst $wps_button
                cegpio led $wps_search_bitmap 1 -1
                cegpio led $wps_confirm_bitmap $wps_confirm_state $wps_confirm_duration $wps_confirm_blink_interval_on $wps_confirm_blink_interval_off
                wps_check="0"
                ;;
            *)
                cegpio led $wps_search_bitmap 1 -1 
                wps_check="0"
                ;;
        esac
        wps_state=$retval
    fi
}
#puts bitmap of associated video stations in retval
AssociationBitmapGet()
{
    get_iwpriv_parameter ra0 VideoAssocBitmap
}
#Checks if associated
LinkupCheck()
{
    if [ "$1" == "rai0" ]; then
        local Chip="3090"
        local assoc_bitmap=$assoc_bitmap_24
        local low_throughput_bitmap=$low_throughput_bitmap_24
    else
        local Chip="2860"
    fi

    eval local module_status="\$wlan_module_status_$Chip"
    if [ "$module_status" != "up" ]; then
        return
    fi

    eval local ap_or_station="\$ap_or_station_$Chip"

    if [ "$part_number_dec" -eq "82" -a "$ap_or_station" == "ap" ]; then
        cegpio led 0x1002000 0 -1
        return
    fi
    get_iwpriv_parameter "$1" "Linkup"
    local link_state="$retval"
    if [ "$link_state" = "1" ] && [ "$ap_or_station" = "sta" ]; then
        IsHdCapableCheck $1
        if [ "$IsHdCapable" == "0" ]; then
            cegpio led $assoc_bitmap 1 -1
            cegpio led $low_throughput_bitmap 1 -1
            eval assoc_last_bitmap_$Chip=\"2\"
            return
        elif [ "$IsHdCapable" == "1" ]; then
            cegpio led $assoc_bitmap 1 -1
            cegpio led $low_throughput_bitmap $low_throughput_state $low_throughput_duration $low_throughput_time_on $low_throughput_time_off
            eval assoc_last_bitmap_$Chip=\"2\"
            return 
        elif [ "$IsHdCapable" == "2" ]; then
            cegpio led $low_throughput_bitmap 1 -1
            cegpio led $assoc_bitmap $assoc_state $assoc_duration $assoc_blink_interval_on $assoc_blink_interval_off
            eval assoc_last_bitmap_$Chip=\"2\"
            return 
        fi
    fi

    # Checking CAC status. As CAC share one of WLAN LED we need to take off
    # this WLAN LED usual behaviour during CAC
    CACCheck $1

    eval local assoc_last_bitmap="\$assoc_last_bitmap_$Chip"
    if [ "$link_state" != "$assoc_last_bitmap" ]; then
        eval assoc_last_bitmap_$Chip=\"$link_state\"
        if [ "$link_state" -eq "0" ]; then
            cegpio led $low_throughput_bitmap 1 -1 
            if [ "$cac_is_on" -eq "0" ]; then
                cegpio led $assoc_bitmap 1 $assoc_duration $assoc_blink_interval_on $assoc_blink_interval_off
            fi
        else
            cegpio led $low_throughput_bitmap 1 -1 
            if [ "$cac_is_on" -eq "0" ]; then
                cegpio led $assoc_bitmap $assoc_state $assoc_duration $assoc_blink_interval_on $assoc_blink_interval_off
            fi
        fi
    fi
}
#checks if ap or client - nvram daemon is loaded before this application.
ApOrStaCheck()
{
    if [ "$1" == "rai0" ]; then
        local Chip="3090"
    else
        local Chip="2860"
    fi

    eval local module_status="\$wlan_module_status_$Chip"
    if [ "$module_status" != "up" ]; then
        return
    fi

    retval=`nvram_get 2860 ethConvert`
    if [ "$retval" == "" -o "$retval" -eq "0" ]; then 
        eval ap_or_station_$Chip=\"ap\"
    else
        eval ap_or_station_$Chip=\"sta\"
    fi

    eval local ap_or_station="\$ap_or_station_$Chip"

    echo "ap_or_station:$Chip=$ap_or_station"
}

NewStationCheck()
{
    retval=`nvram_get SSID1`
    if [ "$retval" == "" -a "$ap_or_station" == "sta" ]; then 
        new_sta="1"
    else
        new_sta="0"
    fi
}

# ===========================================================================
# Routine Description:
#         Check specified ethernet interface for traffic activity.
# Arguments:
#         interface($1) - name of ethernet interface.
# Return value:
#         Value type - one of {STATE_OFF (0), STATE_ON (1), STATE_ACTIVE (2)}
#         STATE_ON (1) - if interface is on but there is no traffic.
#         STATE_ACTIVE (2) - if interface is under traffic.
# Note:
#       To avoid collisions, this function have to be called once per 
#       iteration for specified interface.
# =========================================================================== 
CheckEthInterfaceTraffic()
{
    interface=$1

    eval prev_traffic_str="\$${interface}_traffic_str"
    # get string with RX packets and TX packets
    curr_traffic_str=`awk 'NR<=2 {next} /\<'"$interface"':/ {sub(".*:", ""); print $2 "," $12;}' < /proc/net/dev`
    eval "${interface}_traffic_str"=$curr_traffic_str

    if [ "$prev_traffic_str" = "$curr_traffic_str" ]; then
        return $STATE_ON # ON
    else
        return $STATE_ACTIVE # ACTIVE
    fi
}

# ===========================================================================
# Routine Description:
#         Check specified ethernet interface for link existance.
# Arguments:
#         interface($1) - name of ethernet interface.
#         eth_link($2) - status of ethernet link (on or off)
# Return value:
#         Value type - one of {STATE_OFF (0), STATE_ON (1), STATE_ACTIVE (2)}
#         STATE_OFF (0) - if interface has no link. 
#         STATE_ON (1) - if interface is on but there is no traffic.
#         STATE_ACTIVE (2) - if interface is under traffic.
# Note:
#       To avoid collisions, this function have to be called once per 
#       iteration for specified interface.
# =========================================================================== 
GetEthernetState()
{
    interface=$1
    eth_link=$2

    if [ "$eth_link" = "1" ]; then
        CheckEthInterfaceTraffic "$interface"
        return $? # ON or ACTIVE
    else
        return $STATE_OFF # interface is OFF
    fi
}

# ===========================================================================
# Routine Description:
#         Updates ethernet LEDs state according to specified ethernet interface state.
# Arguments:
#         interface($1) - name of ethernet interface.
#         interface_state($2) - current state interface state. 
# Return value:
#       None.
# Note:
#       To avoid collisions, this function have to be called once per 
#       iteration for specified interface.
# =========================================================================== 
UpdateEthernetLeds()
{
    interface=$1
    interface_state=$2

    eval interface_state_last="\$${interface}_state_last"
    if [ "$interface_state" = "$interface_state_last" ]; then
        return
    fi
    eval "${interface}_state_last"=$interface_state
    
    eval fail_bitmap="\$${interface}_fail_bitmap"
    eval fail_state="\$${interface}_fail_state"
    eval fail_duration="\$${interface}_fail_duration"
    eval fail_blink_interval_on="\$${interface}_fail_blink_interval_on"
    eval fail_blink_interval_off="\$${interface}_fail_blink_interval_off"

    eval bitmap="\$${interface}_bitmap"
    eval traffic_state="\$${interface}_traffic_state"
    eval duration="\$${interface}_duration"
    eval state="\$${interface}_state"
    eval traffic_duration="\$${interface}_traffic_duration"
    eval traffic_blink_interval_on="\$${interface}_traffic_blink_interval_on"
    eval traffic_blink_interval_off="\$${interface}_traffic_blink_interval_off"
    eval blink_interval_on="\$${interface}_blink_interval_on"
    eval blink_interval_off="\$${interface}_blink_interbal_off"

    # OFF - 0 ON - 1 ACTIVE - 2
    case "$interface_state" in
        "$STATE_OFF")
            if [ -n "$fail_bitmap" ]; then
                cegpio led "$fail_bitmap" "$fail_state" "$fail_duration" $fail_blink_interval_on $fail_blink_interval_off
            fi
            ;;
        "$STATE_ON")
            if [ -n "$bitmap" ]; then
                cegpio led "$bitmap" "$state" "$duration" $blink_interval_on $blink_interval_off
            fi
            ;;
        "$STATE_ACTIVE")
            if [ -n "$bitmap" ]; then
                cegpio led "$bitmap" "$traffic_state" "$traffic_duration" $traffic_blink_interval_on $traffic_blink_interval_off
            fi
            ;;
        *)
            echo "INVALID ETHERNET INTERFACE STATE!"
            ;;
    esac
}

EthStatusCheck()
{
    eth2_link=`cat /sys/module/raeth/parameters/g_iLink_stat 2>/dev/null | cut -d "," -f1`
    eth3_link=`cat /sys/module/raeth/parameters/g_iLink_stat 2>/dev/null | cut -d "," -f2`

    if [ "$eth2_link" = "1" ] || [ "$eth3_link" = "1" ]; then
        retval="1"
    else
        retval="0"
    fi

    GetEthernetState eth2 "$eth2_link"
    eth2_status=$?
    UpdateEthernetLeds eth2 "$eth2_status"

    GetEthernetState eth3 "$eth3_link"
    eth3_status=$?
    UpdateEthernetLeds eth3 "$eth3_status"

    if [ "$eth2_status" -eq "$STATE_ACTIVE" ] || [ "$eth3_status" -eq "$STATE_ACTIVE" ]; then
        no_traffic_time="0"
    else
        if [ "$no_traffic_time" -lt "$MAX_NO_TRAFFIC_TIME" ]; then
            no_traffic_time=$(($no_traffic_time+1))
        fi
    fi

    eth_status=$retval
}

CheckWLANModules()
{
    IFF_UP=0x0001
    if [ -e /sys/class/net/ra0 ]; then
        if [ $(( $( cat /sys/class/net/ra0/flags ) & IFF_UP )) -ne 0 ]; then
            wlan_module_status_2860="up"
        else
            wlan_module_status_2860="down"
        fi
    else
        wlan_module_status_2860="down"
    fi

    if [ -e /sys/class/net/rai0 ]; then
        if [ $(( $( cat /sys/class/net/rai0/flags ) & IFF_UP )) -ne 0 ]; then
            wlan_module_status_3090="up"
        else
            wlan_module_status_3090="down"
        fi
    else
        wlan_module_status_3090="down"
    fi
}

LedsOff()
{
       cegpio led $all_leds_bitmap 1 -1
       
       # reset states for ethernet interfaces
       eth2_state_last=$STATE_UNKNOWN
       eth3_state_last=$STATE_UNKNOWN
}

IsHdCapableCheck()
{
	get_iwpriv_parameter "$1" "LqCapability"
    IsHdCapable="$retval"
}

AssociatedAPInPsMode="0"
PsModeInAssociatedApCheck()
{
    AssociatedAPInPsMode=`cat /sys/module/rt2860v2_sta/parameters/g_iAssocApInPsMode`
}

IsInterfaceUp()
{
    local IsAbsent=`ifconfig | grep "$1" `
    if [ -n "$IsAbsent" ]; then
        return 0
    else
        return 1
    fi
}

DFSStatusCheck()
{
    dfs_enabled=`nvram_get IEEE80211H`
}

# Check for Channel Availability Check (CAC): Power, WPS and LAN1, LAN2 and
# Wireless2 LEDs keep their normal behavior. The Wireless1 LED is flashing.
# CAC works when DFS enabled and relevant to the AP only.
CACCheck()
{
    #relevant for 5.2GHz only
    if [ "$1" = "rai0" ]; then
        return
    fi

    if [ "$dfs_enabled" = "1" -a "$ap_or_station_2860" = "ap" ]; then
        get_iwpriv_parameter "$1" "cac_state"
        cac_status="$retval"
        if [ "$cac_status" = "Active" ]; then
            if [ "$cac_is_on" -ne "1" ]; then
                cegpio led $cac_bitmap $cac_state $cac_duration $cac_blink_interval_on $cac_blink_interval_off
            fi
            cac_is_on="1"
        else
            if [ "$cac_is_on" -ne "0" ]; then
                cegpio led $cac_bitmap 1 -1
            fi
            cac_is_on="0"
        fi
    fi
}

TurnOffLeds()
{
    if [ $# -eq 1 -a "$1" != "0" -a x"$1" != "x" ]; then
        cegpio led $1 1 -1
    fi
}
