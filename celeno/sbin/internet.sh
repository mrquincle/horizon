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
#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: as is (SDK 3.5.2 merge)
#
. /sbin/eeprom_config.sh
. /etc/init.d/ethernet.sh


lan_ip=`nvram_get 2860 lan_ipaddr`
stp_en=`nvram_get 2860 stpEnabled`
nat_en=`nvram_get 2860 natEnabled`
ra_radio_off=`nvram_get 2860 RadioOff`
wifi_off=`nvram_get 2860 WiFiOff`
ra_Bssidnum=`nvram_get 2860 BssidNum`
ra_enabled=`nvram_get 2860 IfEnable`

#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: (SDK 3.5.2 merge)
# This script was adjusted according to Celeno networking demands
# and was heavily changed from original 3.5.2 SDK.
#
if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" = "y" ]
then
    rai_Bssidnum=`nvram_get rtdev BssidNum`
    rai_enabled=`nvram_get rtdev IfEnable`
    rai_radio_off=`nvram_get rtdev RadioOff`
else
    rai_Bssidnum=0
    rai_enabled=0
    rai_radio_off=
fi

mkdir /mnt/nfs

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
# act upon nvram keys readings
ifRaxWdsxDown()
{
    num=15
    while [ "$num" -gt 0 ]
    do
        num=`expr $num - 1`
        ifconfig ra$num down 2> /dev/null
    done

    wds_en=`nvram_get 2860 WdsEnable`
    if [ "$wds_en" != "0" ]; then
        for num in 0 1 2 3 
        do
            ifconfig wds$num down 2> /dev/null
            if [ "$?" == 1 ]; then
                 echo "Trying to close network if wds$num... wds$num does not exist"
            else
                  echo " IF wds$num -  down"
            fi
        done
    fi

    if [ "$CONFIG_RT2860V2_AP_APCLI" == "y" ]; then
        ifconfig apcli0 down 2> /dev/null
        if [ "$?" == 1 ]; then
            echo "Trying to close network if apcli0... apcli0 does not exist"
        else
            echo " IF apcli0 -  down"
        fi
    fi
    
    meshenabled=`nvram_get 2860 MeshEnabled`
    if [ "$meshenabled" = "1" ]; then
        ifconfig mesh0 down 2> /dev/null
        if [ "$?" == 1 ]; then
            echo "Trying to close network if mesh0... mesh0 does not exist"
        else
            echo " IF mesh0 -  down"
        fi
    fi
}

ifRaixWdsxDown()
{
    num=7
    while [ "$num" -gt 0 ]
    do
        num=`expr $num - 1`
        ifconfig rai$num down 1>/dev/null 2>&1
    done

	ifconfig wdsi0 down 1>/dev/null 2>&1
	ifconfig wdsi1 down 1>/dev/null 2>&1
	ifconfig wdsi2 down 1>/dev/null 2>&1
	ifconfig wdsi3 down 1>/dev/null 2>&1
	echo -e "\n##### disable 2nd wireless interface #####"
}

addBr0()
{
		#------------------------------------------------------------------------------
		# CELENO-FIX / Benson, 17-04-2011
		# Description: as is (SDK 3.5.2 merge)
		# act upon nvram keys readings
        brctl addbr br0

        #Switch off multicast snooping on AP
        is_sta=`nvram_get 2860 ethConvert`
        if [ "$is_sta" = "0" ]; then
                echo 0 > /sys/class/net/br0/bridge/multicast_snooping
        fi

        #Remove forward delay to enable normal DHCP Client start
        echo 0 > /sys/class/net/br0/bridge/forward_delay

        brctl addif br0 ra0

        if [ "$is_sta" = "1" ]; then
                # effectively disable IGMP snooping in uplink
                # using already existing multicast gateway detection facility
                echo 2 > /sys/class/net/ra0/brport/multicast_router
        fi
}

addRax2Br0()
{
    num=1 
    while [ $num -lt $ra_Bssidnum ] 
    do 
        ifconfig ra$num 0.0.0.0 1>/dev/null 2>&1
        brctl addif br0 ra$num 
        num=`expr $num + 1` 
    done 
}

addWds2Br0()
{
    wds_en=`nvram_get 2860 WdsEnable`
    if [ "$wds_en" != "0" ]; then
        ifconfig wds0 up 1>/dev/null 2>&1
        ifconfig wds1 up 1>/dev/null 2>&1
        ifconfig wds2 up 1>/dev/null 2>&1
        ifconfig wds3 up 1>/dev/null 2>&1
        brctl addif br0 wds0
        brctl addif br0 wds1
        brctl addif br0 wds2
        brctl addif br0 wds3
    fi
}

