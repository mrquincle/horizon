#!/bin/sh

killall -q rt2860apd
killall -q rtinicapd


# check is daemon should run
startup_daemon_check()
{
	apd_flag=0
	AuthMode=`nvram_get $1 AuthMode`
	IEEE8021X=`nvram_get $1 IEEE8021X`
	BssidNum=`nvram_get $1 BssidNum`
	i=1
	while [ -n "$AuthMode" ] && [ $i -le $BssidNum ] ; do
		tmp=`echo -n "$AuthMode" | cut -d';' -f1`
		AuthMode=`echo -n "$AuthMode" | cut -d';' -s -f2-`
		if [ "$tmp" = "WPA" ] || [ "$tmp" = "WPA2" ] || [ "$tmp" = "WPA1WPA2" ] ; then
			apd_flag=1
			break;
		fi
		i=$(( $i + 1 ))
	done

	while [ -n "$IEEE8021X" ] && [ $i -le $BssidNum ] ; do
		tmp=`echo -n "$IEEE8021X" | cut -d';' -f1`
		IEEE8021X=`echo -n "$IEEE8021X" | cut -d';' -s -f2-`
		if [ "$tmp" = "1" ] ; then
			apd_flag=1
			break;
		fi
	done
}


gr=`lsmod | grep rt2860v2_ap`
if [ -n "$gr" ] ; then
	startup_daemon_check "2860"
	[ "$apd_flag" = "1" ] && rt2860apd
fi

gr=`lsmod | grep RT3090_ap`
if [ -n "$gr" ] ; then
	startup_daemon_check "rtdev"
	[ "$apd_flag" = "1" ] && rtinicapd
fi
