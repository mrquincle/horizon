#!/bin/sh

##################################### LAN Settings ##################################################
#####################################################################################################

LANSettingsMenu()
{
	while [ 1 = 1 ]
	do
		NVG="nvram_get 2860"
		NVS="nvram_set 2860"

		Menu=2

		SpaceInfo=1
		LongInfoTable=0

		MenuName=" LAN Settings "
		MenuItemCtr=4

		MenuItem1="1) IP Settings"
		MenuItem2="2) DHCP Server Settings"
		MenuItem3="3) IGMP Proxy / 802.1d Spanning Tree / LLTD "

		MenuInfoCtr=2

		ETHGB_EN=$(NVG EthGbEnable)

		if [ "$ETHGB_EN" = "0" ]
		then
			MenuItem4="4) Change Ethernet Port Mode (to 1GBS Full Duplex)"
			MenuInfo1="Ethernet Port: 100 MBps Full Duplex"
		else
			MenuItem4="4) Change Ethernet Port Mode (to 100 Mbps Full Duplex)"
			MenuInfo1="Ethernet Port: 1 GBps Full Duplex"
		fi

		MAC_Address=$(ifconfig br0 | sed 's/ /\n/g'| sed -n "/^\([0-9A-Z][0-9A-Z]:\)\{5\}[0-9A-Z][0-9A-Z]$/p")

		MenuInfo2="MAC Address: $MAC_Address"

		ReadInput
		MenuOpt=$?

		if [ "$MenuOpt" = "0" ]
		then
			return
		fi

		while [ $MenuOpt -lt 1 ] || [ $MenuOpt -gt $MenuItemCtr ]
		do
			ReadInput
			MenuOpt=$?
			if [ "$MenuOpt" = "0" ]
			then
				return
			fi
		done

		# valid input here
		if [ "$MenuOpt" = "1" ]
		then
			LAN_IP_Settings_Menu
		elif [ "$MenuOpt" = "2" ]
		then
			LAN_DHCP_Settings_Menu
		elif [ "$MenuOpt" = "3" ]
		then
			LAN_MISC_Settings_Menu
		elif [ "$MenuOpt" = "4" ]
		then
			if [ "$ETHGB_EN" = "0" ]
			then
				echo "Are you sure (Ethernet Port -> 1 GBps Full Duplex) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS EthGbEnable 1
				fi
			else
				echo "Are you sure (Ethernet Port -> 100 MBps Full Duplex) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS EthGbEnable 0
				fi
			fi
		fi
	done
}

### IP Settings ####
####################