addMesh2Br0()
{
    meshenabled=`nvram_get 2860 MeshEnabled`
    if [ "$meshenabled" = "1" ]; then
        ifconfig mesh0 up 1>/dev/null 2>&1
        brctl addif br0 mesh0
        meshhostname=`nvram_get 2860 MeshHostName`
        iwpriv mesh0 set  MeshHostName="$meshhostname"
    fi
}

addRaix2Br0()
{
#	if [ "$CONFIG_RT2880_INIC" == "" -a "$CONFIG_RTDEV_MII" == "" -a "$CONFIG_RTDEV_USB" == "" -a "$CONFIG_RTDEV_PCI" == "" ]; then
#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: as is (SDK 3.5.2 merge)
# removed by celeno
#	if [ "$CONFIG_RTDEV_MII" == "" -a "$CONFIG_RTDEV_USB" == "" -a "$CONFIG_RTDEV_PCI" == "" ]; then
#		return
#	fi
	num=0
	while [ "$num" -lt "$rai_Bssidnum" ]
	do
		ifconfig rai$num up 1>/dev/null 2>&1
		brctl addif br0 rai$num
		num=`expr $num + 1`
	done
	echo -e "\n##### enable 2nd wireless interface #####"
}

addInicWds2Br0()
{
#	if [ "$CONFIG_RT2880_INIC" == "" -a "$CONFIG_RTDEV_MII" == "" -a "$CONFIG_RTDEV_USB" == "" -a "$CONFIG_RTDEV_PCI" == "" ]; then
	if [ "$CONFIG_RTDEV_MII" == "" -a "$CONFIG_RTDEV_USB" == "" -a "$CONFIG_RTDEV_PCI" == "" ]; then
		return
	fi
	wds_en=`nvram_get rtdev WdsEnable`
	if [ "$wds_en" != "0" ]; then
		ifconfig wdsi0 up 1>/dev/null 2>&1
		ifconfig wdsi1 up 1>/dev/null 2>&1
		ifconfig wdsi2 up 1>/dev/null 2>&1
		ifconfig wdsi3 up 1>/dev/null 2>&1
		brctl addif br0 wdsi0
		brctl addif br0 wdsi1
		brctl addif br0 wdsi2
		brctl addif br0 wdsi3
	fi
}

addRaL02Br0()
{
	if [ "$CONFIG_RT2561_AP" != "" ]; then
		brctl addif br0 raL0
	fi
}
#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: as is (SDK 3.5.2 merge)
# addVlanBr() function
addVlanBr()
{
    local ECHO=

    local allif="eth2"

    vconfig_reorder_flag=1
    vconfig_txuntag_flag=4

    local BssidNum2860=`nvram_get 2860 BssidNum`

    if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" == "y" ]; then
        local BssidNum3090=`nvram_get rtdev BssidNum`
    fi

    if ! cemgr.sh eeprom_show | grep -q '^Eth Phy2 Addr[ \t]*:[ \t]*\(255\|FF\)$'
    then
        allif="$allif eth3"
    fi

    i=0
    while [ "$i" -lt "$BssidNum2860" ]; do
        allif="$allif ra$i"

        eval ra${i}Pvid=`nvram_get VlanRa${i}Pvid`
        eval ra${i}TxUntag=`nvram_get VlanRa${i}TxUntag`

        i=$((i+1))
    done

    if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" == "y" ]; then
        i=0

        while [ "$i" -lt "$BssidNum3090" ]; do
            allif="$allif rai$i"

            eval rai${i}Pvid=`nvram_get VlanRai${i}Pvid`
            eval rai${i}TxUntag=`nvram_get VlanRai${i}TxUntag`

            i=$((i+1))
        done
    fi

    vlan_enabled=`nvram_get 2860 VlanSwitchEnable`
    if [ "$vlan_enabled" != "1" ]; then
	return
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
	let "j +=1"
    done
#set has vlan flag on all physical interfaces. it's important to do it in the end, so 
#that virtual interfaces aren't flagged
    for if in $allif; do
	ifconfig $if hasvlan                     
    done    

}

genSysFiles()
{
	login=`nvram_get 2860 Login`
	pass=`nvram_get 2860 Password`
	if [ "$login" != "" -a "$pass" != "" ]; then
		echo "$login::0:0:Adminstrator:/:/bin/sh" > /etc/passwd
		echo "$login:x:0:$login" > /etc/group
		#------------------------------------------------------------------------------
		# CELENO-FIX / Benson, 17-04-2011
		# Description: as is (SDK 3.5.2 merge)
		# removed by celeno		
		#chpasswd.sh $login $pass
	fi
	if [ "$CONFIG_PPPOL2TP" == "y" ]; then
	echo "l2tp 1701/tcp l2f" > /etc/services
	echo "l2tp 1701/udp l2f" >> /etc/services
	fi
}

