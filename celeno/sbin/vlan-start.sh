#!/bin/sh
#
# $Id: internet.sh,v 1.105.2.3 2010-08-11 06:00:19 chhung Exp $
#
# usage: internet.sh
#
#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: (SDK 3.5.2 merge)
# This script was adjusted according to Celeno networking demands
# and was heavily changed from original 3.5.2 SDK.
#

. /sbin/config.sh
. /sbin/global.sh

. /sbin/eeprom_config.sh

set_vlan_map()
{
    # vlan priority tag => skb->priority mapping
    vconfig set_ingress_map $1 0 0
    vconfig set_ingress_map $1 1 1
    vconfig set_ingress_map $1 2 2
    vconfig set_ingress_map $1 3 3
    vconfig set_ingress_map $1 4 4
    vconfig set_ingress_map $1 5 5
    vconfig set_ingress_map $1 6 6
    vconfig set_ingress_map $1 7 7

    # skb->priority => vlan priority tag mapping
    vconfig set_egress_map $1 0 0
    vconfig set_egress_map $1 1 1
    vconfig set_egress_map $1 2 2
    vconfig set_egress_map $1 3 3
    vconfig set_egress_map $1 4 4
    vconfig set_egress_map $1 5 5
    vconfig set_egress_map $1 6 6
    vconfig set_egress_map $1 7 7
}

#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: as is (SDK 3.5.2 merge)
# addVlanBr() function
addVlanBr()
{
    vlan_enabled=`nvram_get 2860 VlanSwitchEnable`
    if [ "$vlan_enabled" != "1" ]; then
	return
    fi

    local ECHO=

    local allif

    if [ "$( get_eeprom_value Eth_Phy1_Addr)" -ne 255 ]; then
        allif="$allif eth2"
    fi

    if [ "$( get_eeprom_value Eth_Phy2_Addr)" -ne 255 ]; then
        allif="$allif eth3"
    fi

    vconfig_reorder_flag=1
    vconfig_txuntag_flag=4

    local BssidNum2860=`nvram_get 2860 BssidNum`

    i=0
    while [ "$i" -lt "$BssidNum2860" ]; do
        allif="$allif ra$i"

        eval ra${i}Pvid=`nvram_get VlanRa${i}Pvid`
        eval ra${i}TxUntag=`nvram_get VlanRa${i}TxUntag`

        i=$((i+1))
    done

    if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" == "y" ]; then
        local BssidNum3090=`nvram_get rtdev BssidNum`

        i=0

        while [ "$i" -lt "$BssidNum3090" ]; do
            allif="$allif rai$i"

            eval rai${i}Pvid=`nvram_get VlanRai${i}Pvid`
            eval rai${i}TxUntag=`nvram_get VlanRai${i}TxUntag`

            i=$((i+1))
        done

        if [ "$CONFIG_RT3090_AP_APCLI" = "y" ] ; then
            allif="$allif apclii0"
        fi
    fi

    insmod /lib/modules/2.6.21/kernel/net/8021q/8021q.ko

    $ECHO ifconfig br0 down
    $ECHO brctl delbr br0
    
    vlanIdMng=`nvram_get VlanIdMng`
    
    eth2Pvid=`nvram_get VlanEth2Pvid`
    eth3Pvid=`nvram_get VlanEth3Pvid`

    eth2TxUntag=`nvram_get VlanEth2TxUntag`
    eth3TxUntag=`nvram_get VlanEth3TxUntag`

    j=0
    while(true); do

	vlanId=`nvram_get VlanId$j`
	if [ "$vlanId" == "" ]; then      
	    echo thats it $j
	    break;                       
	fi         
	
	vlanMembers=VlanId$j\Members
	members=`nvram_get $vlanMembers`

	if [ "members" == "" ]; then      
	    echo thats it $j
	    break;                       
	fi   

#br0 will be the management bridge br0, whether it's tagged or untagged
	if [ "$j" == "$vlanIdMng" ]; then
	    echo Management VLAN is : $vlanId
	    brName="br0"
	else
             if [ "$vlanId" == "4095" ]; then
                 brName=br${j}u
             else
                 brName=br$vlanId
             fi
	fi

	$ECHO brctl addbr $brName

#Remove forward delay to enable normal DHCP Client start
	echo 0 > /sys/class/net/$brName/bridge/forward_delay

	for if in $members; do
	    if [ "$vlanId" == "4095" ]; then
		$ECHO brctl addif $brName $if
	    else
		$ECHO vconfig add  $if $vlanId
		$ECHO vconfig set_flag $if.$vlanId $vconfig_reorder_flag 1

		eval txuntag=$"$if"TxUntag
		if [ "$txuntag" == "1" ];then 
		    $ECHO vconfig set_flag $if.$vlanId $vconfig_txuntag_flag 1
		fi

		$ECHO ifconfig $if.$vlanId up
		$ECHO brctl addif $brName $if.$vlanId
	    fi
	done

#add physical interfaces to tagged bridges with VLAN id equal to their PVID
#if PVID is 4095, we don't add the interface to untagged bridge
	for if in $allif; do                     
	    eval pvid=$"$if"Pvid             
	    if [ "$pvid" != "4095" -a "$pvid" == "$vlanId" ]; then    
	       $ECHO brctl addif $brName $if     
	    fi                                   
	done  

	$ECHO ifconfig $brName up
	j=$((j+1))
    done
#set has vlan flag on all physical interfaces. it's important to do it in the end, so 
#that virtual interfaces aren't flagged
    for if in $allif; do
	ifconfig $if hasvlan                     
    done    

}

addVlanBr
	
