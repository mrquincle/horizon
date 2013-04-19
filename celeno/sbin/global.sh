#!/bin/sh

. /sbin/config.sh


# WAN interface name -> $wan_if
getWanIfName()
{
	wan_mode=`nvram_get 2860 wanConnectionMode`
	if [ "$opmode" = "0" ]; then
		wan_if="br0"
	elif [ "$opmode" = "1" ]; then
		if [ "$CONFIG_RAETH_ROUTER" = "y" -o "$CONFIG_MAC_TO_MAC_MODE" = "y" -o "$CONFIG_RT_3052_ESW" = "y" ]; then
		    if [ "$CONFIG_RAETH_SPECIAL_TAG" == "y" ]; then
			if [ "$CONFIG_WAN_AT_P0" == "y" ]; then
				wan_if="eth2.1"
			else
				wan_if="eth2.5"
			fi
		    else
			wan_if="eth2.2"
		    fi
		else
			wan_if="eth2"
		fi
	elif [ "$opmode" = "2" ]; then
		wan_if="ra0"
	elif [ "$opmode" = "3" ]; then
		wan_if="apcli0"
	fi

	if [ "$wan_mode" = "PPPOE" -o  "$wan_mode" = "L2TP" -o "$wan_mode" = "PPTP"  ]; then
		wan_ppp_if="ppp0"
	else
		wan_ppp_if=$wan_if
	fi
}

# LAN interface name -> $lan_if
getLanIfName()
{
	bssidnum=`nvram_get 2860 BssidNum`

	if [ "$opmode" = "0" ]; then
		lan_if="br0"
	elif [ "$opmode" = "1" ]; then
		if [ "$CONFIG_RAETH_ROUTER" = "y" -o "$CONFIG_MAC_TO_MAC_MODE" = "y" -o "$CONFIG_RT_3052_ESW" = "y" ]; then
			lan_if="br0"
		elif [ "$CONFIG_ICPLUS_PHY" = "y" ]; then 
			if [ "$CONFIG_RT2860V2_AP_MBSS" = "y" -a "$bssidnum" != "1" ]; then
				lan_if="br0"
			else
				lan_if="ra0"
			fi
		else
			lan_if="ra0"
		fi
	elif [ "$opmode" = "2" ]; then
		lan_if="eth2"
	elif [ "$opmode" = "3" ]; then
		lan_if="br0"
	fi
}

# ethernet converter enabled -> $ethconv "y"
getEthConv()
{
	ec=`nvram_get 2860 ethConvert`
	#------------------------------------------------------------------------------
	# CELENO-FIX / Benson, 17-04-2011
	# Description: as is (SDK 3.5.2 merge)
	#	
	#if [ "$opmode" = "0" -a "$CONFIG_RT2860V2_STA_DPB" = "y" -a "$ec" = "1" ]; then
	if [ "$opmode" = "0" -a "$ec" = "1" ]; then
		ethconv="y"
	else
		ethconv="n"
	fi
}

# station driver loaded -> $stamode "y"
getStaMode()
{
	if [ "$opmode" = "2" -o "$ethconv" = "y" ]; then
		stamode="y"
	else
		stamode="n"
	fi
}

inetStaticConfig()
{
	if [ "$CONFIG_CELENO_INIC_MODE" != "y" ]; then
		if [ "`nvram_get ethConvert`" = "1" ] && [ -n "`nvram_get uboot IPAutoAssignAddress`" ]; then
			nvram_set 2860 lan_ipaddr  "`nvram_get uboot IPAutoAssignAddress`"
			mask="`nvram_get uboot IPAutoAssignMask`"
			if [ -n "$mask" ]; then
				nvram_set 2860 lan_netmask "$mask"
			fi
			gw="`nvram_get uboot IPAutoAssignGateway`"
			if [ -n "$gw" ]; then
				nvram_set 2860 wan_gateway "$gw"
			fi
			pri_dns="`nvram_get uboot IPAutoAssignDNS`"
			if [ -n "$pri_dns" ]; then
				nvram_set 2860 wan_primary_dns "$pri_dns"
			fi
			nvram_set uboot IPAutoAssignAddress ""
		fi
	fi
	ip=`nvram_get 2860 lan_ipaddr`
	mask=`nvram_get 2860 lan_netmask`
	gw=`nvram_get 2860 wan_gateway`
	pri_dns=`nvram_get 2860 wan_primary_dns`
	RESOLV_CONF="/etc/resolv.conf"
	ADD_DNS="8.8.4.4 8.8.8.8"

        echo "inetStaticConfig(): Killing dhcp-client!" > /dev/console
        killall -q udhcpc

	(
		if [ "x"$gw != "x" ]; then
		    echo -e "Network configuration (static): IP[$ip] Mask[$mask] Gw[$gw]\n"
		else
		    echo -e "Network configuration (static): IP[$ip] Mask[$mask]\n"
		fi
	) > /dev/console

	(
		ifconfig $lan_if 0.0.0.0
		ifconfig $lan_if $ip netmask $mask
		if [ "x"$gw != "x" ]; then
			route add default gw $gw
		fi
	) 2> /dev/console

        echo -n > $RESOLV_CONF
	(
		for i in $pri_dns $ADD_DNS; do
			echo adding DNS $i
			echo nameserver $i >> $RESOLV_CONF
		done
	) > /dev/console
        (
                TR069Enable=`nvram_get 2860 TR069Enable`
                if [ "x"$TR069Enable == "x1" ]; then
                    sleep 15
                    TR069DM=`nvram_get 2860 TR069DM`
                    if [ "x"$TR069DM == "xTR098" ]; then
                        sendtocli http://127.0.0.1:1234/value/change/ "name=InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.IPInterfaceIPAddress&value=$ip"
                    else
                        sendtocli http://127.0.0.1:1234/value/change/ "name=Device.LAN.IPAddress&value=$ip"
                    fi
                fi
        ) &
}