genDevNode()
{
#Linux2.6 uses udev instead of devfs, we have to create static dev node by myself.
if [ "$CONFIG_USB_EHCI_HCD" != "" -o "$CONFIG_DWC_OTG" != "" -a "$CONFIG_HOTPLUG" == "y" ]; then
	mounted=`mount | grep mdev | wc -l`
	if [ $mounted -eq 0 ]; then
	mount -t ramfs mdev /dev
	mkdir /dev/pts
	mount -t devpts devpts /dev/pts
        mdev -s

        mknod   /dev/video0      c       81      0
        mknod   /dev/spiS0       c       217     0
        mknod   /dev/i2cM0       c       218     0
        mknod   /dev/rdm0        c       254     0
        mknod   /dev/flash0      c       200     0
        mknod   /dev/swnat0      c       210     0
        mknod   /dev/hwnat0      c       220     0
        mknod   /dev/acl0        c       230     0
        mknod   /dev/ac0         c       240     0
        mknod   /dev/mtr0        c       250     0
        mknod   /dev/gpio        c       252     0	
	mknod	/dev/pcm0	 c	 233	 0
	mknod	/dev/i2s0	 c	 234	 0	
        mknod   /dev/cls0        c       235     0

	fi
	echo "# <device regex> <uid>:<gid> <octal permissions> [<@|$|*> <command>]" > /etc/mdev.conf
        echo "# The special characters have the meaning:" >> /etc/mdev.conf
        echo "# @ Run after creating the device." >> /etc/mdev.conf
        echo "# $ Run before removing the device." >> /etc/mdev.conf
        echo "# * Run both after creating and before removing the device." >> /etc/mdev.conf
        echo "sd[a-z][1-9] 0:0 0660 */sbin/automount.sh \$MDEV" >> /etc/mdev.conf
        echo "sd[a-z] 0:0 0660 */sbin/automount.sh \$MDEV" >> /etc/mdev.conf
	if [ "$CONFIG_USB_SERIAL" = "y" ] || [ "$CONFIG_USB_SERIAL" = "m" ]; then
		echo "ttyUSB0 0:0 0660 @/sbin/autoconn3G.sh connect" >> /etc/mdev.conf
	fi
	if [ "$CONFIG_BLK_DEV_SR" = "y" ] || [ "$CONFIG_BLK_DEV_SR" = "m" ]; then
		echo "sr0 0:0 0660 @/sbin/autoconn3G.sh connect" >> /etc/mdev.conf
	fi
	if [ "$CONFIG_USB_SERIAL_HSO" = "y" ] || [ "$CONFIG_USB_SERIAL_HSO" = "m" ]; then
		echo "ttyHS0 0:0 0660 @/sbin/autoconn3G.sh connect" >> /etc/mdev.conf
	fi

        #enable usb hot-plug feature
        echo "/sbin/mdev" > /proc/sys/kernel/hotplug

fi
}

# opmode adjustment:
#   if AP client was not compiled and operation mode was set "3" -> set $opmode "1"
#   if Station was not compiled and operation mode was set "2" -> set $opmode "1"
if [ "$opmode" = "3" -a "$CONFIG_RT2860V2_AP_APCLI" != "y" ]; then
    nvram_set 2860 OperationMode 1
    opmode="1"
fi
if [ "$opmode" = "2" -a "$CONFIG_RT2860V2_STA" == "" ]; then
    nvram_set 2860 OperationMode 1
    opmode="1"
fi

genSysFiles
genDevNode

if [ "$CONFIG_DWC_OTG" == "m" ]; then
    usbmod_exist=`lsmod | grep dwc_otg | wc -l`
    if [ "$usbmod_exist" == "0" ]; then
        insmod -q lm
        insmod -q dwc_otg
    fi
fi

if [ "$CONFIG_USB_EHCI_HCD" == "m" ]; then
    usbmod_exist=`lsmod | grep ehci-hcd | wc -l`
    if [ "$usbmod_exist" == "0" ]; then
        insmod -q ehci-hcd
    fi
fi

if [ "$CONFIG_USB_OHCI_HCD" == "m" ]; then
    usbmod_exist=`lsmod | grep ohci-hcd | wc -l`
    if [ "$usbmod_exist" == "0" ]; then
        insmod -q ohci-hcd
    fi
fi

rmmod cls > /dev/null 2>&1
rmmod hw_nat > /dev/null 2>&1

#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: as is (SDK 3.5.2 merge)
#
# insmod all
if [ "$CONFIG_BRIDGE" == "m" ]; then
    insmod -q bridge
