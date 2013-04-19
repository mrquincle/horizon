#!/bin/sh

if [ -n "$1" ]; then
    if [ $1 -eq $1 2>/dev/null ]; then
        echo "delay from parameter"
        delay=$1
    fi
else
    dhcp_delay=`/bin/nvram_get 2860 dhcpDelayActionValue`
    if [ -n "$dhcp_delay" ] && [ $dhcp_delay -eq $dhcp_delay 2>/dev/null ]; then
        echo "delay from NVRAM"
        delay=$dhcp_delay
    fi
fi

if [ -z "$delay" ]; then
    echo "delay from default"
    delay=60
fi

if [ $delay -gt 0 ]; then
    echo "sleeping for $delay seconds"
    sleep $delay
fi

echo "calling media_change.s"
/sbin/media_change.sh linkup &

