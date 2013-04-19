#!/bin/sh

. /sbin/config.sh
. /sbin/global.sh

l2tp_pt=`nvram_get 2860 l2tpPassThru`
ipsec_pt=`nvram_get 2860 ipsecPassThru`
pptp_pt=`nvram_get 2860 pptpPassThru`


# note: they must be removed in order
if [ "$CONFIG_NF_CONNTRACK_SUPPORT" = "y" ]; then
#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: as is (SDK 3.5.2 merge)
#
	rmmod nf_nat_pptp 2> /dev/null
	if [ "$?" == 0 ]; then
		echo "ip_nat_pptp - module unloaded"
	fi
	rmmod nf_conntrack_pptp 2> /dev/null
	if [ "$?" == 0 ]; then
		echo "ip_conntrack_pptp - module unloaded"
	fi
	rmmod nf_nat_proto_gre 2> /dev/null
	if [ "$?" == 0 ]; then
		echo "nf_nat_proto_gre - module unloaded"
	fi
	rmmod nf_conntrack_proto_gre 2> /dev/null
	if [ "$?" == 0 ]; then
		echo "nf_conntrack_proto_gre - module unloaded"
	fi
else
	rmmod ip_nat_pptp 2> /dev/null
	if [ "$?" == 0 ]; then
		echo "ip_nat_pptp - module unloaded"
	fi
	rmmod ip_conntrack_pptp 2> /dev/null
	if [ "$?" == 0 ]; then
		echo "ip_conntrack_pptp - module unloaded"
	fi
#------------------------------------------------------------------------------	
fi

if [ "$pptp_pt" = "1" -o "$l2tp_pt" = "1" -o "$ipsec_pt" = "1" ]; then
if [ "$CONFIG_NF_CONNTRACK_SUPPORT" = "y" ]; then
	insmod -q nf_conntrack_proto_gre
	insmod -q nf_nat_proto_gre

	if [ "$pptp_pt" = "1" ]; then
		insmod -q nf_conntrack_pptp
		insmod -q nf_nat_pptp
	fi
else
	insmod -q ip_conntrack_pptp
	insmod -q ip_nat_pptp
fi 
fi 