fi
if [ "$CONFIG_MII" == "m" ]; then
    insmod -q mii
fi

ifRaxWdsxDown
rmmod rt2860v2_ap_net 2> /dev/null
if [ "$?" == 0 ]; then
    echo "rt2860v2_ap_net - module unloaded"
fi
rmmod rt2860v2_ap 2> /dev/null
if [ "$?" == 0 ]; then
    echo "rt2860v2_ap - module unloaded"
fi
rmmod rt2860v2_ap_util 2> /dev/null
if [ "$?" == 0 ]; then
    echo "rt2860v2_ap_util - module unloaded"
fi

rmmod rt2860v2_sta_net 2> /dev/null
if [ "$?" == 0 ]; then
    echo "rt2860v2_sta_net - module unloaded"
fi
rmmod rt2860v2_sta 2> /dev/null
if [ "$?" == 0 ]; then
    echo "rt2860v2_sta - module unloaded"
fi
rmmod rt2860v2_sta_util 2> /dev/null
if [ "$?" == 0 ]; then
    echo "rt2860v2_sta_util - module unloaded"
fi

celeno_init make_wireless_config rt2860
# celeno production flag
if [ "$CONFIG_CELENO_INIC_MODE" = "y" ]; then
    IS_PRODUCTION_MODE=`i2ccmd read 35a |cut -b19 | awk '{print toupper($0)}'`
    if [ "$IS_PRODUCTION_MODE" == 1 ]; then
        echo "INIC MODE: Operational Mode"
        IS_PRODUCTION_MODE=0
    else
        echo "INIC MODE: Production Mode ($IS_PRODUCTION_MODE)"
        IS_PRODUCTION_MODE=1
    fi		
else
    IS_PRODUCTION_MODE=0
    prod.sh
    if [ "$?" == 1 ]; then
        IS_PRODUCTION_MODE=1
    fi
fi
echo $IS_PRODUCTION_MODE > /var/run/isProductionMode
cetg_TG=`nvram_get cetg_TG`
echo "cetg_TG=$cetg_TG!!!"
if [ "$cetg_TG" != "1" ]; then
    echo "cetg_TG=$cetg_TG!=1"
    if [ "$stamode" = "y" ]; then
        # celeno(removed):insmod -q rt2860v2_sta_util
        #celeno - remove the ap related modules from the RAM to save space
        if [ -e /lib/modules/2.6.21/kernel/drivers/net/wireless/rt2860v2_ap/rt2860v2_ap.ko ];     # Check if file exists.
        then
            rm /lib/modules/2.6.21/kernel/drivers/net/wireless/rt2860v2_ap/rt2860v2_ap.ko
        fi
        if [ -e /lib/modules/2.6.21/kernel/drivers/net/wireless/cedrv/cedrv.ko ];     # Check if file exists.
        then
            rm /lib/modules/2.6.21/kernel/drivers/net/wireless/cedrv/cedrv.ko
        fi
    	  #if [ "$ra_enabled" == "1" ]; then
        	#load module
        	insmod -q rt2860v2_sta g_CE_is_production_mode=$IS_PRODUCTION_MODE
        	# celeno(removed):insmod -q rt2860v2_sta_net
        #fi
        
        if [ "$CONFIG_RT2860V2_STA_WPA_SUPPLICANT" == "y" ]; then
        celeno_init gen cert
        fi
    else
        if [ "$CONFIG_RT2860V2_AP_WAPI" == "y" ]; then
        celeno_init gen wapi
        fi
        # celeno(removed):insmod -q rt2860v2_ap_util
        #celeno - remove the ap related modules from the RAM to save space
        if [ -e /lib/modules/2.6.21/kernel/drivers/net/wireless/rt2860v2_sta/rt2860v2_sta.ko ]; then    # Check if file exists.
            rm /lib/modules/2.6.21/kernel/drivers/net/wireless/rt2860v2_sta/rt2860v2_sta.ko
        fi
    	if [ "$ra_enabled" == "1" ]; then
        	#load module
        	insmod -q rt2860v2_ap g_CE_is_production_mode=$IS_PRODUCTION_MODE
        	#echo $IS_PRODUCTION_MODE > /var/run/isProductionMode
    	fi
        # celeno(removed):insmod -q rt2860v2_ap_net
    fi
fi
sysevent-dispatch &
vpn-passthru.sh