send_dhcp_device_id()
{
    tr069_en=`nvram_get 2860 TR069Enable`
    tr069_dm=`nvram_get 2860 TR069DM`
    if [ "$tr069_en" = "1" -a "$tr069_dm" = "TR106" ]; then
        listen_if=$lan_if
        configure_if=$lan_if
        get_listen_interface
        udhcpc -T 10 -t 3 -A 5 -n -i $listen_if -l $configure_if -m > /dev/null 2> /dev/null
    fi
}

get_listen_interface()
{
    is_sta=`nvram_get 2860 ethConvert`
    local list_if_key=dhcpListenIF
    if [ "$is_sta" = "0" ]; then
        list_if_key=dhcpListenIF_AP
    fi
    listen_if=$( echo -n "`nvram_get 2860 $list_if_key`" |
        awk -v lan_if="$lan_if" -v bridge="$configure_if" '
            BEGIN {
                while ("ls -1 /sys/class/net/" bridge "/brif" | getline)
                    brifs[$0];
                RS=";" ;
                ORS=";" ;
            }
            {
                if (($0 != lan_if) && ($0 in brifs))
                    ifs[$0];
            }
            END {
                for (i in ifs)
                    print i;
            }
        ' )
}

inetDynamicConfig()
{
	# note: `network configuration' info is printed
	# and /var/udhcpc.lease is created
	# from within udhcpc.sh upon lease reception
	# With "-n" request udhcpc to send limited number of discovers,
	# and if failed --- exit with non-zero exit code.

        if [ ! -e /var/run/startup_finished ]; then
            # this check is done to prevent
            # starting dhcp client while system
            # initialization is continued
            return
        fi
    cetg_DUT_hostname=""
	is_ascending_retry=`nvram_get DHCP_Asc_Retry`
	cetg_DUT=`nvram_get cetg_DUT`
    cetg_HostName=`nvram_get HostName`
    if [ "$cetg_DUT" == "1" -a "$cetg_HostName" != "" ]; then
        cetg_DUT_hostname=" -h $cetg_HostName"
    else
       hostname=""
    fi
	echo "$is_ascending_retry" > /var/run/Dhcp_Ascending_Retry

	echo "Requesting dynamic network configuration ... " > /dev/console
	listen_if=$lan_if
        configure_if=$lan_if
	get_listen_interface
	if [ "$is_ascending_retry" != "1" ]; then
		# exit on timeout -> fallback to static configuration
        echo "udhcpc -T 10 -t 3 -A 5 -n -i $listen_if -l $configure_if$cetg_DUT_hostname -s /sbin/udhcpc.sh > /dev/null 2> /dev/null"
		udhcpc -T 10 -t 3 -A 5 -n -i $listen_if -l $configure_if$cetg_DUT_hostname -s /sbin/udhcpc.sh > /dev/null 2> /dev/null
	else
		# loop until we get a lease, don't fallback to static configuration
        echo "udhcpc -T 10 -t 3 -A 5    -i $listen_if -l $configure_if$cetg_DUT_hostname -s /sbin/udhcpc.sh > /dev/null 2> /dev/null"
		udhcpc -T 10 -t 3 -A 5    -i $listen_if -l $configure_if$cetg_DUT_hostname -s /sbin/udhcpc.sh > /dev/null 2> /dev/null
	fi

	if [ $? -ne 0 ]; then
		echo "no lease ... falling back to static configuration" > /dev/console
		inetStaticConfig
	fi
}
#------------------------------------------------------------------------------

opmode=`nvram_get 2860 OperationMode`
wanmode=`nvram_get 2860 wanConnectionMode`
ethconv="n"
stamode="n"
wan_if="br0"
wan_ppp_if="br0"
lan_if="br0"
getWanIfName
getLanIfName
getEthConv
getStaMode

# debug
#echo "opmode=$opmode"
#echo "wanmode=$wanmode"
#echo "ethconv=$ethconv"
#echo "stamode=$stamode"
#echo "wan_if=$wan_if"
#echo "lan_if=$lan_if"

