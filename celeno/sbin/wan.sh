#!/bin/sh
#
# $Id: wan.sh,v 1.21 2010-03-10 13:48:06 chhung Exp $
#
# usage: wan.sh
#

. /sbin/global.sh

# stop all
#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: as is (SDK 3.5.2 merge)
# celeno removed
#killall -q syslogd
killall -q udhcpc
killall -q pppd
killall -q l2tpd
killall -q openl2tpd


clone_en=`nvram_get 2860 macCloneEnabled`
clone_mac=`nvram_get 2860 macCloneMac`
#MAC Clone: bridge mode doesn't support MAC Clone
if [ "$opmode" != "0" -a "$clone_en" = "1" ]; then
	ifconfig $wan_if down
	if [ "$opmode" = "2" ]; then
		rmmod rt2860v2_sta_net
		rmmod rt2860v2_sta
		rmmod rt2860v2_sta_util

		insmod -q rt2860v2_sta_util
		insmod -q rt2860v2_sta mac=$clone_mac
		insmod -q rt2860v2_sta_net
	else
		ifconfig $wan_if hw ether $clone_mac
	fi
	ifconfig $wan_if up
fi

if [ "$wanmode" = "STATIC" -o "$opmode" = "0" ]; then
	#always treat bridge mode having static wan connection
	ip=`nvram_get 2860 wan_ipaddr`
	nm=`nvram_get 2860 wan_netmask`
	gw=`nvram_get 2860 wan_gateway`
	pd=`nvram_get 2860 wan_primary_dns`
	sd=`nvram_get 2860 wan_secondary_dns`

	#lan and wan ip should not be the same except in bridge mode
	if [ "$opmode" != "0" ]; then
		lan_ip=`nvram_get 2860 lan_ipaddr`
		if [ "$ip" = "$lan_ip" ]; then
			echo "wan.sh: warning: WAN's IP address is set identical to LAN"
			exit 0
		fi
	else
		#use lan's ip address instead
		ip=`nvram_get 2860 lan_ipaddr`
		nm=`nvram_get 2860 lan_netmask`
	fi
	ifconfig $wan_if $ip netmask $nm
#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: as is (SDK 3.5.2 merge)
#				make it silent
	route del default 2> /dev/null
	if [ "$gw" != "" ]; then
	route add default gw $gw
	fi
#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: as is (SDK 3.5.2 merge)
#	celeno removed
	#config-dns.sh $pd $sd
elif [ "$wanmode" = "DHCP" ]; then
	hn=`nvram_get 2860 wan_dhcp_hn`
	if [ "$hn" != "" ]; then
		udhcpc -i $wan_if -h $hn -s /sbin/udhcpc.sh -p /var/run/udhcpc.pid &
	else
		udhcpc -i $wan_if -s /sbin/udhcpc.sh -p /var/run/udhcpc.pid &
	fi
elif [ "$wanmode" = "PPPOE" ]; then
	u=`nvram_get 2860 wan_pppoe_user`
	pw=`nvram_get 2860 wan_pppoe_pass`
	pppoe_opmode=`nvram_get 2860 wan_pppoe_opmode`
	if [ "$pppoe_opmode" = "" ]; then
		echo "pppoecd $wan_if -u $u -p $pw"
		pppoecd $wan_if -u "$u" -p "$pw"
	else
		pppoe_optime=`nvram_get 2860 wan_pppoe_optime`
		config-pppoe.sh $u $pw $wan_if $pppoe_opmode $pppoe_optime
	fi
elif [ "$wanmode" = "3G" ]; then
	autoconn3G.sh connect &
else
	echo "wan.sh: unknown wan connection type: $wanmode"
	exit 1
fi

