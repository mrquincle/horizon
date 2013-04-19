#!/bin/sh
source /sbin/gmm_infra.sh
. /sbin/gmm_hw.sh

retval=0
#consts
part_number=`cegpio pnget | cut -c11-`
cfg_filename="/sbin/gmm_ini.sh"
stb_filename="/var/run/is_standby_mode"
wps_failure="0"
g_iEthPsmode=""
#rescu mode file names
last_rescue_mode="0"
current_rescue_mode="0"
rescue_mode_process_indicator="/tmp/rescue_start"
rescue_mode_success_indicator="/tmp/rescue_success"
rescue_mode_failure_indicator="/tmp/rescue_fail"
assoc_last="1"
assoc_curr="0"
    set -- $link_quality_bitmap=""
eth_rx_intr_last="0"
no_traffic_time="0"
psmode="0"
new_sta="0"
##################
#config file parameters read:#
#################
#buttons gpio:
wps_gpio=`grep "wps_button_gpio" $cfg_filename | cut -d'='  -f2`
reset_gpio=`grep "reset_button_gpio" $cfg_filename | cut -d'='  -f2`
link_quality_check="0"
#states:
wps_state="Idle"
wps_check="0"
assoc_last_bitmap=0
ap_or_station="ap"
eth_status="1111"
module_up="0"
link_quality="0"
mcs="0"
mcs_old="0"
link_quality_old="0"
LastAssociatedBitmap="0"
connecting_client="0"
module_up_first_time="0"
search_started="0"
#button indexes:
wps_button="1"
reset_button=0
#rescue mode - 0 - idle, 1 - in process, 2 - success, 3 - fail
rescue_mode=0
assoc_state_1=""
assoc_state_2=""
assoc_state_3=""
assoc_state_4=""
#Getting leds behaviour from file
##########
#wps search led configuration:
wps_search_bitmap=`grep "wps_search_bitmap" $cfg_filename | cut -d'=' -f2`
wps_search_enable=`grep "wps_search_enable" $cfg_filename | cut -d'=' -f2`
wps_search_state=`grep "wps_search_state" $cfg_filename | cut -d'='  -f2`
wps_search_duration=`grep "wps_search_duration" $cfg_filename | cut -d'='  -f2`
wps_search_blink_interval_off=`grep "wps_search_blink_interval_off" $cfg_filename | cut -d'='  -f2`
wps_search_blink_interval_on=`grep "wps_search_blink_interval_on" $cfg_filename | cut -d'='  -f2`

wps_search_client_state=`grep "wps_search_client_state" $cfg_filename | cut -d'='  -f2`
wps_search_duration=`grep "wps_search_client_duration" $cfg_filename | cut -d'='  -f2`
wps_search_client_blink_interval_off=`grep "wps_search_client_blink_interval_off" $cfg_filename | cut -d'='  -f2`
wps_search_client_blink_interval_on=`grep "wps_search_client_blink_interval_on" $cfg_filename | cut -d'='  -f2`