# celeno(disable): ifRaixWdsxDown
# RTDEV_PCIe support
if [ "$CONFIG_RTDEV_PCI" != "" ]; then
    celeno_init make_wireless_config rtdev
    if [ "$RT2880v2_INIC_PCI" != "" ]; then
        rmmod iNIC_pci
        insmod -q iNIC_pci 
    elif [ "$CONFIG_RT3090_AP" != "" ]; then
        if [ "$rai_enabled" == "1" ]; then
            rmmod RT3090_ap_net 2> /dev/null
            rmmod RT3090_ap 2> /dev/null
            rmmod RT3090_ap_util 2> /dev/null
            insmod -q RT3090_ap_util
            insmod -q RT3090_ap
            insmod -q RT3090_ap_net
        fi
    elif [ "$CONFIG_RT5392_AP" != "" ]; then
        rmmod RT5392_ap
        insmod -q RT5392_ap
    fi
# RTDEV_USB support
elif [ "$CONFIG_RTDEV_USB" != "" ]; then
    iNIC_USB_en=`nvram_get rtdev InicUSBEnable`
    celeno_init make_wireless_config rtdev
    if [ "$iNIC_USB_en" == "1" ]; then
        if [ "$RT305x_INIC_USB" != "" ]; then
            rmmod iNIC_usb
            insmod -q iNIC_usb 
        elif [ "$CONFIG_RT3572_AP" != "" ]; then
            rmmod RT3572_ap_net
            rmmod RT3572_ap
            rmmod RT3572_ap_util
            insmod -q RT3572_ap_util
            insmod -q RT3572_ap
            insmod -q RT3572_ap_net
        elif [ "$CONFIG_RT5572_AP" != "" ]; then
            rmmod RT5572_ap_net
            rmmod RT5572_ap
            rmmod RT5572_ap_util
            insmod -q RT5572_ap_util
            insmod -q RT5572_ap
            insmod -q RT5572_ap_net
        fi
    fi
# RT2561(Legacy) support
elif [ "$CONFIG_RT2561_AP" != "" ]; then
    rmmod rt2561ap
    celeno_init make_wireless_config rtdev
    insmod -q rt2561ap
fi

# config interface
ifconfig ra0 0.0.0.0 1>/dev/null 2>&1
#if [ "$ethconv" = "y" ]; then
#	iwpriv ra0 set EthConvertMode=dongle
#fi


if [ "$CONFIG_RAETH_ROUTER" = "y" -o "$CONFIG_MAC_TO_MAC_MODE" = "y" -o "$CONFIG_RT_3052_ESW" = "y" ]; then
    vconfig rem eth2.1
    vconfig rem eth2.2
if [ "$CONFIG_RAETH_SPECIAL_TAG" == "y" ]; then
	vconfig rem eth2.3
	vconfig rem eth2.4
	vconfig rem eth2.5
fi
    rmmod 8021q
    insmod -q 8021q
    vconfig add eth2 1
    set_vlan_map eth2.1
    vconfig add eth2 2
    set_vlan_map eth2.2
if [ "$CONFIG_RAETH_SPECIAL_TAG" == "y" ]; then
	vconfig add eth2 3
	set_vlan_map eth2.3
	vconfig add eth2 4
	set_vlan_map eth2.4
	vconfig add eth2 5
	set_vlan_map eth2.5

if [ "$CONFIG_WAN_AT_P0" = "y" ]; then
	ifconfig eth2.1 down
	wan_mac=`nvram_get 2860 WAN_MAC_ADDR`
	if [ "$wan_mac" != "FF:FF:FF:FF:FF:FF" ]; then
	ifconfig eth2.1 hw ether $wan_mac
	fi
else
	ifconfig eth2.5 down
	wan_mac=`nvram_get 2860 WAN_MAC_ADDR`
	if [ "$wan_mac" != "FF:FF:FF:FF:FF:FF" ]; then
	ifconfig eth2.5 hw ether $wan_mac
	fi
fi
else
    ifconfig eth2.2 down
    wan_mac=`nvram_get 2860 WAN_MAC_ADDR`
    if [ "$wan_mac" != "FF:FF:FF:FF:FF:FF" ]; then
    ifconfig eth2.2 hw ether $wan_mac
    fi
fi
    ifconfig eth2.1 0.0.0.0
    ifconfig eth2.2 0.0.0.0
if [ "$CONFIG_RAETH_SPECIAL_TAG" == "y" ]; then
	ifconfig eth2.3 0.0.0.0
	ifconfig eth2.4 0.0.0.0
	ifconfig eth2.5 0.0.0.0
fi
elif [ "$CONFIG_ICPLUS_PHY" = "y" ]; then
    #remove ip alias
    # it seems busybox has no command to remove ip alias...
    ifconfig eth2:1 0.0.0.0 1>&2 2>/dev/null
fi

ifconfig br0 down 2> /dev/null
brctl delbr br0 2> /dev/null