LAN_IP_Settings_Menu()
{
	while [ 1 = 1 ]
	do
		Menu=3
		MenuName=" LAN Settings -> IP Settings"

		SpaceInfo=1
		LongInfoTable=0

		DHCPCLIENT_EN=$(NVG dhcpClientEnabled)

		LAN2EN=$(NVG Lan2Enabled)
		LAN2IP=$(NVG lan2_ipaddr)
		LAN2NMSK=$(NVG lan2_netmask)

		if [ "$DHCPCLIENT_EN" = "0" ]
		then
			MenuItemCtr=7

			MenuItem1="1) Change IP Address"
			MenuItem2="2) Change Subnet Mask"
			MenuItem3="3) Change Default Gateway"
			MenuItem4="4) Change Primary DNS Server"
			MenuItem5="5) Change Secondary DNS Server"
			MenuItem6="6) Obtain an IP Address automatically (from DHCP)"
			MenuItem7="7) Config LAN2 Interface"

			MenuInfoCtr=9

			IPAddr=$(NVG lan_ipaddr)
			NetMask=$(NVG lan_netmask)
			DGW=$(NVG wan_gateway)
			DNS1=$(NVG wan_primary_dns)
			DNS2=$(NVG wan_secondary_dns)

			MenuInfo1="Current Mode: Manual IP Settings"
			MenuInfo2="IP Address: $IPAddr"
			MenuInfo3="Subnet Mask: $NetMask"
			MenuInfo4="Default Gateway: $DGW"
			MenuInfo5="Primary DNS Server: $DNS1"
			MenuInfo6="Secondary DNS Server: $DNS2"
			MenuInfo7=""

			if [ "$LAN2EN" = "1" ]
			then
				 MenuInfo8="LAN2 IP Address:$LAN2IP"
				 MenuInfo9="LAN2 IP Netmask:$LAN2NMSK"
			else
				 MenuInfo8="LAN2 Disabled"
				 MenuInfo9=""
			fi
		else
			MenuItemCtr=2

			MenuItem1="1) Manually set IP Address "
			MenuItem2="2) Config LAN2 Interface"

			MenuInfoCtr=4

			MenuInfo1="Current Mode: IP Address obtained automatically"
			MenuInfo2=""

			if [ "$LAN2EN" = "1" ]
			then
				 MenuInfo3="LAN2 IP Address:$LAN2IP"
				 MenuInfo4="LAN2 IP Netmask:$LAN2NMSK"
			else
				 MenuInfo3="LAN2 Disabled"
				 MenuInfo4=""
			fi
		fi

		ReadInput
		MenuOpt=$?

		if [ "$MenuOpt" = "0" ]
		then
			return
		fi

		while [ $MenuOpt -lt 1 ] || [ $MenuOpt -gt $MenuItemCtr ]
		do
			ReadInput
			MenuOpt=$?
			if [ "$MenuOpt" = "0" ]
			then
				return
			fi
		done

		# valid input here

		if [ "$DHCPCLIENT_EN" = "0" ] # Static IP
		then
			if [ "$MenuOpt" = "1" ]
			then
				echo "Enter new IP address (XXX.XXX.XXX.XXX) :"
				read NewIP

				CheckIP=$(echo $NewIP | sed "s/[0-9]\{1,3\}//g")
				if [ "$CheckIP" = "..." ]
				then
					ifconfig br0 $NewIP
					Ret=$?
					if [ "$Ret" = "0" ] || [ "$PLATFORM" = "Host" ]
					then
						NVS lan_ipaddr $NewIP
					else
						echo "Invalid IP format"
						sleep 1
					fi
				else
					echo "Invalid IP format"
					sleep 1
				fi
			elif [ "$MenuOpt" = "2" ]
			then
				echo "Enter new Subnet Mask (XXX.XXX.XXX.XXX):"
				read NewSN

				CheckSN=$(echo $NewSN | sed "s/[0-9]\{1,3\}//g")
				if [ "$CheckSN" = "..." ]
				then
					ifconfig br0 $IPAddr netmask $NewSN
					Ret=$?
					if [ "$Ret" = "0" ] || [ "$PLATFORM" = "Host" ]
					then
						NVS lan_netmask $NewSN
					else
						echo "Invalid Netmask format"
						sleep 1
					fi
				else
					echo "Invalid IP format"
					sleep 1
				fi
			elif [ "$MenuOpt" = "3" ]
			then
				echo "Enter new Default Gateway (XXX.XXX.XXX.XXX):"
				read NewDGW

				CheckDGW=$(echo $NewDGW | sed "s/[0-9]\{1,3\}//g")
				if [ "$CheckDGW" = "..." ]
				then
					NVS wan_gateway $NewDGW
				else
					echo "Invalid IP format"
					sleep 1
				fi
			elif [ "$MenuOpt" = "4" ]
			then
				echo "Enter new Primary DNS Server (XXX.XXX.XXX.XXX):"
				read NewDNS1

				CheckDNS1=$(echo $NewDNS1 | sed "s/[0-9]\{1,3\}//g")
				if [ "$CheckDNS1" = "..." ]
				then
					NVS wan_primary_dns $NewDNS1
				else
					echo "Invalid IP format"
					sleep 1
				fi
			elif [ "$MenuOpt" = "5" ]
			then
				echo "Enter new Secondary DNS Server (XXX.XXX.XXX.XXX):"
				read NewDNS2

				CheckDNS2=$(echo $NewDNS2 | sed "s/[0-9]\{1,3\}//g")
				if [ "$CheckDNS2" = "..." ]
				then
					NVS wan_secondary_dns $NewDNS2
				else
					echo "Invalid IP format"
					sleep 1
				fi
			elif [ "$MenuOpt" = "6" ]
			then
				echo "Are you sure (Obtain IP Automatically (from DHCP)) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS dhcpClientEnabled 1
				fi
			fi
		else # Dhcp Client enabled
			if [ "$MenuOpt" = "1" ]
			then
				echo "Are you sure (Manually set IP Address) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS dhcpClientEnabled 0
				fi
			fi
		fi

		if ([ "$DHCPCLIENT_EN" = "0" ] && [ "$MenuOpt" = "7" ]) || ([ "$DHCPCLIENT_EN" != "0" ] && [ "$MenuOpt" = "2" ])
		then
			echo "Enable LAN2 Interface [y/n] ?"
			read YN

			if [ $YN = "Y" ] || [ $YN = "y" ]
			then
				echo "Enter new LAN2 IP Address (XXX.XXX.XXX.XXX):"
				read NEW_LAN2IP

				CheckLAN2IP=$(echo $NEW_LAN2IP | sed "s/[0-9]\{1,3\}//g")
				while (!([ "$CheckLAN2IP" = "..." ]))
				do
					$ERR1
					echo "Enter new LAN2 IP Address (XXX.XXX.XXX.XXX):"
					read NEW_LAN2IP
					CheckLAN2IP=$(echo $NEW_LAN2IP | sed "s/[0-9]\{1,3\}//g")
				done

				echo "Enter new LAN2 Subnet Mask (XXX.XXX.XXX.XXX):"
				read NEW_LAN2NMSK

				CheckLAN2NMSK=$(echo $NEW_LAN2NMSK | sed "s/[0-9]\{1,3\}//g")
				while (!([ "$CheckLAN2NMSK" = "..." ]))
				do
					$ERR1
					echo "Enter new LAN2 Subnet Mask (XXX.XXX.XXX.XXX):"
					read NEW_LAN2NMSK

					CheckLAN2NMSK=$(echo $NEW_LAN2NMSK | sed "s/[0-9]\{1,3\}//g")
				done

				NVS Lan2Enabled 1
				NVS lan2_ipaddr $NEW_LAN2IP
				NVS lan2_netmask $NEW_LAN2NMSK
			else
				NVS Lan2Enabled 0
			fi
		fi
	done
}