#wps confirm led configuration::  
wps_confirm_bitmap=`grep "wps_confirm_bitmap" $cfg_filename | cut -d'='  -f2`
wps_confirm_enable=`grep "wps_confirm_enable" $cfg_filename | cut -d'='  -f2`
wps_confirm_state=`grep "wps_confirm_state" $cfg_filename | cut -d'='  -f2`
wps_confirm_duration=`grep "wps_confirm_duration" $cfg_filename | cut -d'='  -f2`
wps_confirm_blink_interval_off=`grep "wps_confirm_interval_off" $cfg_filename | cut -d'='  -f2`
wps_confirm_blink_interval_on=`grep "wps_confirm_interval_on" $cfg_filename | cut -d'='  -f2`
wps_confirm_ap_bitmap=`grep "wps_confirm_ap_bitmap" $cfg_filename | cut -d'='  -f2`
#failure led configuration:
failure_bitmap=`grep "failure_bitmap" $cfg_filename | cut -d'='  -f2`
failure_enable=`grep "failure_enable" $cfg_filename | cut -d'='  -f2`
failure_state=`grep "failure_state" $cfg_filename | cut -d'='  -f2`
failure_duration=`grep "failure_duration" $cfg_filename | cut -d'='  -f2`
failure_blink_interval_off=`grep "failure_blink_interval_off" $cfg_filename | cut -d'='  -f2`
failure_blink_interval_on=`grep "failure_blink_interval_on" $cfg_filename | cut -d'='  -f2`
#failure led configuration:
link_quality_bitmap=`grep "link_quality_bitmap" $cfg_filename | cut -d'='  -f2`
link_quality_enable=`grep "link_quality_enable" $cfg_filename | cut -d'='  -f2`
link_quality_state=`grep "link_quality_state" $cfg_filename | cut -d'='  -f2`
link_quality_duration=`grep "link_quality_duration" $cfg_filename | cut -d'='  -f2`
link_quality_blink_interval_off=`grep "link_quality_blink_interval_off" $cfg_filename | cut -d'='  -f2`
link_quality_blink_interval_on=`grep "link_quality_blink_interval_on" $cfg_filename | cut -d'='  -f2`
# association led configuration:
assoc_feature_enable=`grep "assoc_feature_enable" $cfg_filename | cut -d'='  -f2`
assoc_state=`grep "assoc_state" $cfg_filename | cut -d'='  -f2`
assoc_bitmap=`grep "assoc_bitmap" $cfg_filename | cut -d'='  -f2`
assoc_duration=`grep "assoc_duration" $cfg_filename | cut -d'='  -f2`
assoc_blink_interval_off=`grep "assoc_blink_interval_off" $cfg_filename | cut -d'='  -f2`
assoc_blink_interval_on=`grep "assoc_blink_interval_on" $cfg_filename | cut -d'='  -f2`
# Restore defaults led configuartion
restore_defaults_feature_enable=`grep "restore_defaults_feature_enable" $cfg_filename | cut -d'='  -f2`
restore_defaults_state=`grep "restore_defaults_state" $cfg_filename | cut -d'='  -f2`
restore_defaults_bitmap=`grep "restore_defaults_bitmap" $cfg_filename | cut -d'='  -f2`
restore_defaults_duration=`grep "restore_defaults_duration" $cfg_filename | cut -d'='  -f2`
restore_defaults_blink_interval_on=`grep "restore_defaults_blink_interval_on" $cfg_filename | cut -d'='  -f2`
restore_defaults_blink_interval_off=`grep "restore_defaults_blink_interval_off" $cfg_filename | cut -d'='  -f2`
# Eth configuartion
eth2_state=`grep "eth2_state" $cfg_filename | cut -d'='  -f2`
eth2_bitmap=`grep "eth2_bitmap" $cfg_filename | cut -d'='  -f2`
eth2_duration=`grep "eth2_duration" $cfg_filename | cut -d'='  -f2`
eth2_blink_interval_on=`grep "eth2_blink_interval_on" $cfg_filename | cut -d'='  -f2`
eth2_blink_interval_off=`grep "eth2_blink_interval_off" $cfg_filename | cut -d'='  -f2`

# Eth fail configuartion
eth2_fail_state=`grep "eth2_fail_state" $cfg_filename | cut -d'='  -f2`
eth2_fail_bitmap=`grep "eth2_fail_bitmap" $cfg_filename | cut -d'='  -f2`
eth2_fail_duration=`grep "eth2_fail_duration" $cfg_filename | cut -d'='  -f2`
eth2_fail_blink_interval_on=`grep "eth2_fail_blink_interval_on" $cfg_filename | cut -d'='  -f2`
eth2_fail_blink_interval_off=`grep "eth2_fail_blink_interval_off" $cfg_filename | cut -d'='  -f2`
# association bitmap configuartion
assoc_bitmap_state=`grep "assoc_bitmap_state" $cfg_filename | cut -d'='  -f2`
assoc_bitmap_bitmap=`grep "assoc_bitmap_bitmap" $cfg_filename | cut -d'='  -f2`
assoc_bitmap_duration=`grep "assoc_bitmap_duration" $cfg_filename | cut -d'='  -f2`
assoc_bitmap_blink_interval_on=`grep "assoc_bitmap_blink_interval_on" $cfg_filename | cut -d'='  -f2`
assoc_bitmap_blink_interval_off=`grep "assoc_bitmap_blink_interval_off" $cfg_filename | cut -d'='  -f2`

managment_bitmap=`grep "managment_bitmap" $cfg_filename | cut -d'='  -f2`
managment_state=`grep "managment_state" $cfg_filename | cut -d'='  -f2`
managment_duration=`grep "managment_duration" $cfg_filename | cut -d'='  -f2`
managment_time_on=`grep "managment_time_on" $cfg_filename | cut -d'='  -f2`
managment_time_off=`grep "managment_time_off" $cfg_filename | cut -d'='  -f2`    
 