# stop all
iptables --flush 2> /dev/null
iptables --flush -t nat 2> /dev/null
iptables --flush -t mangle 2> /dev/null

killall -q -CONT tr069

#
# init ip address to all interfaces for different OperationMode:
#   0 = Bridge Mode
#   1 = Gateway Mode
#   2 = Ethernet Converter Mode
#   3 = AP Client
#
if [ "$opmode" = "0" ]; then
    addBr0
    if [ "$CONFIG_RAETH_ROUTER" = "y" -a "$CONFIG_LAN_WAN_SUPPORT" = "y" ]; then
        echo "##### restore IC+ to dump switch #####"
        config-vlan.sh 0 0
    elif [ "$CONFIG_MAC_TO_MAC_MODE" = "y" ]; then
        echo "##### restore Vtss to dump switch #####"
        config-vlan.sh 1 0
    elif [ "$CONFIG_RT_3052_ESW" = "y" ]; then
        if [ "$CONFIG_P5_RGMII_TO_MAC_MODE" = "y" ]; then
            echo "##### restore Ralink ESW to dump switch #####"
            config-vlan.sh 2 0
            echo "##### restore Vtss to dump switch #####"
            config-vlan.sh 1 0
        else
            echo "##### restore Ralink ESW to dump switch #####"
            config-vlan.sh 2 0
        fi
    fi

    if [ "$EthFromEeprom" == "y" ]; then
        if [ "$EthPhy1Interface" != "$EEPROM_NOT_AVAIL_STR" ] ; then
            brctl addif br0 eth2
        fi
    else
	    if [ "$CONFIG_CELENO_INIC_MODE" = "y" ]; then
            has_first_phy="y"
        else	
            has_first_phy=`mii_mgr -g -p $phy1_addr -r 1 | awk '("ffff" != $4){print "y"}'`
		fi
        if [ "$has_first_phy" == "y" ] ; then
           brctl addif br0 eth2
        fi
    fi

    if [ "$EthFromEeprom" == "y" ]; then
        if [ "$EthPhy2Interface" != "$EEPROM_NOT_AVAIL_STR" ] ; then
            HasOwnBridge
            if [ $? -eq 1 ]; then
                brctl addbr br1
                brctl addif br1 eth3
            else
                brctl addif br0 eth3
            fi
        fi
    else
        addBr0Eth3
    fi

    #end 1800 
    if [ "$CONFIG_RT2860V2_AP_MBSS" = "y" -a "$ra_Bssidnum" != "1" ]; then
        addRax2Br0
    fi

#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: (SDK 3.5.2 merge)
# This script was adjusted according to Celeno networking demands
# and was heavily changed from original 3.5.2 SDK.
#
    if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" = "y" -a "$rai_enabled" == "1" ] ; then
        # RTDEV_MII support: start mii iNIC after network interface is working
        iNIC_Mii_en=`nvram_get rtdev InicMiiEnable`
        if [ "$CONFIG_RTDEV_MII" != "" -a "$iNIC_Mii_en" == "1" -a "$rai_enabled" == "1" ]; then
            ifconfig rai0 down
            rmmod iNIC_mii
            insmod -q iNIC_mii miimaster=eth2
            ifconfig rai0 up
        fi
    fi
 
    addWds2Br0
    addMesh2Br0
#	addRaix2Br0
    if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" = "y" -a "$rai_enabled" == "1" ] ; then
        ifconfig rai0 up
        HasOwnBridge
        if [ $? -eq 1 ]; then
            brctl addif br1 rai0
            # move it to better place ?
            ifconfig br1 up
        else
            brctl addif br0 rai0
        fi

        if [ "$CONFIG_CELENO_INIC_MODE" = "y" ] ; then
            if [ "$CONFIG_RT3090_AP_APCLI" = "y" ] ; then
                HasOwnBridge
                if [ $? -eq 1 ]; then
                    brctl addif br1 apclii0
                else
                    brctl addif br0 apclii0
                fi
            fi

#           if [ "$BOARD_OPERATION_MODE" = "operational" ] ; then
#               # iNIC operational mode - bring interface down until host requests otherwise
                ifconfig rai0 down
#           fi
         fi

        # Celeno: temporal support for multi bss on 2.4.G
        if [ "$CONFIG_RT3090_AP_MBSS" = "y" -a "$rai_Bssidnum" != "1" ]; then
            addRaix2Br0
        fi
    fi

    addInicWds2Br0
    addRaL02Br0
    wan.sh
    lan.sh
if [ "$CONFIG_CELENO_INIC_MODE" = "y" ]; then	
	echo '##### skip addVlanBr #####'
else
    addVlanBr
fi
    echo 0 > /proc/sys/net/ipv4/ip_forward
