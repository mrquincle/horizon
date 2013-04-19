#!/bin/sh
. /sbin/gmm_infra.sh
. /sbin/gmm_inic.ini

wlan_tx_pkts_last=0
wlan_tx_pkts_curr=0
cegpio timeronoff 1
traffic_state="0"
CheckTraffic()
{
    wlan_tx_pkts_curr=`cat /proc/net/dev | grep ra0 | cut -c 93-100 | sed -e 's/^[ \t]*//'`
    traffic=$(($wlan_tx_pkts_curr-$wlan_tx_pkts_last))
    wlan_tx_pkts_last=$wlan_tx_pkts_curr
}


while true; do
CheckWLANModules
    if [ "$wlan_module_status_2860" = "down" ] && [ "$wlan_module_status_3090" = "down" ]; then
        cegpio led 0x1 1 -1
        sleep 1
        continue
    else 
        if [ "$module_up_first_time" != "1" ]; then
            cegpio led 0x1 0 -1
            module_up_first_time="1" 
            continue
        else
            CheckTraffic
            if [ "$traffic" -gt "$min_traffic" ]; then
                if [ "$traffic_state" == "0" ]; then
                    cegpio led 0x1 2 100 100 -1
                    traffic_state="1"
                    sleep 1
                    continue
                fi
            else
                if [ "$traffic_state" == "1" ]; then
                    cegpio led 0x1 0 -1
                    traffic_state="0"
                    sleep 1
                    continue
                fi
            fi

        fi
        
    fi
done