psmode_bitmap_on=`grep "psmode_bitmap_on" $cfg_filename | cut -d'='  -f2`
psmode_state=`grep "psmode_state" $cfg_filename | cut -d'='  -f2`
psmode_duration=`grep "psmode_duration" $cfg_filename | cut -d'='  -f2`
psmode_time_on=`grep "psmode_time_on" $cfg_filename | cut -d'='  -f2`
psmode_time_off=`grep "psmode_time_off" $cfg_filename | cut -d'='  -f2`  

rescue_process_bitmap=`grep "rescue_process_bitmap" $cfg_filename | cut -d'='  -f2`
rescue_process_state=`grep "rescue_process_state" $cfg_filename | cut -d'='  -f2`
rescue_process_duration=`grep "rescue_process_duration" $cfg_filename | cut -d'='  -f2`
rescue_process_time_on=`grep "rescue_process_time_on" $cfg_filename | cut -d'='  -f2`
rescue_process_time_off=`grep "rescue_process_time_off" $cfg_filename | cut -d'='  -f2`

rescue_success_bitmap=`grep "rescue_success_bitmap" $cfg_filename | cut -d'='  -f2`
rescue_success_state=`grep "rescue_success_state" $cfg_filename | cut -d'='  -f2`
rescue_success_duration=`grep "rescue_success_duration" $cfg_filename | cut -d'='  -f2`
rescue_success_time_on=`grep "rescue_success_time_on" $cfg_filename | cut -d'='  -f2`
rescue_success_time_off=`grep "rescue_success_time_off" $cfg_filename | cut -d'='  -f2`

rescue_fail_bitmap=`grep "rescue_fail_bitmap" $cfg_filename | cut -d'='  -f2`
rescue_fail_state=`grep "rescue_fail_state" $cfg_filename | cut -d'='  -f2`
rescue_fail_duration=`grep "rescue_fail_duration" $cfg_filename | cut -d'='  -f2`
rescue_fail_time_on=`grep "rescue_fail_time_on" $cfg_filename | cut -d'='  -f2`
rescue_fail_time_off=`grep "rescue_fail_time_off" $cfg_filename | cut -d'='  -f2`

stand_by_threshold=`grep "stand_by_threshold" $cfg_filename | cut -d'='  -f2`

last_check_t=`date +%s`

link_level_timeout=600

