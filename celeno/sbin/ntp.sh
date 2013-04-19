#!/bin/sh
#
# $Id: ntp.sh,v 1.4 2008-01-21 08:39:58 yy Exp $
#
# usage: ntp.sh
#
#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: as is (SDK 3.5.2 merge)
#			   This script file was adjusted according to celeno NTP requirements

enb=`nvram_get 2860 NtpEnable`
srv1=`nvram_get 2860 NtpPrimaryServer`
srv2=`nvram_get 2860 NtpSecondaryServer`
sync=`nvram_get 2860 NtpSync`
tz=`nvram_get 2860 NtpTimeZone`
srvnum=0

# check if ntp is enabled
if [ x"$enb" == "x0" ]; then
    echo "NTP is disabled." > /dev/console
    exit 0
fi

# check ntp servers
if [ x"$srv1" = "x" ] && [ x"$srv2" = "x" ] 
then
    echo "NTP server list is empty! Aborting." > /dev/console
    exit 1
elif [ x"$srv1" != "x" ] && [ x"$srv2" = "x" ]
then
    srvnum=1
elif [ x"$srv1" = "x" ] && [ x"$srv2" != "x" ]
then
    srvnum=2
else
    srvnum=3    
fi

# check sync
if [ "$sync" = "" ]; then
    sync=1
elif [ $sync -gt 300 -o $sync -le 0 ]; then
    sync=1
fi
sync=`expr $sync \* 3600`

# check and parse the time zone
if [ "$tz" = "" ]; then
    tz="GMT"
    echo "NTP: Time zone is empty. Using $tz" > /dev/console
fi
echo "$tz" > /etc/TZ

# run the ntp client
sleep 5
killall -q ntpclient
is_ntpc_run=`ps | grep -v grep | grep ntpclient`
if [ "$is_ntpc_run" != "" ]; then
    echo "WARN: NTP client already running !"
fi

if [ "$srvnum" = "3" ]; then
    ntpclient -s -c 0 -h $srv1 -h $srv2 -i $sync >/dev/console 2>/dev/console &
    echo "NTP Client started: Server1[$srv1] Server2[$srv2] TimeZone[$tz] Sync[$sync]. " > /dev/console
elif [ "$srvnum" = "2" ]; then
    ntpclient -s -c 0 -h $srv2 -i $sync >/dev/console 2>/dev/console &    
    echo "NTP Client started: Server[$srv2] TimeZone[$tz] Sync[$sync]. " > /dev/console
elif [ "$srvnum" = "1" ]; then 
    ntpclient -s -c 0 -h $srv1 -i $sync >/dev/console 2>/dev/console &        
    echo "NTP Client started: Server[$srv1] TimeZone[$tz] Sync[$sync]. " > /dev/console
else
    echo "NTP Client is not started!" > /dev/console    
fi