elif [ "$opmode" = "1" ]; then
    if [ "$CONFIG_RAETH_ROUTER" = "y" -o "$CONFIG_MAC_TO_MAC_MODE" = "y" -o "$CONFIG_RT_3052_ESW" = "y" ]; then
        if [ "$CONFIG_RAETH_ROUTER" = "y" -a "$CONFIG_LAN_WAN_SUPPORT" = "y" ]; then
            if [ "$CONFIG_WAN_AT_P0" = "y" ]; then
                echo '##### config IC+ vlan partition (WLLLL) #####'
                config-vlan.sh 0 WLLLL
            else
                echo '##### config IC+ vlan partition (LLLLW) #####'
                config-vlan.sh 0 LLLLW
            fi
        fi
        if [ "$CONFIG_MAC_TO_MAC_MODE" = "y" ]; then
            if [ "$CONFIG_WAN_AT_P0" = "y" ]; then
                echo '##### config Vtss vlan partition (WLLLL) #####'
                config-vlan.sh 1 WLLLL
            else
                echo '##### config Vtss vlan partition (LLLLW) #####'
                config-vlan.sh 1 LLLLW
            fi
        fi
        if [ "$CONFIG_RT_3052_ESW" = "y" -a "$CONFIG_LAN_WAN_SUPPORT" = "y" ]; then
            if [ "$CONFIG_P5_RGMII_TO_MAC_MODE" = "y" ]; then
                echo "##### restore Ralink ESW to dump switch #####"
                config-vlan.sh 2 0
                if [ "$CONFIG_WAN_AT_P0" = "y" ]; then
                    echo '##### config Vtss vlan partition (WLLLL) #####'
                    config-vlan.sh 1 WLLLL
                else
                    echo '##### config Vtss vlan partition (LLLLW) #####'
                    config-vlan.sh 1 LLLLW
                fi
            else
                if [ "$CONFIG_WAN_AT_P0" = "y" ]; then
                    echo '##### config Ralink ESW vlan partition (WLLLL) #####'
                    config-vlan.sh 2 WLLLL
                else
                    echo '##### config Ralink ESW vlan partition (LLLLW) #####'
                    config-vlan.sh 2 LLLLW
                fi
            fi
        fi
        addBr0
if [ "$CONFIG_RAETH_SPECIAL_TAG" == "y" ]; then
if [ "$CONFIG_WAN_AT_P4" = "y" ]; then
		brctl addif br0 eth2.1
fi
		brctl addif br0 eth2.2
		brctl addif br0 eth2.3
		brctl addif br0 eth2.4
if [ "$CONFIG_WAN_AT_P0" = "y" ]; then
		brctl addif br0 eth2.5
fi
else
		brctl addif br0 eth2.1
fi
        if [ "$CONFIG_RT2860V2_AP_MBSS" = "y" -a "$ra_Bssidnum" != "1" ]; then
                addRax2Br0
        fi
        addWds2Br0
        addMesh2Br0
        if [ "$CONFIG_RTDEV_PCI" != "" -o "$CONFIG_RTDEV_USB" != "" -o "$CONFIG_RTDEV_MII" != "" -o "$CONFIG_RT2561_AP" != "" ]; then
            addRaix2Br0
            addInicWds2Br0
            addRaL02Br0
        fi
fi
    
    # IC+ 100 PHY (one port only)
    if [ "$CONFIG_ICPLUS_PHY" = "y" ]; then
        echo '##### connected to one port 100 PHY #####'
        if [ "$CONFIG_RT2860V2_AP_MBSS" = "y" -a "$ra_Bssidnum" != "1" ]; then
            addBr0
            addRax2Br0
        fi
        addWds2Br0
        addMesh2Br0
    
        #
        # setup ip alias for user to access web page.
        #
        ifconfig eth2:1 172.32.1.254 netmask 255.255.255.0 up
    fi
    
    wan.sh
    lan.sh
    nat.sh
elif [ "$opmode" = "2" ]; then
    # if (-1 == initStaProfile())
    #   error(E_L, E_LOG, T("internet.c: profiles in nvram is broken"));
    # else
    #   initStaConnection();
    if [ "$CONFIG_RAETH_ROUTER" = "y" -a "$CONFIG_LAN_WAN_SUPPORT" = "y" ]; then
        echo "##### restore IC+ to dump switch #####"
        config-vlan.sh 0 0
    fi
    if [ "$CONFIG_MAC_TO_MAC_MODE" = "y" ]; then
        echo "##### restore Vtss to dump switch #####"
        config-vlan.sh 1 0
    fi
    if [ "$CONFIG_RT_3052_ESW" = "y" ]; then
        if [ "$CONFIG_P5_RGMII_TO_MAC_MODE" = "y" ]; then
            echo "##### restore Ralink ESW to dump switch #####"
            config-vlan.sh 2 0
            echo "##### restore Vtss to dump switch #####"
            config-vlan.sh 1 0
        else
            echo "##### restore Ralink ESW to dump switch #####"
            config-vlan.sh 2 0
        fi
    fi
    wan.sh
    lan.sh
    nat.sh