LinkQualityCheck()
{

    if [ "$wps_failure" -eq "1" ]; then
        return
    fi

    if [ "$link_quality_check" -eq "1" ]; then
        # force link quality update
        last_bound=0
        mcs_old=0
        link_quality_old=0
    fi

    retval=`iwpriv ra0 show LinkQuality | cut -c16- | sed 2d`
    link_quality=$retval

    mcs=`iwpriv ra0 show LqMcs | cut -c16- | sed 2d`

    time=`date +%s`
    diff_t=$(( time - last_check_t ))

    if [ $(($mcs_old-1)) -le $mcs ] && [ $mcs -le $(($mcs_old+1)) ] && [ "$diff_t" -lt "$link_level_timeout" ]; then
            return
    fi

    #tokenizing link quality line
    set -- $link_quality_bitmap

    if [ "$retval" -lt "10" ]; then
	bound=1
    elif [ "$retval" -lt "25" ]; then
	bound=2
    elif [ "$retval" -lt "50" ]; then
	bound=3
    elif [ "$retval" -lt "75" ]; then
	bound=4
    else
	bound=5
    fi
    
    if [ "$retval" -lt "10" ]; then
        if [ "$last_bound" -eq "1" ] ||                                                               # stay on the same quality level
            [ "$last_bound" -eq "2" -a "$retval" -gt "5" -a "$diff_t" -lt "$link_level_timeout" ]     # switch from next quality level with delay
        then
            return
	fi
	cegpio led $2 1 -1
	cegpio led $3 1 -1 
	cegpio led $4 1 -1
	cegpio led $5 1 -1
	cegpio led $1 $link_quality_state $link_quality_duration $link_quality_blink_interval_on $link_quality_blink_interval_off
    elif [ "$retval" -lt "25" ]; then
        if [ "$last_bound" -eq "2" ] ||                                                               # stay on the same quality level
            [ "$last_bound" -eq "1" -a "$retval" -lt "15" -a "$diff_t" -lt "$link_level_timeout" ] || # switch from prev quality level with delay
            [ "$last_bound" -eq "3" -a "$retval" -gt "20" -a "$diff_t" -lt "$link_level_timeout" ]    # switch from next quality level with delay
        then
            return
	fi
	cegpio led $3 1 -1 
        cegpio led $4 1 -1
	cegpio led $5 1 -1
        cegpio led $1 $link_quality_state $link_quality_duration $link_quality_blink_interval_on $link_quality_blink_interval_off
        cegpio led $2 $link_quality_state $link_quality_duration $link_quality_blink_interval_on $link_quality_blink_interval_off
    elif [ "$retval" -lt "50" ]; then
        if [ "$last_bound" -eq "3" ] ||                                                               # stay on the same quality level
            [ "$last_bound" -eq "2" -a "$retval" -lt "30" -a "$diff_t" -lt "$link_level_timeout" ] || # switch from prev quality level with delay
            [ "$last_bound" -eq "4" -a "$retval" -gt "45" -a "$diff_t" -lt "$link_level_timeout" ]    # switch from next quality level with delay
        then
            return
	fi
	cegpio led $4 1 -1
	cegpio led $5 1 -1
        cegpio led $1 $link_quality_state $link_quality_duration $link_quality_blink_interval_on $link_quality_blink_interval_off
        cegpio led $2 $link_quality_state $link_quality_duration $link_quality_blink_interval_on $link_quality_blink_interval_off
        cegpio led $3 $link_quality_state $link_quality_duration $link_quality_blink_interval_on $link_quality_blink_interval_off
    elif [ "$retval" -lt "75" ]; then
        if [ "$last_bound" -eq "4" ] ||                                                               # stay on the same quality level
            [ "$last_bound" -eq "3" -a "$retval" -lt "55" -a "$diff_t" -lt "$link_level_timeout" ] || # switch from prev quality level with delay
            [ "$last_bound" -eq "5" -a "$retval" -gt "70" -a "$diff_t" -lt "$link_level_timeout" ]    # switch from next quality level with delay
        then
            return
	fi
	cegpio led $5 1 -1
        cegpio led $1 $link_quality_state $link_quality_duration $link_quality_blink_interval_on $link_quality_blink_interval_off
        cegpio led $2 $link_quality_state $link_quality_duration $link_quality_blink_interval_on $link_quality_blink_interval_off
        cegpio led $3 $link_quality_state $link_quality_duration $link_quality_blink_interval_on $link_quality_blink_interval_off
        cegpio led $4 $link_quality_state $link_quality_duration $link_quality_blink_interval_on $link_quality_blink_interval_off
    else
        if [ "$last_bound" -eq "5" ] ||                                                               # stay on the same quality level
            [ "$last_bound" -eq "4" -a "$retval" -lt "80" -a "$diff_t" -lt "$link_level_timeout" ]    # switch from prev quality level with delay
        then
            return
	fi
        cegpio led $1 $link_quality_state $link_quality_duration $link_quality_blink_interval_on $link_quality_blink_interval_off
        cegpio led $2 $link_quality_state $link_quality_duration $link_quality_blink_interval_on $link_quality_blink_interval_off
        cegpio led $3 $link_quality_state $link_quality_duration $link_quality_blink_interval_on $link_quality_blink_interval_off
        cegpio led $4 $link_quality_state $link_quality_duration $link_quality_blink_interval_on $link_quality_blink_interval_off
	cegpio led $5 $link_quality_state $link_quality_duration $link_quality_blink_interval_on $link_quality_blink_interval_off
    fi

    link_quality_old=$link_quality
    mcs_old=$mcs

    link_quality_check="0"
    last_check_t=`date +%s`
    last_bound=$bound
}

LedByIndex()
{
    if [ $1 -eq 1 ];then
        return 10
    elif [ $1 -eq 2 ];then
        return 0
    elif [ $1 -eq 3 ];then
        return 9
    elif [ $1 -eq 4 ];then
        return 7
    fi
}


