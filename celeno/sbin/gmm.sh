#!/bin/sh
. /sbin/gmm_infra.sh
. /sbin/gmm_ini.sh
. /sbin/gmm_hw.sh

retval=0

ap_or_station_2860="ap"
ap_or_station_3090="ap"

assoc_last_bitmap="101"

InitLeds() {
	TurnOffLeds $startup_off_bitmap
    if [ "$part_number_dec" -eq "82" ]; then
        cegpio led 0x2000 0 -1
    fi
	#states:
	wps_state="Idle"
	wps_check="0"
	wps_delay="0"
	eth_status="0"
	module_up_first_time=""
	IsHdCapble="0"
	eth_rx_intr_last="0"
	no_traffic_time="0"
	psmode="0"
	cac_is_on="0"
	dfs_enabled="0"
	is_WPSConcurrency=0

	#status
	wlan_module_status_2860="down"
	wlan_module_status_3090="down"

	wps_state_2860="Idle"
	wps_state_3090="Idle"
}

InitButtons() {
	#button indexes:
	wps_button="1"
	reset_button="0"

	#setting buttons gpio indexes
	ButtonsIndexesSet
	cegpio buttonrst $wps_button
	cegpio buttonrst $reset_button
}

ManagmentAction()
{
	if [ -e "/sbin/managment_action" ];		 # Check if file exists.
	then
		rm /sbin/managment_action
		cegpio led $managment_bitmap $managment_state $managment_duration $managment_time_on $managment_time_off
		if [ "$part_number_dec" -eq "47" ]; then
				cegpio led $assoc_bitmap 0 -1
		fi
		sleep 120
		InitLeds
		return 1
	fi
	return 0
}

CheckRestoreDefaults()
{
	if [ -e "/sbin/restore_defaults_in_process" ]; then
		rm /sbin/restore_defaults_in_process
		#restore defaults from web!
		cegpio led $restore_defaults_bitmap $restore_defaults_state $restore_defaults_duration $restore_defaults_blink_interval_on $restore_defaults_blink_interval_off
		if [ "$part_number_dec" -eq "47" ]; then
				cegpio led $assoc_bitmap 0 -1
		fi
		while [ -n "`ps | grep restore_defaults.sh | grep -v grep`" ]; do
			sleep 1;
		done
		InitLeds
		return 1
	fi
	return 0
}

########################################
#MAIN
########################################

InitLeds
InitButtons
DFSStatusCheck
while true; do
    #checking reset/restore defaults event
    ResetButtonCheck $reset_button

    #checking eth connection
    EthStatusCheck
    if [ "$no_traffic_time" -gt "5" -o "$eth_status" -eq "0" -a  "$part_number_dec" -ne "82" ]; then
        if [ "$psmode" -eq "0" ]; then
            if  [ "$wps_state" == "Idle" -o "$wps_state" == "Success" ]; then
                cegpio led $psmode_bitmap_on $psmode_state $psmode_duration
                cegpio led $psmode_bitmap_off 1 -1
                echo Stand by mode on
                psmode="1"
                eth_status="2"
             fi
        fi
    else
        if [ $psmode -eq "1" ]; then
            cegpio led $psmode_bitmap_on 1 -1
            cegpio led $psmode_bitmap_off 0 -1
            echo Stand by mode off
            psmode="0"
            eth_status="2"
        fi
    fi

	CheckRestoreDefaults
	if [ "$?" -ne 0 ]; then
		continue
	fi
	ManagmentAction
	if [ "$?" -ne 0 ]; then
		continue
	fi

    #checking what wlans are loaded
    CheckWLANModules
    if [ "$wlan_module_status_2860" != "down" ] || [ "$wlan_module_status_3090" != "down" ]; then
        if [ "$module_up_first_time" != "1" ]; then
            module_up_first_time="1"
            ApOrStaCheck "ra0"
            ApOrStaCheck "rai0"
            if [ "$part_number_dec" -eq "82" ]; then
                ethConvert=`nvram_get ethConvert`
                ap_or_sta_switch=`cegpio get 12 | cut -c12`
                if [ "$ap_or_sta_switch" -eq "0" -a "$ethConvert" -eq "1" ]; then
                    echo "Switching to AP mode due to user request(ap/sta switch)"
                    cemgr.sh op_mode_set ap
                    echo rebootting...
                    reboot
                    sleep 30
                    exit
                fi
                if [ "$ap_or_sta_switch" -eq "1" -a "$ethConvert" -eq "0" ]; then
                    echo "Switching to STA mode due to user request(ap/sta switch)"
                    cemgr.sh op_mode_set sta                 
                    echo rebootting...
                    reboot
                    sleep 30
                fi
            fi
        fi
        #prevents calling "cemgr.sh start_wps_pbc"
        if [ "$wps_delay" -gt "0" ]; then
            let "wps_delay--"
            #resets button's duration in order to avoid calling "cemgr.sh start_wps_pbc" at the end of the delay  
            cegpio buttonrst $wps_button
        fi
        #checking association
        LinkupCheck "ra0"
        LinkupCheck "rai0"
        #checking wps status
        WpsStatusCheck "ra0"
        WpsStatusCheck "rai0"
        #checking if wps button is pressed
        WPSButtonCheck
    fi

    sleep 1
done