### DHCP Settings ####
######################

LAN_DHCP_Settings_Menu()
{
	while [ 1 = 1 ]
	do
		Menu=3
		MenuName=" LAN Settings -> DHCP Settings"

		SpaceInfo=1
		LongInfoTable=0

		DHCP_EN=$(NVG dhcpEnabled)

		if [ "$DHCP_EN" = "0" ] ## server disabled
		then
			MenuItemCtr=1
			MenuItem1="1) Enable DHCP Server"

			MenuInfoCtr=1
			MenuInfo1="DHCP Server Disabled"
		else # server enabled
			MenuItemCtr=7

			MenuItem1="1) Change Start IP Address"
			MenuItem2="2) Change End IP Address"
			MenuItem3="3) Change Subnet Mask"
			MenuItem4="4) Change Primary DNS Server"
			MenuItem5="5) Change Secondary DNS Server"
			MenuItem6="6) Change Lease Time"
			MenuItem7="7) Disable DHCP Server"

			MenuInfoCtr=7

			DHCP_Start=$(NVG dhcpStart)
			DHCP_End=$(NVG dhcpEnd)
			DHCP_Mask=$(NVG dhcpMask)
			DHCP_PriDns=$(NVG dhcpPriDns)
			DHCP_SecDns=$(NVG dhcpSecDns)
			DHCP_Lease=$(NVG dhcpLease)

			MenuInfo1="DHCP Server Enabled"
			MenuInfo2="Start IP Address: $DHCP_Start"
			MenuInfo3="End IP Address: $DHCP_End"
			MenuInfo4="Subnet Mask: $DHCP_Mask"
			MenuInfo5="Primary DNS Server: $DHCP_PriDns"
			MenuInfo6="Secondary DNS Server: $DHCP_SecDns"
			MenuInfo7="Lease Time: $DHCP_Lease"
		fi

		ReadInput
		MenuOpt=$?

		if [ "$MenuOpt" = "0" ]
		then
			return
		fi

		while [ $MenuOpt -lt 1 ] || [ $MenuOpt -gt $MenuItemCtr ]
		do
			ReadInput
			MenuOpt=$?
			if [ "$MenuOpt" = "0" ]
			then
				return
			fi
		done

		# valid input here
		if [ "$DHCP_EN" = "0" ] ## server disabled
		then
			if [ "$MenuOpt" = "1" ]
			then
				echo "Are you sure (Enable DHCP Server) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS dhcpEnabled 1
				fi
			fi
		else # server enabled
			if [ "$MenuOpt" = "1" ]
			then
				echo "Enter new Start IP Address (XXX.XXX.XXX.XXX):"
				read NewDHCP_Start

				CheckDHCP_Start=$(echo $NewDHCP_Start | sed "s/[0-9]\{1,3\}//g")
				if [ "$CheckDHCP_Start" = "..." ]
				then
					NVS dhcpStart $NewDHCP_Start
				else
					echo "Invalid IP format"
					sleep 1
				fi
			elif [ "$MenuOpt" = "2" ]
			then
				echo "Enter new End IP Address (XXX.XXX.XXX.XXX):"
				read NewDHCP_End

				CheckDHCP_End=$(echo $NewDHCP_End | sed "s/[0-9]\{1,3\}//g")
				if [ "$CheckDHCP_End" = "..." ]
				then
					NVS dhcpEnd $NewDHCP_End
				else
					echo "Invalid IP format"
					sleep 1
				fi
			elif [ "$MenuOpt" = "3" ]
			then
				echo "Enter new Subnet Mask (XXX.XXX.XXX.XXX):"
				read NewDHCP_Mask

				CheckDHCP_Mask=$(echo $NewDHCP_Mask | sed "s/[0-9]\{1,3\}//g")
				if [ "$CheckDHCP_Mask" = "..." ]
				then
					NVS dhcpMask $NewDHCP_Mask
				else
					echo "Invalid IP format"
					sleep 1
				fi
			elif [ "$MenuOpt" = "4" ]
			then
				echo "Enter new Primary DNS (XXX.XXX.XXX.XXX):"
				read NewDHCP_PriDns

				CheckDHCP_PriDns=$(echo $NewDHCP_PriDns | sed "s/[0-9]\{1,3\}//g")
				if [ "$CheckDHCP_PriDns" = "..." ]
				then
					NVS dhcpPriDns $NewDHCP_PriDns
				else
					echo "Invalid IP format"
					sleep 1
				fi
			elif [ "$MenuOpt" = "5" ]
			then
				echo "Enter new Secondary DNS (XXX.XXX.XXX.XXX):"
				read NewDHCP_SecDns

				CheckDHCP_SecDns=$(echo $NewDHCP_SecDns | sed "s/[0-9]\{1,3\}//g")
				if [ "$CheckDHCP_SecDns" = "..." ]
				then
					NVS dhcpSecDns $NewDHCP_SecDns
				else
					echo "Invalid IP format"
					sleep 1
				fi
			elif [ "$MenuOpt" = "6" ]
			then
				echo "Enter new Lease Time"
				read NewDHCP_Lease

				CheckDHCP_Lease=$(echo $NewDHCP_Lease | sed "s/[0-9]//g")
				if [ "$CheckDHCP_Lease" = "" ]
				then
					NVS dhcpLease $NewDHCP_Lease
				else
					echo "Only numeric values are allowed!"
					sleep 1
				fi
			elif [ "$MenuOpt" = "7" ]
			then
				echo "Are you sure (Disable DHCP Server) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS dhcpEnabled 0
				fi
			fi
		fi
	done
}