elif [ "$opmode" = "3" ]; then
    if [ "$CONFIG_RAETH_ROUTER" = "y" -o "$CONFIG_MAC_TO_MAC_MODE" = "y" -o "$CONFIG_RT_3052_ESW" = "y" ]; then
        if [ "$CONFIG_RAETH_ROUTER" = "y" ]; then
            echo "##### restore IC+ to dump switch #####"
            config-vlan.sh 0 0
        fi
        if [ "$CONFIG_MAC_TO_MAC_MODE" = "y" ]; then
            echo "##### restore Vtss to dump switch #####"
            config-vlan.sh 1 0
        fi
        if [ "$CONFIG_RT_3052_ESW" = "y" ]; then
            if [ "$CONFIG_P5_RGMII_TO_MAC_MODE" = "y" ]; then
                echo "##### restore Ralink ESW to dump switch #####"
                config-vlan.sh 2 0
                echo "##### restore Vtss to dump switch #####"
                config-vlan.sh 1 0
            else
                echo "##### restore Ralink ESW to dump switch #####"
                config-vlan.sh 2 0
            fi
        fi
    fi
    addBr0
	addRax2Br0
    brctl addif br0 eth2
    wan.sh
    lan.sh
    nat.sh
else
    echo "unknown OperationMode: $opmode"
    exit 1
fi

# INIC support
#if [ "$CONFIG_RT2880_INIC" != "" ]; then
#	ifconfig rai0 down
#	rmmod rt_pci_dev
#	celeno_init make_wireless_config rtdev
#	insmod -q rt_pci_dev
#	ifconfig rai0 up
#	RaAP&
#	sleep 3
#fi

# in order to use broadcast IP address in L2 management daemon
if [ "$CONFIG_ICPLUS_PHY" = "y" ]; then
    route add -host 255.255.255.255 dev $wan_if
else
    route add -host 255.255.255.255 dev $lan_if
fi


m2uenabled=`nvram_get 2860 M2UEnabled`
if [ "$m2uenabled" = "1" ]; then
    iwpriv ra0 set IgmpSnEnable=1
    echo "iwpriv ra0 set IgmpSnEnable=1"
fi

#Create /dev/watchdog node for Linux watchdog application
if [ "$CONFIG_RALINK_WATCHDOG" == "m" ]; then
insmod -q ralink_wdt
fi

if [ "$wifi_off" = "1" ]; then
	ifconfig ra0 down
	reg s b0180000
	reg w 400 0x1080
	reg w 1204 8
	reg w 1004 3
fi

RVT=`nvram_get 2860 RVT`
if [ "$RVT" = "1" ]; then
	insmod cls
fi

HWNAT=`nvram_get 2860 hwnatEnabled`
if [ "$HWNAT" = "1" ]; then
	insmod -q hw_nat
fi

# copy production scripts to /tmp
cp /sbin/tx_test.sh /tmp
cp /sbin/rx_test.sh /tmp
cp /sbin/tx_lab_tool.sh /tmp

# Create file, which will indicate that board
# startup initialization is finished
echo -n > /var/run/startup_finished

if [ "$CONFIG_CELENO_INIC_MODE" = "y" ]; then
    # Get dynamic IP after some delay
    dhcp_delayed=`nvram_get 2860 dhcpDelayAction`
    if [ "$dhcp_delayed" = "1" ] ; then
        echo "Delayed DHCP action"
        /sbin/delayed_dhcp_action.sh &
    else
        # Call to media_change.sh script to trigger DHCP, NTP and UPnP for the first time
        /sbin/media_change.sh linkup &
    fi
else
    # Call to media_change.sh script to trigger DHCP, NTP and UPnP for the first time
    /sbin/media_change.sh linkup &
fi

/bin/brctl setageing br0 3

#restart8021XDaemon(RT2860_NVRAM);
#firewall_init();
#management_init();
if [ "$CONFIG_CELENO_INIC_MODE" = "y" ]; then
    /bin/iNICd -i eth2 &
fi

check_MBSS ra0
if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" = "y" ]
then
	check_MBSS rai0
fi

if [ "$rai_radio_off" = "1" ] && [ "$rai_enabled" = "1" ]; then
    iwpriv rai0 set RadioOn=0
fi