VideoAssociatedBitmapLedCheck()
{
    SearchBitMap="0"
    DisconnectedBitMap="0"
    ConnectedBitMap="0"
    CurrentAssociatedBitMap=`iwpriv ra0 show VideoAssocBitmap | sed 1d`
    if [ "$CurrentAssociatedBitMap" == "$LastAssociatedBitmap" ] && [ "$link_quality_check" -eq "0" ]; then
        return
    fi
    link_quality_check="0"
    LastAssociatedBitmap=$CurrentAssociatedBitMap
    #assoc led 1
    let "mask=0x400"
    let "current=0x$CurrentAssociatedBitMap&1"  
    if [ $current -ne 0 ]; then
        if [ "$assoc_state_1" -ne "2" ]; then
            let "ConnectedBitMap=$ConnectedBitMap|$mask"
            assoc_state_1="2"
        fi
    else
        if [ "$assoc_state_1" -eq "2" -o "$assoc_state_1" -eq "1" ]; then
            let "SearchBitMap=$SearchBitMap|$mask"
            assoc_state_1="1"
        fi
        if [ "$assoc_state_1" -eq "0" ]; then
            let "DisconnectedBitMap=$DisconnectedBitMap|$mask"
            assoc_state_1="0"
        fi
    fi
    #assoc led 2
    let "mask=0x1"
    let "current=0x$CurrentAssociatedBitMap&2"  
    if [ $current -ne 0 ]; then
        if [ "$assoc_state_2" -ne "2" ]; then
            let "ConnectedBitMap=$ConnectedBitMap|$mask"
            assoc_state_2="2"
        fi
    else
        if [ "$assoc_state_2" -eq "2" -o "$assoc_state_2" -eq "1" ]; then
            let "SearchBitMap=$SearchBitMap|$mask"
            assoc_state_2="1"
        fi
        if [ "$assoc_state_2" -eq "0" ]; then
            let "DisconnectedBitMap=0x$DisconnectedBitMap|$mask"
            assoc_state_2="0"
        fi
    fi
    #assoc led 3
    let "mask=0x200"
    let "current=0x$CurrentAssociatedBitMap&4"  
    if [ $current -ne 0 ]; then
        if [ "$assoc_state_3" -ne "2" ]; then
            let "ConnectedBitMap=$ConnectedBitMap|$mask"
            assoc_state_3="2"
        fi
    else
        if [ "$assoc_state_3" -eq "2" -o "$assoc_state_3" -eq "1" ]; then
            let "SearchBitMap=$SearchBitMap|$mask"
            assoc_state_3="1"
        fi
        if [ "$assoc_state_3" -eq "0" ]; then
            let "DisconnectedBitMap=$DisconnectedBitMap|$mask"
            assoc_state_3="0"
        fi
    fi
    #assoc led 4
    let "mask=0x80"
    let "current=0x$CurrentAssociatedBitMap&8"  
    if [ $current -ne 0 ]; then
        if [ "$assoc_state_4" -ne "2" ]; then
            let "ConnectedBitMap=$ConnectedBitMap|$mask"
            assoc_state_4="2"
        fi
    else
        if [ "$assoc_state_4" -eq "2" -o "$assoc_state_4" -eq "1" ]; then
            let "SearchBitMap=$SearchBitMap|$mask"
            assoc_state_4="1"
        fi
        if [ "$assoc_state_4" -eq "0" ]; then
            let "DisconnectedBitMap=$DisconnectedBitMap|$mask"
            assoc_state_4="0"
        fi
    fi

    SearchBitMap=`echo $SearchBitMap | awk '{printf("%08X\n", $1)}'`
    DisconnectedBitMap=`echo $DisconnectedBitMap | awk '{printf("%08X\n", $1)}'`
    ConnectedBitMap=`echo $ConnectedBitMap | awk '{printf("%08X\n", $1)}'`

    cegpio led 0x$SearchBitMap $wps_search_client_state -1 $wps_search_client_blink_interval_on $wps_search_client_blink_interval_off
    cegpio led 0x$DisconnectedBitMap 1 -1
    cegpio led 0x$ConnectedBitMap 0 -1
}