### LLTD IGMP PROXY SPANNING TREE ####
######################################

LAN_MISC_Settings_Menu()
{
	while [ 1 = 1 ]
	do
		Menu=3
		MenuName=" LAN Settings -> Misc Protocols "

		SpaceInfo=1
		LongInfoTable=0

		IGMP_EN=$(NVG igmpEnabled)
		LLTD_EN=$(NVG lltdEnabled)
		STP_EN=$(NVG stpEnabled)

		MenuItemCtr=3
		MenuInfoCtr=3

		if [ "$IGMP_EN" = "0" ]
		then
			MenuItem1="1) Enable IGMP Proxy"
			MenuInfo1="IGMP Proxy Disabled"
		else
			MenuItem1="1) Disable IGMP Proxy"
			MenuInfo1="IGMP Proxy Enabled"
		fi

		if [ "$LLTD_EN" = "0" ]
		then
			MenuItem2="2) Enable LLTD"
			MenuInfo2="LLTD Disabled"
		else
			MenuItem2="2) Disable LLTD"
			MenuInfo2="LLTD Enabled"
		fi

		if [ "$STP_EN" = "0" ]
		then
			MenuItem3="3) Enable 802.1d Spanning Tree"
			MenuInfo3="802.1d Spanning Tree Disabled"
		else
			MenuItem3="3) Disable 802.1d Spanning Tree"
			MenuInfo3="802.1d Spanning Tree Enabled"
		fi

		ReadInput
		MenuOpt=$?

		if [ "$MenuOpt" = "0" ]
		then
			return
		fi

		while [ $MenuOpt -lt 1 ] || [ $MenuOpt -gt $MenuItemCtr ]
		do
			ReadInput
			MenuOpt=$?
			if [ "$MenuOpt" = "0" ]
			then
				return
			fi
		done

		# valid input here
		if [ "$MenuOpt" = "1" ]
		then
			if [ "$IGMP_EN" = "0" ]
			then
				echo "Are you sure (Enable IGMP Proxy) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS igmpEnabled 1
				fi
			else
				echo "Are you sure (Disable IGMP Proxy) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS igmpEnabled 0
				fi
			fi
		elif [ "$MenuOpt" = "2" ]
		then
			if [ "$LLTD_EN" = "0" ]
			then
				echo "Are you sure (Enable LLTD) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS lltdEnabled 1
				fi
			else
				echo "Are you sure (Disable LLTD) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS lltdEnabled 0
				fi
			fi
		elif [ "$MenuOpt" = "3" ]
		then
			if [ "$STP_EN" = "0" ]
			then
				echo "Are you sure (Enable 802.1d Spanning Tree) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS stpEnabled 1
				fi
			else
				echo "Are you sure (Disable 802.1d Spanning Tree) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS stpEnabled 0
				fi
			fi
		fi
	done
}

##################################### LAN Settings - End of section #################################
#####################################################################################################