CurrentConnctingClientGet()
{
    for i in 0 1 2 3
    do
        b=$((1 << $i))
		let "x=0x$b&0x$LastAssociatedBitmap"
		if [ "$x" -eq "0" ]; then
			connecting_client=$(($i+1))
            return
        fi
    done
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
WpsStatusCheck47()
{
    #if wps button was not pressed, WPS status does not nedd to be checke.
	#echo $wps_check
    if [ "$wps_check" -eq "0" ]; then
        return
    fi    
    #AP
    if [ $ap_or_station == "ap" ]; then 
        retval=`iwpriv ra0 show WPSStatus | sed 1d | sed 2d`
	else
	    retval=`iwpriv ra0 show WPSStatus | sed 2d | cut -c16-`
	fi

	WpsStatusParse "$retval"

	if [ "$retval" != "$wps_state" ]; then
		if [ "$retval" == "In Process" ]; then
            #wps failure should be reset when starting a new wps process
            wps_failure="0"
            psmode="0"   
            echo 0 > $g_iEthPsmode             
			if [ $ap_or_station == "ap" ]; then
				set -- $assoc_bitmap_bitmap
				args="$@"
				CurrentConnctingClientGet
				if [ $connecting_client -eq "1" ];then
                    assoc_state_1="3"
					cegpio led $1  $wps_search_client_state $wps_search_duration $wps_search_client_blink_interval_on $wps_search_client_blink_interval_off
				elif [ $connecting_client -eq "2" ];then
                    assoc_state_2="3"
					cegpio led $2  $wps_search_client_state $wps_search_duration $wps_search_client_blink_interval_on $wps_search_client_blink_interval_off
				elif [ $connecting_client -eq "3" ];then
                    assoc_state_3="3"
					cegpio led $3  $wps_search_client_state $wps_search_duration $wps_search_client_blink_interval_on $wps_search_client_blink_interval_off
				elif [ $connecting_client -eq "4" ];then
                    assoc_state_4="3"
					cegpio led $4  $wps_search_client_state $wps_search_duration $wps_search_client_blink_interval_on $wps_search_client_blink_interval_off
				else
		            echo unknown client index $connecting_client
			    fi
			else
			    cegpio led $wps_search_bitmap $wps_search_state $wps_search_duration $wps_search_blink_interval_on $wps_search_blink_interval_off
			fi
			wps_check="2"
            link_quality_check="1"
		fi
		if [ "$retval" == "Scanning..." ]; then
            #wps failure should be reset when starting a new wps process
            wps_failure="0"
            psmode="0"
            echo 0 > $g_iEthPsmode
			if [ $ap_or_station == "ap" ]; then
				set -- $assoc_bitmap_bitmap
				args="$@"
				CurrentConnctingClientGet
				if [ $connecting_client -eq "1" ];then
                    assoc_state_1="3"
					cegpio led $1  $wps_search_client_state $wps_search_duration $wps_search_client_blink_interval_on $wps_search_client_blink_interval_off
				elif [ $connecting_client -eq "2" ];then
                    assoc_state_2="3"
					cegpio led $1  $wps_search_client_state $wps_search_duration $wps_search_client_blink_interval_on $wps_search_client_blink_interval_off
				elif [ $connecting_client -eq "3" ];then
                    assoc_state_3="3"
					cegpio led $1  $wps_search_client_state $wps_search_duration $wps_search_client_blink_interval_on $wps_search_client_blink_interval_off
				elif [ $connecting_client -eq "4" ];then
                    assoc_state_4="3"
					cegpio led $1  $wps_search_client_state $wps_search_duration $wps_search_client_blink_interval_on $wps_search_client_blink_interval_off
				else
		            echo unknown client index $connecting_client
				fi
			else
				cegpio led $wps_search_bitmap $wps_search_state $wps_search_duration $wps_search_blink_interval_on $wps_search_blink_interval_off
			fi
			wps_check="2"
            link_quality_check="1"
		fi
		if [ "$retval" == "Success" ]; then
            #wps failure should be reset when wps process ended(if it took less then a second)
            wps_failure="0"
			cegpio buttonrst $wps_button
            set -- $wps_confirm_ap_bitmap
            args="$@"
            CurrentConnctingClientGet
            if [ $connecting_client -eq "1" ];then
                cegpio led $1  $wps_confirm_state $wps_confirm_duration $wps_confirm_blink_interval_on $wps_confirm_blink_interval_off
            elif [ $connecting_client -eq "2" ];then
                cegpio led $2  $wps_confirm_state $wps_confirm_duration $wps_confirm_blink_interval_on $wps_confirm_blink_interval_off
            elif [ $connecting_client -eq "3" ];then
                cegpio led $3  $wps_confirm_state $wps_confirm_duration $wps_confirm_blink_interval_on $wps_confirm_blink_interval_off
            elif [ $connecting_client -eq "4" ];then
                cegpio led $4  $wps_confirm_state $wps_confirm_duration $wps_confirm_blink_interval_on $wps_confirm_blink_interval_off
            else
                echo unknown client index $connecting_client
            fi
			wps_check="0"
            sleep 2
            link_quality_check="1"	
            #if eth status is different, and eth led is blinking for failure, it will stop blinking next iteration
            eth_status="0"
		fi
		if [ "$retval" == "Idle" -o "$retval" == "Failed" ]; then
            if [ "$wps_check" -eq "2" ]; then
                wps_failure="1"
                set -- $eth2_bitmap
                cegpio led $1 $eth2_fail_state $eth2_fail_duration $eth2_fail_blink_interval_on $eth2_fail_blink_interval_off
                set -- $assoc_bitmap_bitmap
				args="$@"
                #aqll Station leds are off after WPS fail due to request QC 622 
                cegpio led $1  1 -1 
                cegpio led $2  1 -1 
                cegpio led $3  1 -1
                cegpio led $4  1 -1 
            fi   
            wps_check="0"
            link_quality_check="1"			
		fi
		if [ "$retval" == "WPS not in use" ]; then
			wps_check="0"
			cegpio led $wps_search_bitmap 1 -1 
		fi
		wps_state=$retval
	fi

}

EthStatusCheck47()
{
    if [ "$wps_failure" -eq "1" ]; then
        return
    fi
    retval1=`cat /sys/module/raeth/parameters/g_iLink_stat | cut -d "," -f1`
    retval2=`cat /sys/module/raeth/parameters/g_iLink_stat | cut -d "," -f2`
    if [ "$retval1" -eq "1" -o "$retval2" -eq "1" ]; then
        retval="1"
    else
        retval="0"
    fi

    eth_rx_intr_cur=`cat /proc/interrupts | grep eth2 | cut -c6-22 | tr -d ' '`
    if [ -z "$eth_rx_intr_cur" ]; then
        eth_rx_intr_cur=0
        diff=0
    else
        diff=$(( $eth_rx_intr_cur - $eth_rx_intr_last ))
    fi
    if [ "$diff" -lt "$stand_by_threshold" ]; then
        no_traffic_time=$(($no_traffic_time+1))
    else                    
        no_traffic_time="0"
    fi
    eth_rx_intr_last=$eth_rx_intr_cur

    if [ "$retval" -eq "$eth_status" ]; then
        return
    fi
    if [ "$retval" -eq "0" ]; then
	    set -- $eth2_bitmap
        #removed due to request Celeno QC #626 
        #cegpio led $1 $eth2_fail_state $eth2_fail_duration $eth2_fail_blink_interval_on $eth2_fail_blink_interval_off
    else
        set -- $eth2_bitmap
        cegpio led $1 1 -1  
        cegpio led $2 $eth2_state $eth2_duration $eth2_blink_interval_on $eth2_blink_interval_off
        if [ "$psmode" -ne "1" ];  then
            cegpio led $3 $eth2_state $eth2_duration $eth2_blink_interval_on $eth2_blink_interval_off
        fi
    fi 
    eth_status=$retval   
}

#Checks if associated
LinkupCheck47()
{
    if [ "$ap_or_station" == "ap" ]; then 
            assoc_curr=`iwpriv ra0 show Linkup | sed 1d`
            if [ -z "$assoc_curr" ]; then
                assoc_curr=0
            fi
            if [ "$assoc_curr" == "0" -a "$search_started" -eq "0" -a "$psmode" -eq "0" ]; then
                set -- $assoc_bitmap_bitmap
				args="$@"
				cegpio led $1  $wps_search_client_state $wps_search_duration $wps_search_client_blink_interval_on $wps_search_client_blink_interval_off
                search_started="1"
            fi
    else
          assoc_curr=`iwpriv ra0 show Linkup | cut -c16-`
          if [ -z "$assoc_curr" ]; then
                assoc_curr=0
          fi
          if [ "$new_sta" -eq "0" -a "$assoc_curr" == "0" -a "$search_started" -eq "0" -a "$psmode" -eq "0" ]; then
                cegpio led $wps_search_bitmap $wps_search_state -1 $wps_search_blink_interval_on $wps_search_blink_interval_off
                search_started="1"          
          fi
          if [ "$assoc_curr" == "1" ]; then
                search_started="0"
          fi
    fi

}

#checks reset button - if pressed more then 10 seconds, restore defaults, if less, reboot
ResetButtonCheck47()
{
    line=`cegpio buttonget $reset_button`
    set -- $line
    if [ "$4" -eq "0" ]; then
        if [ "$6" -gt "10000" ]; then
            RestoreDefaults
            exit 0
        fi
        if [ "$6" -gt "0" ]; then
            echo "rebooting due to user external requesr..."
            LedsOff
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

LedsOff()
{
        cegpio led 0x0002681 1 -1
        cegpio led 0x2000000 1 -1
}

ManagmentAction()
{
    if [ -e "/sbin/managment_action" ];      # Check if file exists.
    then
        rm /sbin/managment_action
        LedsOff
        cegpio led $managment_bitmap $managment_state $managment_duration $managment_time_on $managment_time_off  
        sleep 60
    fi
}

RescueModeLedHandle()
{
    last_rescue_mode=$current_rescue_mode
    if [ "$last_rescue_mode" -eq "0" ]; then
        return
    elif [ "$last_rescue_mode" -eq "1" ]; then
        cegpio led $rescue_process_bitmap $rescue_process_state $rescue_process_duration $rescue_process_time_on $rescue_process_time_off
        return
    elif [ "$last_rescue_mode" -eq "2" ]; then
        cegpio led $rescue_success_bitmap $rescue_success_state $rescue_success_duration $rescue_success_time_on $rescue_success_time_off
        return
    elif [ "$last_rescue_mode" -eq "3" ]; then
        cegpio led $rescue_fail_bitmap $rescue_fail_state $rescue_fail_duration $rescue_fail_time_on $rescue_fail_time_off
        return
    else
        echo "unknown rescue mode: $last_rescue_mode"
    fi  
}

RescueModeCheck()
{
     if [ -e "$rescue_mode_process_indicator" ]; then
        rm $rescue_mode_process_indicator
        current_rescue_mode=1
     elif [ -e "$rescue_mode_success_indicator" ]; then
        rm $rescue_mode_success_indicator
        current_rescue_mode=2
     elif [ -e "$rescue_mode_failure_indicator" ]; then
        rm $rescue_mode_failure_indicator
        current_rescue_mode=3
     fi
}
########################################
#MAIN
########################################
touch $cfg_filename
if [ ! -e "$cfg_filename" ];      # Check if file exists.
then
    echo "$cfg_filename does not exist."; echo
    exit 0                
fi
#initializing Stand By mode indication
touch $stb_filename
echo 0 > $stb_filename

ApOrStaCheck
#checks if this is a new station - meanning it has no SSID configured.
NewStationCheck
#setting buttons gpio indexes 
ButtonsIndexesSet
cegpio buttonrst $wps_button
cegpio buttonrst $reset_button
LedsOff
while true; do
    CheckModuleUp
    if [ "$module_up" -eq "0" ]; then
        cegpio led $managment_bitmap $managment_state $managment_duration $managment_time_on $managment_time_off 
        continue
    else 
        if [ "$module_up_first_time" -ne "1" ]; then
            module_up_first_time="1" 
            ApOrStaCheck
            cegpio led 0x2800 0 -1
        fi
    fi
    if [ -e "/sbin/restore_defaults_in_process" ]; then
        rm /sbin/restore_defaults_in_process
        cegpio led $restore_defaults_bitmap $restore_defaults_state $restore_defaults_duration $restore_defaults_blink_interval_on $restore_defaults_blink_interval_off
        sleep 20
    fi
    #checking reset/restore defaults event
    ResetButtonCheck47 $reset_button
    RescueModeCheck
    if [ "$last_rescue_mode" -ne "$current_rescue_mode" ]; then
        LedsOff
        RescueModeLedHandle
    fi
    if [ "$last_rescue_mode" -ne "0" ]; then
        continue
    fi
    #checking association 
    LinkupCheck47
    #checking eth connection
    EthStatusCheck47
    #checking if wps button is pressed
    WPSButtonCheck
    #checking wps status
    WpsStatusCheck47
    if [ $ap_or_station == "sta" ]; then
    # if station, checks if associated ap is in psmode
        PsModeInAssociatedApCheck
    fi
    #if [ "$no_traffic_time" -gt "5" -o "$eth_status" -eq "0" ] || [ $ap_or_station == "sta" -a $AssociatedAPInPsMode == "1" ]
    if [ "$no_traffic_time" -gt "180" ] || [ $ap_or_station == "sta" -a $AssociatedAPInPsMode == "1" ]
    then
        if [ $psmode -eq "0" ]; then
            if  [ "$wps_state" == "Idle" -o "$wps_state" == "Success" ]; then
                LedsOff
                cegpio led $psmode_bitmap_on $psmode_state $psmode_duration
                #next time AP / STA will get into search mode if needed 
                if [ "$ap_or_station" != "ap" ]; then
                    search_started="0"
                fi
                psmode="1"
                echo 1 > $g_iEthPsmode
                echo 1 > $stb_filename
                link_quality_check="1"
                eth_status="2"
             fi
        fi
        continue
    else
        if [ "$psmode" -ne "0" ]; then
            #next time AP / STA will get into search mode if needed 
            if [ "$ap_or_station" != "ap" ]; then
                search_started="0"
            fi
        fi
        psmode="0"
        echo 0 > $g_iEthPsmode
        eth_status="2"
        echo 0 > $stb_filename
    fi
    if [ $ap_or_station == "ap" ]; then 
            VideoAssociatedBitmapLedCheck
    else	
		if [ $wps_check -ne "1" ] && [ $assoc_curr -eq "1" ]; then 
            if [ $psmode == "0" ]; then
			    LinkQualityCheck
            fi
		fi
		if [ $assoc_last -ne $assoc_curr ]; then
			if [ $assoc_curr -eq "1" ]; then 
				link_quality_check=1
			fi
			assoc_last=$assoc_curr
		fi
    fi
    ManagmentAction
    sleep 1
done
