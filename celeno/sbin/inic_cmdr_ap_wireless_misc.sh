#!/bin/sh

### Wireless Security Menu ##
#############################

AP_Wireless_Security_Settings_Menu()
{
	while [ 1 = 1 ]
	do
		Menu=2

		LongInfoTable=0
		AUTH_MODE=$(NVG AuthMode)
		ENC_TYPE=$(NVG EncrypType)
		EN_IEE8021X=$(NVG IEEE8021X)
		MenuName=" Wireless Settings (AP,$WIFNAME) -> Security "
		MenuItem1="1) Change Security Mode"

		MenuItemCtr=1
		MenuInfoCtr=1

		if [ "$EN_IEE8021X" = "0" ]
		then
			MenuInfo1="Security Mode: $AUTH_MODE/$ENC_TYPE"
		else
			MenuInfo1="Security Mode: 802.11X/$ENC_TYPE"
		fi

		if [ "$ENC_TYPE" = "WEP" ] && [ "$EN_IEE8021X" = "0" ] ## OPEN/SHARED/AUTO WEP
		then
			MenuItemCtr=7
			MenuInfoCtr=6
			SpaceInfo=1

			MenuItem2="2) Change Default Key"
			MenuItem3="3) Change WEP Key 1"
			MenuItem4="4) Change WEP Key 2"
			MenuItem5="5) Change WEP Key 3"
			MenuItem6="6) Change WEP Key 4"
			MenuItem7="7) Manage Access Policy"

			DEF_KEY=$(NVG DefaultKeyID)
			KEY1_TYPE=$(NVG Key1Type)
			KEY1_VAL=$(NVG Key1Str1)
			KEY2_TYPE=$(NVG Key2Type)
			KEY2_VAL=$(NVG Key2Str1)
			KEY3_TYPE=$(NVG Key3Type)
			KEY3_VAL=$(NVG Key3Str1)
			KEY4_TYPE=$(NVG Key4Type)
			KEY4_VAL=$(NVG Key4Str1)

			MenuInfo2="Default Key: KEY$DEF_KEY"
			if [ "$KEY1_TYPE" = "0" ]
			then
				MenuInfo3="Key1 Value: $KEY1_VAL (Hex)"
			else
				MenuInfo3="Key1 Value: $KEY1_VAL (Ascii)"
			fi

			if [ "$KEY2_TYPE" = "0" ]
			then
				MenuInfo4="Key2 Value: $KEY2_VAL (Hex)"
			else
				MenuInfo4="Key2 Value: $KEY2_VAL (Ascii)"
			fi

			if [ "$KEY3_TYPE" = "0" ]
			then
				MenuInfo5="Key3 Value: $KEY3_VAL (Hex)"
			else
				MenuInfo5="Key3 Value: $KEY3_VAL (Ascii)"
			fi

			if [ "$KEY4_TYPE" = "0" ]
			then
				MenuInfo6="Key4 Value: $KEY4_VAL (Hex)"
			else
				MenuInfo6="Key4 Value: $KEY4_VAL (Ascii)"
			fi
		fi

		if [ "$AUTH_MODE" = "WPA" ] || [ "$AUTH_MODE" = "WPA2" ] || [ "$AUTH_MODE" = "WPA1WPA2" ] ## WPA / WPA2 / WPA1WPA2
		then
			MenuItemCtr=8
			MenuInfoCtr=6
			SpaceInfo=1

			MenuItem2="2) Change WPA Algorithm"
			MenuItem3="3) Change Key Renewal Interval"
			MenuItem4="4) Change RADIUS Server IP"
			MenuItem5="5) Change RADIUS Server Port"
			MenuItem6="6) Change RADIUS Server Shared Secret"
			MenuItem7="7) Change RADIUS Server Session Timeout"
			MenuItem8="8) Manage Access Policy"

			KEY_RENEWAL=$(NVG RekeyInterval)
			RADIUS_Server=$(NVG RADIUS_Server)
			RADIUS_Port=$(NVG RADIUS_Port)
			RADIUS_Key=$(NVG RADIUS_Key1)
			RADIUS_Timeout=$(NVG session_timeout_interval)

			MenuInfo2="Key Renewal Interval: $KEY_RENEWAL"
			MenuInfo3="RADIUS Server IP: $RADIUS_Server"
			MenuInfo4="RADIUS Server Port: $RADIUS_Port"
			MenuInfo5="RADIUS Server Shared Secret: $RADIUS_Key"
			MenuInfo6="RADIUS Server Session Timeout: $RADIUS_Timeout"
		elif [ "$AUTH_MODE" = "WPAPSK" ] || [ "$AUTH_MODE" = "WPA2PSK" ] || [ "$AUTH_MODE" = "WPAPSKWPA2PSK" ] ## WPA-PSK
		then
			MenuItemCtr=5
			MenuInfoCtr=3
			SpaceInfo=1

			MenuItem2="2) Change WPA Algorithm"
			MenuItem3="3) Change Key Renewal Interval"
			MenuItem4="4) Change WPA Passphrase"
			MenuItem5="5) Manage Access Policy"

			KEY_RENEWAL=$(NVG RekeyInterval)
			WPA_PASSPHRASE=$(NVG WPAPSK1)

			MenuInfo2="Key Renewal Interval: $KEY_RENEWAL"
			MenuInfo3="WPA Passphrase: $WPA_PASSPHRASE"
		fi

		if [ "$EN_IEE8021X" = "1" ] ## 80211.X
		then
			MenuItemCtr=7
			MenuInfoCtr=5
			SpaceInfo=1

			if [ "$ENC_TYPE" = "NONE" ]
			then
				MenuItem2="2) Enable WEP"
			else
				MenuItem2="2) Disable WEP"
			fi

			MenuItem3="3) Change RADIUS Server IP"
			MenuItem4="4) Change RADIUS Server Port"
			MenuItem5="5) Change RADIUS Server Shared Secret"
			MenuItem6="6) Change RADIUS Server Session Timeout"
			MenuItem7="7) Manage Access Policy"

			RADIUS_Server=$(NVG RADIUS_Server)
			RADIUS_Port=$(NVG RADIUS_Port)
			RADIUS_Key=$(NVG RADIUS_Key1)
			RADIUS_Timeout=$(NVG session_timeout_interval)

			MenuInfo2="RADIUS Server IP: $RADIUS_Server"
			MenuInfo3="RADIUS Server Port: $RADIUS_Port"
			MenuInfo4="RADIUS Server Shared Secret: $RADIUS_Key"
			MenuInfo5="RADIUS Server Session Timeout: $RADIUS_Timeout"
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

		$MenuOptM2=$(DEC $MenuOpt 2)

		# valid input here
		if [ "$MenuOpt" = "1" ]
		then
			echo " Select Security Mode"
			echo " -----------------"
			echo "1) Disabled (OPEN)"
			echo "2) OPEN WEP"
			echo "3) SHARED WEP"
			echo "4) WEP AUTO"
			echo "5) WPA"
			echo "6) WPA-PSK"
			echo "7) WPA2"
			echo "8) WPA2-PSK"
			echo "9) WPA-PSK WPA2-PSK"
			echo "10) WPA1 WPA2"
			echo "11) 802.11X"

			SELECTION=-1

			read SELECTION

			case $SELECTION in
				"1") NEW_AuthMode=OPEN; NEW_EncrypType=NONE ;;
				"2") NEW_AuthMode=OPEN; NEW_EncrypType=WEP ;;
				"3") NEW_AuthMode=SHARED; NEW_EncrypType=WEP ;;
				"4") NEW_AuthMode=WEPAUTO; NEW_EncrypType=WEP ;;
				"5") NEW_AuthMode=WPA; NEW_EncrypType=AES ;;
				"6") NEW_AuthMode=WPAPSK; NEW_EncrypType=AES ;;
				"7") NEW_AuthMode=WPA2; NEW_EncrypType=AES ;;
				"8") NEW_AuthMode=WPA2PSK; NEW_EncrypType=AES ;;
				"9") NEW_AuthMode=WPAPSKWPA2PSK; NEW_EncrypType=AES ;;
				"10") NEW_AuthMode=WPA1WPA2; NEW_EncrypType=AES ;;
				"11") NEW_AuthMode=OPEN; NEW_EncrypType=NONE; NVS IEEE8021X 1; IWP IEEE8021X 1 ;;
			esac

			if [ "$SELECTION" -gt 0 ] && [ "$SELECTION" -lt 12 ]
			then
				NVS EncrypType $NEW_EncrypType
				NVS AuthMode $NEW_AuthMode

				IWP AuthMode $NEW_AuthMode
				IWP EncrypType $NEW_EncrypType
				if [ "$SELECTION" != "11" ]
				then
					NVS IEEE8021X 0
					IWP IEEE8021X 0
				fi
			fi
		fi

		if [ "$ENC_TYPE" = "WEP" ] && [ "$EN_IEE8021X" = "0" ]
		then
			if [ "$MenuOpt" = "2" ]
			then
				echo "Enter new default WEP key (1,2,3 or 4)"
				read NEW_DEF_KEY
				if [ "$NEW_DEF_KEY" -gt 0 ] && [ "$NEW_DEF_KEY" -lt 5 ]
				then
					NVS DefaultKeyID $NEW_DEF_KEY
					IWP DefaultKeyID $NEW_DEF_KEY
				fi
			elif [ "$MenuOpt" = "3" ] || [ "$MenuOpt" = "4" ] || [ "$MenuOpt" = "5" ] || [ "$MenuOpt" = "6" ]
			then
				echo "Enter new Key #$MenuOptM2 Type (0 - Hex , 1 - Ascii) "
				read NEW_KEY_TYPE
				while [ "$NEW_KEY_TYPE" != "0" ] && [ "$NEW_KEY_TYPE" != "1" ]
				do
					$ERR1
					echo "Enter new Key #$MenuOptM2 Type (0 - Hex , 1 - Ascii) "
					read NEW_KEY_TYPE
				done

				if [ "$NEW_KEY_TYPE" = "0" ] ## HEX
				then
					echo "Enter Key #$MenuOptM2 Value (10 or 26 hexadecimal numbers) "
					read NEW_KEY
					VALID_CHAR=$(echo $NEW_KEY | sed 's/[0-9A-Fa-f]//g')
					VALID_LEN=$(expr length $NEW_KEY)
					while (!([ -z "$VALID_CHAR" ] && ([ "$VALID_LEN" = "10" ] ||[ "$VALID_LEN" = "26" ])))
					do
						$ERR1
						echo "Enter Key #$MenuOptM2 Value (10 or 26 hexadecimal numbers) "
						read NEW_KEY
						VALID_CHAR=$(echo $NEW_KEY | sed 's/[0-9A-Fa-f]//g')
						VALID_LEN=$(expr length $NEW_KEY)
					done

					if [ "$MenuOpt" = "3" ]
					then
						NVS Key1Type 0
						NVS Key1Str1 $NEW_KEY
						IWP Key1 $NEW_KEY
					elif [ "$MenuOpt" = "4" ]
					then
						NVS Key2Type 0
						NVS Key2Str1 $NEW_KEY
						IWP Key2 $NEW_KEY
					elif [ "$MenuOpt" = "5" ]
					then
						NVS Key3Type 0
						NVS Key3Str1 $NEW_KEY
						IWP Key3 $NEW_KEY
					elif [ "$MenuOpt" = "6" ]
					then
						NVS Key4Type 0
						NVS Key4Str1 $NEW_KEY
						IWP Key4 $NEW_KEY
					fi
				else ## ASCII
					echo "Enter Key #$MenuOptM2 Value (5 or 13 ascii characters) "
					read NEW_KEY
					VALID_CHAR=$(echo $NEW_KEY | sed 's/[0-9A-Za-z]//g')
					VALID_LEN=$(expr length $NEW_KEY)
					while (!([ -z "$VALID_CHAR" ] && ([ "$VALID_LEN" = "5" ] ||[ "$VALID_LEN" = "13" ])))
					do
						$ERR1
						echo "Enter Key #$MenuOptM2 Value (5 or 13 ascii characters) "
						read NEW_KEY
						VALID_CHAR=$(echo $NEW_KEY | sed 's/[0-9A-Za-z]//g')
						VALID_LEN=$(expr length $NEW_KEY)
					done

					if [ "$MenuOpt" = "3" ]
					then
						NVS Key1Type 1
						NVS Key1Str1 $NEW_KEY
						IWP Key1 $NEW_KEY
					elif [ "$MenuOpt" = "4" ]
					then
						NVS Key2Type 1
						NVS Key2Str1 $NEW_KEY
						IWP Key2 $NEW_KEY
					elif [ "$MenuOpt" = "5" ]
					then
						NVS Key3Type 1
						NVS Key3Str1 $NEW_KEY
						IWP Key3 $NEW_KEY
					elif [ "$MenuOpt" = "6" ]
					then
						NVS Key4Type 1
						NVS Key4Str1 $NEW_KEY
						IWP Key4 $NEW_KEY
					fi
				fi
			elif [ "$MenuOpt" = "7" ]
			then
				AP_Wireless_Security_AccessPolicy_Menu
			fi
		fi ## WEP

		if [ "$AUTH_MODE" = "WPA" ] || [ "$AUTH_MODE" = "WPA2" ] || [ "$AUTH_MODE" = "WPA1WPA2" ]
		then
			if [ "$MenuOpt" = "2" ]
			then
				echo "Choose a new WPA Algorithm"
				echo " -----------------"
				echo "1) TKIP"
				echo "2) AES"
				if [ "$AUTH_MODE" = "WPA1WPA2" ]
				then
					echo "3) TKIP/AES"
				fi

				read NEW_ALG
				if [ "$NEW_ALG" = "1" ]
				then
					NVS EncrypType TKIP
					IWP EncrypType TKIP
				elif [ "$NEW_ALG" = "2" ]
				then
					NVS EncrypType AES
					IWP EncrypType AES
				elif [ "$NEW_ALG" = "3" ] && [ "$AUTH_MODE" = "WPA1WPA2" ]
				then
					NVS EncrypType TKIPAES
					IWP EncrypType TKIPAES
				fi
			elif [ "$MenuOpt" = "3" ]
			then
				echo "Enter a new key renewal interval (0~4194303 sec)"
				read NEW_KEY_RENEWAL
				while (!([ "$NEW_KEY_RENEWAL" -gt -1 ] && [ "$NEW_KEY_RENEWAL" -lt 4194304 ]))
				do
					$ERR1
					echo "Enter a new key renewal interval (0~4194303 sec)"
					read NEW_KEY_RENEWAL
				done

				NVS RekeyInterval $NEW_KEY_RENEWAL
				IWP RekeyInterval $NEW_KEY_RENEWAL
			elif [ "$MenuOpt" = "4" ]
			then
				echo "Enter new RADIUS server ip (xxx.xxx.xxx.xxx)"
				read NEW_RADIUS_Server

				CheckRADIUS_Server=$(echo $NEW_RADIUS_Server | sed "s/[0-9]\{1,3\}//g")
				if [ "$CheckRADIUS_Server" = "..." ]
				then
					NVS RADIUS_Server $NEW_RADIUS_Server
				else
					echo "Invalid IP format"
					sleep 1
				fi
			elif [ "$MenuOpt" = "5" ]
			then
				echo "Enter new RADIUS server Port (0 - 99999)"
				read NEW_RADIUS_PORT
				while (!([ "$NEW_RADIUS_PORT" -gt -1 ] && [ "$NEW_RADIUS_PORT" -lt 99999 ]))
				do
					$ERR1
					echo "Enter new RADIUS server Port (0 - 99999)"
					read NEW_RADIUS_PORT
				done
				NVS RADIUS_Port $NEW_RADIUS_PORT
			elif [ "$MenuOpt" = "6" ]
			then
				echo "Enter new RADIUS server shared secret"
				read NEW_RADIUS_Key
				NVS RADIUS_Key1 $NEW_RADIUS_Key
			elif [ "$MenuOpt" = "7" ]
			then
				echo "Enter new session timeout interval (0~4194303 sec)"
				read RADIUS_Timeout
				while (!([ "$RADIUS_Timeout" -gt -1 ] && [ "$RADIUS_Timeout" -lt 4194304 ]))
				do
					$ERR1
					echo "Enter new session timeout interval"
					read RADIUS_Timeout
				done
				NVS session_timeout_interval $RADIUS_Timeout
			elif [ "$MenuOpt" = "8" ]
			then
				AP_Wireless_Security_AccessPolicy_Menu
			fi
		elif [ "$AUTH_MODE" = "WPAPSK" ] || [ "$AUTH_MODE" = "WPA2PSK" ] || [ "$AUTH_MODE" = "WPAPSKWPA2PSK" ] ## WPA1-PSK / WPA2-PSK
		then
			if [ "$MenuOpt" = "2" ]
			then
				echo "Choose a new WPA Algorithm"
				echo " -----------------"
				echo "1) TKIP"
				echo "2) AES"
				if [ "$AUTH_MODE" = "WPAPSKWPA2PSK" ]
				then
					echo "3) TKIP/AES"
				fi

				read NEW_ALG
				if [ "$NEW_ALG" = "1" ]
				then
					NVS EncrypType TKIP
					IWP EncrypType TKIP
				elif [ "$NEW_ALG" = "2" ]
				then
					NVS EncrypType AES
					IWP EncrypType AES
				elif [ "$NEW_ALG" = "3" ] && [ "$AUTH_MODE" = "WPAPSKWPA2PSK" ]
				then
					NVS EncrypType TKIPAES
					IWP EncrypType TKIPAES
				fi
			elif [ "$MenuOpt" = "3" ]
			then
				echo "Enter a new key renewal interval (0~4194303 sec)"
				read NEW_KEY_RENEWAL
				while (!([ "$NEW_KEY_RENEWAL" -gt -1 ] && [ "$NEW_KEY_RENEWAL" -lt 4194304 ]))
				do
					$ERR1
					echo "Enter a new key renewal interval (0~4194303 sec)"
					read NEW_KEY_RENEWAL
				done
				NVS RekeyInterval $NEW_KEY_RENEWAL
			elif [ "$MenuOpt" = "4" ]
			then
				echo "Enter new WPA Passphrase"
				read NEW_WPA_PASSPHRASE
				NVS WPAPSK1 $NEW_WPA_PASSPHRASE
				IWP WPAPSK $NEW_WPA_PASSPHRASE
			elif [ "$MenuOpt" = "5" ]
			then
				AP_Wireless_Security_AccessPolicy_Menu
			fi
		fi ## WPAPSK

		if [ "$EN_IEE8021X" = "1" ] ## 802.11x
		then
			if [ "$MenuOpt" = "2" ]
			then
				if [ "$ENC_TYPE" = "NONE" ]
				then
					echo "Are you sure? (Enable WEP) [y/n] "
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS EncrypType WEP
					fi
				else
					echo "Are you sure? (Disable WEP) [y/n] "
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS EncrypType NONE
					fi
				fi
			elif [ "$MenuOpt" = "3" ]
			then
				echo "Enter new RADIUS server ip (xxx.xxx.xxx.xxx)"
				read NEW_RADIUS_Server

				CheckRADIUS_Server=$(echo $NEW_RADIUS_Server | sed "s/[0-9]\{1,3\}//g")
				if [ "$CheckRADIUS_Server" = "..." ]
				then
					NVS RADIUS_Server $NEW_RADIUS_Server
				else
					echo "Invalid IP format"
					sleep 1
				fi
			elif [ "$MenuOpt" = "4" ]
			then
				echo "Enter new RADIUS server Port (0 - 99999)"
				read NEW_RADIUS_PORT
				while (!([ "$NEW_RADIUS_PORT" -gt -1 ] && [ "$NEW_RADIUS_PORT" -lt 99999 ]))
				do
					$ERR1
					echo "Enter new RADIUS server Port (0 - 99999)"
					read NEW_RADIUS_PORT
				done
				NVS RADIUS_Port $NEW_RADIUS_PORT
			elif [ "$MenuOpt" = "5" ]
			then
				echo "Enter new RADIUS server shared secret"
				read NEW_RADIUS_Key
				NVS RADIUS_Key1 $NEW_RADIUS_Key
			elif [ "$MenuOpt" = "6" ]
			then
				echo "Enter new session timeout interval (0~4194303 sec)"
				read RADIUS_Timeout
				while (!([ "$RADIUS_Timeout" -gt -1 ] && [ "$RADIUS_Timeout" -lt 4194304 ]))
				do
					$ERR1
					echo "Enter new session timeout interval"
					read RADIUS_Timeout
				done
				NVS session_timeout_interval $RADIUS_Timeout
			elif [ "$MenuOpt" = "7" ]
			then
				AP_Wireless_Security_AccessPolicy_Menu
			fi
		fi ## 802.11x
	done
}

######### Access Policy #########

AP_Wireless_Security_AccessPolicy_Menu()
{
	while [ 1 = 1 ]
	do
		MenuName=" Wireless Settings (AP,$WIFNAME) -> Security -> Access Policy "

		MenuItem1="1) Change Access Policy"
		MenuItem2="2) Add a Station"
		MenuItem3="3) Delete a Station"

		MenuItemCtr=3
		MenuInfoCtr=0

		Item=" "
		i=1

		ACCESS_LIST=$(NVG AccessPolicyList0)

		while [ -n "$Item" ]
		do
		 	eval "MenuInfo${i}=\$(echo \$ACCESS_LIST | sed 's/;/\n/g' | sed -n '${i}p')"
			eval "Item=\$MenuInfo${i}"

			if [ "$Item" = "NA" ]
			then
				Item=""
			fi

			if [ -n "$Item" ]
			then
				eval "MenuInfo${i}=\"Station $i: \$MenuInfo${i}\""

				MenuInfoCtr=$(INC $MenuInfoCtr 1)
				i=$(INC $i 1)
			fi
		done

		POLICY_MODE=$(NVG AccessPolicy0)

		MenuInfoCtr=$(INC $MenuInfoCtr 1)

		if [ "$POLICY_MODE" = "0" ]
		then
			eval "MenuInfo${i}=\"Access Policy: Disabled\""
		elif [ "$POLICY_MODE" = "1" ]
		then
			eval "MenuInfo${i}=\"Access Policy: Accept\""
		elif [ "$POLICY_MODE" = "2" ]
		then
			eval "MenuInfo${i}=\"Access Policy: Reject\""
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

		if [ "$MenuOpt" = "1" ]
		then
			echo "Choose a new Access Policy"
			echo "--------------------------"
			echo "1) Disabled"
			echo "2) Accept"
			echo "3) Reject"

			read SELECTION
			case $SELECTION in
				"1") NVS AccessPolicy0 0;;
				"2") NVS AccessPolicy0 1;;
				"3") NVS AccessPolicy0 2;;
			esac
		elif [ "$MenuOpt" = "2" ]
		then
			echo "Enter a new Station MAC Address (XX:XX:XX:XX:XX:XX)"
			read NEW_STA_MAC

			VALID_CHAR=$(echo $NEW_STA_MAC | sed 's/[0-9A-Za-z]//g')

			if [ "$VALID_CHAR" = ":::::" ]
			then
				if [ -z "$ACCESS_LIST" ] || [ "$ACCESS_LIST" = "NA" ]
				then
					NEW_ACCESS_LIST=$NEW_STA_MAC
				else
					 eval "NEW_ACCESS_LIST=\$ACCESS_LIST\;\$NEW_STA_MAC"
				fi

				NVS AccessPolicyList0 $NEW_ACCESS_LIST
			else
				echo Invalid Station MAC Format
				sleep 1
			fi
		elif [ "$MenuOpt" = "3" ] && [ "$MenuInfoCtr" -gt 1 ]
		then
			echo "Enter Station number to delete (From the Access Policy list)"
			read STA_NUM
			if [ "$STA_NUM" -gt 0 ] && [ "$STA_NUM" -lt "$MenuInfoCtr" ]
			then
				eval "STA_TO_DEL=\$MenuInfo${STA_NUM}"
				STA_TO_DEL=$(echo $STA_TO_DEL | sed 's/ /\n/g' | sed -n '3p')
				echo "Delete $STA_TO_DEL From Access Policy List? [y/n]"
				read YN

				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					eval "NEW_ACCESS_LIST=\$(echo \$ACCESS_LIST | sed 's/;${STA_TO_DEL}//g')"
					eval "NEW_ACCESS_LIST=\$(echo \$NEW_ACCESS_LIST | sed 's/${STA_TO_DEL};//g')"
					eval "NEW_ACCESS_LIST=\$(echo \$NEW_ACCESS_LIST | sed 's/${STA_TO_DEL}//g')"

					if [ -z "$NEW_ACCESS_LIST" ]
					then
						NEW_ACCESS_LIST="NA"
					fi

					NVS AccessPolicyList0 $NEW_ACCESS_LIST
				fi
			fi
		fi
	done
}

### WDS Menu ################
#############################

AP_Wireless_WDS_Settings_Menu()
{
	while [ 1 = 1 ]
	do
		Menu=3
		MenuName=" Wireless Settings (AP,$WIFNAME)-> WDS Settings"

		SpaceInfo=0
		LongInfoTable=0

		WDS_EN=$(NVG WdsEnable)

		if [ "$WDS_EN" = "0" ] ## Disabled
		then
			MenuItemCtr=1
			MenuItem1="1) Change WDS Mode"

			MenuInfoCtr=1
			MenuInfo1="Current WDS Mode: Disabled"
		else
			MenuItemCtr=6
			MenuInfoCtr=12

			MenuItem1="1) Change WDS Mode"
			MenuItem2="2) Change PHY Mode"
			MenuItem3="3) Change Encrypt Key #1"
			MenuItem4="4) Change Encrypt Key #2"
			MenuItem5="5) Change Encrypt Key #3"
			MenuItem6="6) Change Encrypt Key #4"

			PHY_MODE=$(NVG WdsPhyMode | sed 's/;/\n/g' | sed -n '1p')

			WDS_KEY1=$(NVG Wds0Key)
			WDS_KEY2=$(NVG Wds1Key)
			WDS_KEY3=$(NVG Wds2Key)
			WDS_KEY4=$(NVG Wds3Key)

			WDS_KEY1_TYPE=$(NVG WdsEncrypType | sed 's/;/\n/g' | sed -n '1p')
			WDS_KEY2_TYPE=$(NVG WdsEncrypType | sed 's/;/\n/g' | sed -n '2p')
			WDS_KEY3_TYPE=$(NVG WdsEncrypType | sed 's/;/\n/g' | sed -n '3p')
			WDS_KEY4_TYPE=$(NVG WdsEncrypType | sed 's/;/\n/g' | sed -n '4p')

			WDS_LIST=$(NVG WdsList | sed 's/;/ /g')

			if [ "$WDS_EN" = "4" ]
			then
				MenuInfo1="Current WDS Mode: Lazy Mode"
			elif [ "$WDS_EN" = "2" ]
			then
				MenuInfo1="Current WDS Mode: Bridge Mode"
			elif [ "$WDS_EN" = "3" ]
			then
				MenuInfo1="Current WDS Mode: Repeater Mode"
			fi

			MenuInfo2="PHY Mode: $PHY_MODE"
			MenuInfo3=""
			MenuInfo4="Encrypt Key Type #1: $WDS_KEY1_TYPE"
			MenuInfo5="Encrypt Key Type #2: $WDS_KEY2_TYPE"
			MenuInfo6="Encrypt Key Type #3: $WDS_KEY3_TYPE"
			MenuInfo7="Encrypt Key Type #4: $WDS_KEY4_TYPE"
			MenuInfo8=""
			MenuInfo9="Encrypt Key #1: $WDS_KEY1"
			MenuInfo10="Encrypt Key #2: $WDS_KEY2"
			MenuInfo11="Encrypt Key #3: $WDS_KEY3"
			MenuInfo12="Encrypt Key #4: $WDS_KEY4"

			if [ "$WDS_EN" = "2" ] || [ "$WDS_EN" = "3" ]
			then
				MenuInfoCtr=16
				MenuItemCtr=7
				MenuInfo12=""
				MenuItem7="7) Change AP MAC Address List"

				WDS_AP_MAC1=$(NVG WdsList | sed 's/;/\n/g' | sed -n '1p')
				WDS_AP_MAC2=$(NVG WdsList | sed 's/;/\n/g' | sed -n '2p')
				WDS_AP_MAC3=$(NVG WdsList | sed 's/;/\n/g' | sed -n '3p')
				WDS_AP_MAC4=$(NVG WdsList | sed 's/;/\n/g' | sed -n '4p')

				MenuInfo13="AP #1 MAC Address : $WDS_AP_MAC1"
				MenuInfo14="AP #2 MAC Address : $WDS_AP_MAC2"
				MenuInfo15="AP #3 MAC Address : $WDS_AP_MAC3"
				MenuInfo16="AP #4 MAC Address : $WDS_AP_MAC4"
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

		$MenuOptM2=$(DEC $MenuOpt 2)

		if [ "$MenuOpt" = "1" ] # WDS Mode
		then
			echo "Select a WDS mode: "
			echo " ------------------------- "
			echo "1) Disabled"
			echo "2) Lazy Mode"
			echo "3) Bridge Mode"
			echo "4) Repeater Mode"

			read NEW_WDS_MODE

			case $NEW_WDS_MODE in
				"1") NVS WdsEnable 0 ;;
				"2") NVS WdsEnable 4 ;;
				"3") NVS WdsEnable 2 ;;
				"4") NVS WdsEnable 3 ;;
			esac
		fi

		if [ "$WDS_EN" != "0" ]
		then
			if [ "$MenuOpt" = "2" ] # PHY Mode
			then
				echo "Select a PHY Mode: "
				echo " ------------------------- "
				echo "1) CCK"
				echo "2) OFDM"
				echo "3) HTMIX"

				read NEW_PHY_MODE

				case $NEW_PHY_MODE in
					"1") NVS WdsPhyMode CCK\;CCK\;CCK\;CCK;;
					"2") NVS WdsPhyMode OFDM\;OFDM\;OFDM\;OFDM ;;
					"3") NVS WdsPhyMode HTMIX\;HTMIX\;HTMIX\;HTMIX ;;
				esac
			fi

			if [ "$MenuOpt" = "3" ] || [ "$MenuOpt" = "4" ] || [ "$MenuOpt" = "5" ] || [ "$MenuOpt" = "6" ] # Keys
			then
				echo "Select a new Key Type "
				echo " ------------------------- "
				echo "1) NONE"
				echo "2) WEP"
				echo "3) AES"
				echo "4) TKIP"

				NEW_KEY=""
				read NEW_KEY_ENC

				if [ "$NEW_KEY_ENC" = "1" ]
				then
					NEW_KEY_ENC="NONE"
				elif [ "$NEW_KEY_ENC" = "2" ] #WEP Validity Check
				then
					echo "Enter new Key #$MenuOptM2 Type (0 - Hex , 1 - Ascii) "
					read NEW_KEY_TYPE
					while [ "$NEW_KEY_TYPE" != "0" ] && [ "$NEW_KEY_TYPE" != "1" ]
					do
						$ERR1
						echo "Enter new Key #$MenuOptM2 Type (0 - Hex , 1 - Ascii) "
						read NEW_KEY_TYPE
					done

					if [ "$NEW_KEY_TYPE" = "0" ] ## HEX
					then
						echo "Enter Key #$MenuOptM2 Value (10 or 26 hexadecimal numbers) "
						read NEW_KEY
						VALID_CHAR=$(echo $NEW_KEY | sed 's/[0-9A-Fa-f]//g')
						VALID_LEN=$(expr length $NEW_KEY)
						while (!([ -z "$VALID_CHAR" ] && ([ "$VALID_LEN" = "10" ] ||[ "$VALID_LEN" = "26" ])))
						do
							$ERR1
							echo "Enter Key #$MenuOptM2 Value (10 or 26 hexadecimal numbers) "
							read NEW_KEY
							VALID_CHAR=$(echo $NEW_KEY | sed 's/[0-9A-Fa-f]//g')
							VALID_LEN=$(expr length $NEW_KEY)
						done
					else ## ASCII
						echo "Enter Key #$MenuOptM2 Value (5 or 13 ascii characters) "
						read NEW_KEY
						VALID_CHAR=$(echo $NEW_KEY | sed 's/[0-9A-Za-z]//g')
						VALID_LEN=$(expr length $NEW_KEY)
						while (!([ -z "$VALID_CHAR" ] && ([ "$VALID_LEN" = "5" ] ||[ "$VALID_LEN" = "13" ])))
						do
							$ERR1
							echo "Enter Key #$MenuOptM2 Value (5 or 13 ascii characters) "
							read NEW_KEY
							VALID_CHAR=$(echo $NEW_KEY | sed 's/[0-9A-Za-z]//g')
							VALID_LEN=$(expr length $NEW_KEY)
						done
					fi
					NEW_KEY_ENC="WEP"
				elif [ "$NEW_KEY_ENC" = "3" ] || [ "$NEW_KEY_ENC" = "4" ] #AES/TKIP Validity Check
				then
					echo "Enter Key #$MenuOptM2 Value (length 8-64) "
					read NEW_KEY
					VALID_LEN=$(expr length $NEW_KEY)
					while (!([ "$VALID_LEN" -gt 7 ] && [ "$VALID_LEN" -lt 65 ]))
					do
						$ERR1
						echo "Enter Key #$MenuOptM2 Value (length 8-64) "
						read NEW_KEY
						VALID_LEN=$(expr length $NEW_KEY)
					done

					if [ "$NEW_KEY_ENC" = "3" ]
					then
						NEW_KEY_ENC="AES"
					elif [ "$NEW_KEY_ENC" = "4" ]
					then
						NEW_KEY_ENC="TKIP"
					fi
				fi # AES/TKIP Validity Check

				# WRITE KEYS
				if [ "$MenuOpt" = "3" ]
				then
					NVS WdsEncrypType $NEW_KEY_ENC\;$WDS_KEY2_TYPE\;$WDS_KEY3_TYPE\;$WDS_KEY4_TYPE
					NVS Wds0Key $NEW_KEY
				elif [ "$MenuOpt" = "4" ]
				then
					NVS WdsEncrypType $WDS_KEY1_TYPE\;$NEW_KEY_ENC\;$WDS_KEY3_TYPE\;$WDS_KEY4_TYPE
					NVS Wds1Key $NEW_KEY
				elif [ "$MenuOpt" = "5" ]
				then
					NVS WdsEncrypType $WDS_KEY1_TYPE\;$WDS_KEY2_TYPE\;$NEW_KEY_ENC\;$WDS_KEY4_TYPE
					NVS Wds2Key $NEW_KEY
				elif [ "$MenuOpt" = "6" ]
				then
					NVS WdsEncrypType $WDS_KEY1_TYPE\;$WDS_KEY2_TYPE\;$WDS_KEY3_TYPE\;$NEW_KEY_ENC
					NVS Wds3Key $NEW_KEY
				fi
			fi
		fi	 # CHANGE KEYS

		if [ "$MenuOpt" = "7" ]
		then
			echo "Select AP MAC Address to change (1,2,3 or 4)"
			read AP_MAC_NUM
			if [ "$AP_MAC_NUM" -gt 0 ] && [ "$AP_MAC_NUM" -lt 5 ]
			then
				echo "Enter a new AP MAC Address"
				read NEW_AP_MAC
				VALID_CHAR=$(echo $NEW_AP_MAC | sed 's/[0-9A-Za-z]//g')
				while [ "$VALID_CHAR" != ":::::" ]
				do
					$ERR1
					echo "Enter a new AP MAC Address"
					read NEW_AP_MAC
					VALID_CHAR=$(echo $NEW_AP_MAC | sed 's/[0-9A-Za-z]//g')
				done

				if [ "$AP_MAC_NUM" = "1" ]
				then
					NVS WdsList $NEW_AP_MAC\;$WDS_AP_MAC2\;$WDS_AP_MAC3\;$WDS_AP_MAC4
				elif [ "$AP_MAC_NUM" = "2" ]
				then
					NVS WdsList $WDS_AP_MAC1\;$NEW_AP_MAC\;$WDS_AP_MAC3\;$WDS_AP_MAC4
				elif [ "$AP_MAC_NUM" = "3" ]
				then
					NVS WdsList $WDS_AP_MAC1\;$WDS_AP_MAC2\;$NEW_AP_MAC\;$WDS_AP_MAC4
				elif [ "$AP_MAC_NUM" = "4" ]
				then
					NVS WdsList $WDS_AP_MAC1\;$WDS_AP_MAC2\;$WDS_AP_MAC3\;$NEW_AP_MAC
				fi
			fi
		fi
	done
}

### AP Client Menu ################
#############################

AP_Wireless_APCLI_Settings_Menu()
{
	while [ 1 = 1 ]
	do
		Menu=3
		MenuName=" Wireless Settings (AP,$WIFNAME)-> AP Client"

		SpaceInfo=0
		LongInfoTable=0

		APCLI_EN=$(NVG ApCliEnable)

		if [ "$APCLI_EN" = "0" ] ## Disabled
		then
			MenuItemCtr=1
			MenuItem1="1) Change AP Client Mode"

			MenuInfo1="Current AP Client Mode: Disabled"
		else
			MenuItemCtr=4
			MenuInfoCtr=4

			MenuItem1="1) Change AP Client Mode"
			MenuItem2="2) Change SSID"
			MenuItem3="3) Change MAC Address (Optional)"
			MenuItem4="4) Change Security Mode"

			APCLI_SSID=$(NVG ApCliSsid)
			APCLI_BSSID=$(NVG ApCliBssid)
			APCLI_AuthMode=$(NVG ApCliAuthMode)
			APCLI_EncrypType=$(NVG ApCliEncrypType)

			MenuInfo1="Current AP Client Mode: Enabled"
			MenuInfo2="SSID: $APCLI_SSID"
			MenuInfo3="MAC Address: $APCLI_BSSID"
			MenuInfo4="Security Mode: $APCLI_AuthMode/$APCLI_EncrypType"
			MenuInfo5=""

			if [ "$APCLI_AuthMode" = "OPEN" ] || [ "$APCLI_AuthMode" = "SHARED" ] #WEP
			then
				MenuInfoCtr=10
				MenuItemCtr=9

				MenuItem5="5) Change Default Key"
				MenuItem6="6) Change WEP Key 1"
				MenuItem7="7) Change WEP Key 2"
				MenuItem8="8) Change WEP Key 3"
				MenuItem9="9) Change WEP Key 4"

				APCLI_DEF_KEY=$(NVG ApCliDefaultKeyId)
				APCLI_KEY1_TYPE=$(NVG ApCliKey1Type)
				APCLI_KEY1_VAL=$(NVG ApCliKey1Str)
				APCLI_KEY2_TYPE=$(NVG ApCliKey2Type)
				APCLI_KEY2_VAL=$(NVG ApCliKey2Str)
				APCLI_KEY3_TYPE=$(NVG ApCliKey3Type)
				APCLI_KEY3_VAL=$(NVG ApCliKey3Str)
				APCLI_KEY4_TYPE=$(NVG ApCliKey4Type)
				APCLI_KEY4_VAL=$(NVG ApCliKey4Str)

				if [ -n "$APCLI_DEF_KEY" ]
				then
					MenuInfo6="Default Key: KEY$APCLI_DEF_KEY"
				else
					MenuInfo6="Default Key:"
				fi

				if [ "$APCLI_KEY1_TYPE" = "0" ]
				then
					MenuInfo7="Key1 Value: $APCLI_KEY1_VAL (Hex)"
				else
					MenuInfo7="Key1 Value: $APCLI_KEY1_VAL (Ascii)"
				fi

				if [ "$APCLI_KEY2_TYPE" = "0" ]
				then
					MenuInfo8="Key2 Value: $APCLI_KEY2_VAL (Hex)"
				else
					MenuInfo8="Key2 Value: $APCLI_KEY2_VAL (Ascii)"
				fi

				if [ "$APCLI_KEY3_TYPE" = "0" ]
				then
					MenuInfo9="Key3 Value: $APCLI_KEY3_VAL (Hex)"
				else
					MenuInfo9="Key3 Value: $APCLI_KEY3_VAL (Ascii)"
				fi

				if [ "$APCLI_KEY4_TYPE" = "0" ]
				then
					MenuInfo10="Key4 Value: $APCLI_KEY4_VAL (Hex)"
				else
					MenuInfo10="Key4 Value: $APCLI_KEY4_VAL (Ascii)"
				fi
			elif [ "$APCLI_AuthMode" = "WPAPSK" ] || [ "$APCLI_AuthMode" = "WPA2PSK" ] #AES/TKIP
			then
				MenuInfoCtr=6
				MenuItemCtr=6

				MenuItem5="5) Change WPA Algorithm"
				MenuItem6="6) Change WPA Passpharse"

				APCLI_Passphrase=$(NVG ApCliWPAPSK)

				MenuInfo6="WPA Passphrase: $APCLI_Passphrase"
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

		$MenuOptM5=$(DEC $MenuOpt 5)

		if [ "$APCLI_EN" = "0" ] ## APCLI disabled
		then
			if [ "$MenuOpt" = "1" ]
			then
				echo "Are you sure (Enable AP Client) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS ApCliEnabled 1
					IWP ApCliEnable 1
				fi
			fi
		else # APCLI enabled
			if [ "$MenuOpt" = "1" ]
			then
				echo "Are you sure (Disable AP Client) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS ApCliEnabled 0
					IWP ApCliEnable 0
				fi
			elif [ "$MenuOpt" = "2" ] # Change SSID
			then
				echo "Are you sure? (Change SSID) [y/n] "
				read YN

				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					echo "Enter new SSID "
					read NEW_SSID
					NVS ApCliSsid $NEW_SSID
					IWP ApCliSsid $NEW_SSID
				fi
			elif [ "$MenuOpt" = "3" ]
			then
				echo "Enter a new AP MAC Address"
					read NEW_AP_MAC
					VALID_CHAR=$(echo $NEW_AP_MAC | sed 's/[0-9A-Za-z]//g')
					while [ "$VALID_CHAR" != ":::::" ]
					do
						$ERR1
						echo "Enter a new AP MAC Address"
						read NEW_AP_MAC
						VALID_CHAR=$(echo $NEW_AP_MAC | sed 's/[0-9A-Za-z]//g')
					done
					NVS ApCliBssid $NEW_APCLI_SSID
					IWP ApCliBssid $NEW_SSID
			elif [ "$MenuOpt" = "4" ]
			then
				echo " Select Security Mode"
				echo " -----------------"
				echo "1) OPEN WEP"
				echo "2) SHARED WEP"
				echo "3) WPA-PSK"
				echo "4) WPA2-PSK"

				read SELECTION

				case $SELECTION in
					"1") NEW_ApCliAuthMode=OPEN; NEW_ApCliEncrypType=WEP ;;
					"2") NEW_ApCliAuthMode=SHARED; NEW_ApcliEncrypType=WEP ;;
					"3") NEW_ApCliAuthMode=WPAPSK; NEW_ApCliEncrypType=AES ;;
					"4") NEW_ApCliAuthMode=WPA2PSK; NEW_ApCliEncrypType=AES ;;
				esac

				if [ "$SELECTION" -gt 0 ] && [ "$SELECTION" -lt 5 ]
				then
					NVS ApCliAuthMode $NEW_ApCliAuthMode
					NVS ApCliEncrypType $NEW_ApCliEncrypType
					IWP ApCliAuthMode $NEW_ApCliAuthMode
					IWP ApCliEncrypType $NEW_ApCliEncrypType
				fi
			fi

			if [ "$APCLI_AuthMode" = "OPEN" ] || [ "$APCLI_AuthMode" = "SHARED" ] #WEP
			then
				if [ "$MenuOpt" = "5" ]
				then
					echo "Enter new default WEP key (1,2,3 or 4)"
					read NEW_DEF_KEY
					if [ "$NEW_DEF_KEY" -gt 0 ] && [ "$NEW_DEF_KEY" -lt 5 ]
					then
						NVS ApCliDefaultKeyID $NEW_DEF_KEY
						IWP ApCliDefaultKeyID $NEW_DEF_KEY
					fi
				elif [ "$MenuOpt" = "6" ] || [ "$MenuOpt" = "7" ] || [ "$MenuOpt" = "8" ] || [ "$MenuOpt" = "9" ]
				then
					echo "Enter new Key #$MenuOptM5 Type (0 - Hex , 1 - Ascii) "
					read NEW_KEY_TYPE
					while [ "$NEW_KEY_TYPE" != "0" ] && [ "$NEW_KEY_TYPE" != "1" ]
					do
						$ERR1
						echo "Enter new Key #$MenuOptM5 Type (0 - Hex , 1 - Ascii) "
						read NEW_KEY_TYPE
					done

					if [ "$NEW_KEY_TYPE" = "0" ] ## HEX
					then
						echo "Enter Key #$MenuOptM5 Value (10 or 26 hexadecimal numbers) "
						read NEW_KEY
						VALID_CHAR=$(echo $NEW_KEY | sed 's/[0-9A-Fa-f]//g')
						VALID_LEN=$(expr length $NEW_KEY)
						while (!([ -z "$VALID_CHAR" ] && ([ "$VALID_LEN" = "10" ] ||[ "$VALID_LEN" = "26" ])))
						do
							$ERR1
							echo "Enter Key #$MenuOptM5 Value (10 or 26 hexadecimal numbers) "
							read NEW_KEY
							VALID_CHAR=$(echo $NEW_KEY | sed 's/[0-9A-Fa-f]//g')
							VALID_LEN=$(expr length $NEW_KEY)
						done

						if [ "$MenuOpt" = "6" ]
						then
							NVS ApCliKey1Type 0
							NVS ApCliKey1Str $NEW_KEY
							IWP ApCliKey1 $NEW_KEY
						elif [ "$MenuOpt" = "7" ]
						then
							NVS ApCliKey2Type 0
							NVS ApCliKey2Str $NEW_KEY
							IWP ApCliKey2 $NEW_KEY
						elif [ "$MenuOpt" = "8" ]
						then
							NVS ApCliKey3Type 0
							NVS ApCliKey3Str $NEW_KEY
							IWP ApCliKey3 $NEW_KEY
						elif [ "$MenuOpt" = "9" ]
						then
							NVS ApCliKey4Type 0
							NVS ApCliKey4Str $NEW_KEY
							IWP ApCliKey4 $NEW_KEY
						fi
					else ## ASCII
						echo "Enter Key #$MenuOptM5 Value (5 or 13 ascii characters) "
						read NEW_KEY
						VALID_CHAR=$(echo $NEW_KEY | sed 's/[0-9A-Za-z]//g')
						VALID_LEN=$(expr length $NEW_KEY)
						while (!([ -z "$VALID_CHAR" ] && ([ "$VALID_LEN" = "5" ] ||[ "$VALID_LEN" = "13" ])))
						do
							$ERR1
							echo "Enter Key #$MenuOptM5 Value (5 or 13 ascii characters) "
							read NEW_KEY
							VALID_CHAR=$(echo $NEW_KEY | sed 's/[0-9A-Za-z]//g')
							VALID_LEN=$(expr length $NEW_KEY)
						done

						if [ "$MenuOpt" = "6" ]
						then
							NVS ApCliKey1Type 1
							NVS ApCliKey1Str $NEW_KEY
							IWP ApCliKey1 $NEW_KEY
						elif [ "$MenuOpt" = "7" ]
						then
							NVS ApCliKey2Type 1
							NVS ApCliKey2Str $NEW_KEY
							IWP ApCliKey2 $NEW_KEY
						elif [ "$MenuOpt" = "8" ]
						then
							NVS ApCliKey3Type 1
							NVS ApCliKey3Str $NEW_KEY
							IWP ApCliKey3 $NEW_KEY
						elif [ "$MenuOpt" = "9" ]
						then
							NVS ApCliKey4Type 1
							NVS ApCliKey4Str $NEW_KEY
							IWP ApCliKey4 $NEW_KEY
						fi
					fi
				fi
			elif [ "$APCLI_AuthMode" = "WPAPSK" ] || [ "$APCLI_AuthMode" = "WPA2PSK" ] #AES/TKIP
			then
				if [ "$MenuOpt" = "5" ]
				then
					echo "Choose a new WPA Algorithm"
					echo " -----------------"
					echo "1) TKIP"
					echo "2) AES"

					read NEW_ALG

					if [ "$NEW_ALG" = "1" ]
					then
						NVS ApCliEncrypType TKIP
						IWP ApCliEncrypType TKIP
					elif [ "$NEW_ALG" = "2" ]
					then
						NVS ApCliEncrypType AES
						IWP ApCliEncrypType AES
					fi
				elif [ "$MenuOpt" = "6" ]
				then
					echo "Enter new WPA Passphrase"
					read NEW_WPA_PASSPHRASE
					NVS ApCliWPAPSK1 $NEW_WPA_PASSPHRASE
					IWP ApCliWPAPSK $NEW_WPA_PASSPHRASE
				fi
			fi #WPA
		fi #APCLI
	done
}


#### Access Point WPS Menu (Automatically Refreshed) ####
AP_Wireless_WPS_Settings_Menu()
{
	while [ 1 = 1 ]
	do
		Menu=3
		MenuName=" Wireless Settings (AP,$WIFNAME) -> WiFi Protected Setup"
		SpaceInfo=1
		LongInfoTable=0

		WPS_EN=$(NVG WscModeOption)

		if [ "$WPS_EN" = "0" ] ## Wps Disabled
		then
			MenuItemCtr=1
			MenuItem1="1) Enable WPS"
			MenuInfoCtr=1
			MenuInfo1="WPS Disabled"
		else # wps enabled
			MenuItemCtr=4

			MenuItem1="1) Start WPS PBC Mode"
			MenuItem2="2) Start WPS PIN Mode"
			MenuItem3="3) Regenerate WPS Key (set WPS Out of box )"
			MenuItem4="4) Disable WPS"

			MenuInfoCtr=5

			if [ "$WIRELESSIF" = "$PRI_WIF" ]
			then
				#WPS_Status=$(iwpriv $WIRELESSIF show WPSStatus| sed -n '2p')
				WPS_Status=$(iwpriv $WIRELESSIF show stat | grep 'WscStatus' | sed 's/\t//g' | sed 's/=/\n/g' | sed -n '2p')
				WPS_Status=$(INC $WPS_Status 0) # Used for renumeration of the hex value 		
			else
				WPS_Status=$(iwpriv $WIRELESSIF show WPSStatus| sed -n '3p' | sed 's/=/\n/g' | sed -n '2p' )
			fi

			WPS_StatusStr=$(WPSStatusString $WPS_Status)

			MenuInfo1="WPS Enabled"
			MenuInfo2="WPS Status: $WPS_StatusStr"
			MenuInfo3=""
			MenuInfo4="WPS Key:"
			MenuInfo5=$(iwpriv $WIRELESSIF show PMK | sed -n '2p' | sed 's/\t//g' | sed 's/ /\n/g' | sed -n '3p')
		fi

		Refresh=0
		ReadInput $LONG_REFRESH
		MenuOpt=$?

		if [ "$MenuOpt" = "0" ]
		then
			return
		fi

		while [ $MenuOpt -lt 1 ] || [ $MenuOpt -gt $MenuItemCtr ]
		do
			## Refresh WPS Status
			if [ "$WIRELESSIF" = "$PRI_WIF" ]
			then
				#WPS_Status=$(iwpriv $WIRELESSIF show WPSStatus| sed -n '2p')
				WPS_Status=$(iwpriv $WIRELESSIF show stat | grep 'WscStatus' | sed 's/\t//g' | sed 's/=/\n/g' | sed -n '2p')
				WPS_Status=$(INC $WPS_Status 0) # Used for renumeration of the hex value 		
			else
				WPS_Status=$(iwpriv $WIRELESSIF show WPSStatus| sed -n '3p' | sed 's/=/\n/g' | sed -n '2p' )
			fi


			WPS_StatusStr=$(WPSStatusString $WPS_Status)

			MenuInfo2="WPS Status: $WPS_StatusStr"
			MenuInfo5=$(iwpriv $WIRELESSIF show PMK | sed -n '2p' | sed 's/\t//g' | sed 's/ /\n/g' | sed -n '3p')
			####################

			ReadInput $LONG_REFRESH
			MenuOpt=$?
			if [ "$MenuOpt" = "0" ]
			then
				return
			fi
		done

		# valid input here
		if [ "$WPS_EN" = "0" ] ## WPS disabled
		then
			if [ "$MenuOpt" = "1" ]
			then
				echo "Are you sure (Enable WPS) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS WscModeOption 7
					IWP WscConfMode 7
					sleep 1
				fi
			fi
		else # WPS Enabled
			if [ "$MenuOpt" = "1" ]
			then
				echo "Start WPS in PBC Mode [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					if [ "$PLATFORM" = "Target" ]
					then
						touch /sbin/wps_started
					fi
					IWP WscConfMode 4
					IWP WscMode 2
					IWP WscGetConf 1
				fi
			elif [ "$MenuOpt" = "2" ]
			then
				echo "Start WPS in PIN Mode [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					echo "Enter Station PIN"
					read STA_PIN
					VALID_CHAR=$(echo $STA_PIN | sed 's/[0-9]//g')
					while [ -n "$VALID_CHAR" ]
					do
						$ERR1
						echo "Enter Station PIN"
						read STA_PIN
						VALID_CHAR=$(echo $STA_PIN | sed 's/[0-9]//g')
					done

					if [ "$PLATFORM" = "Target" ]
					then
						touch /sbin/wps_started
					fi

					IWP WscConfMode 4
					IWP WscMode 1
					IWP WscPinCode $STA_PIN
					IWP WscGetConf 1
				fi
			elif [ "$MenuOpt" = "3" ]
			then
				echo "Are you sure (Regenerate WPS Key) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					 $SUDOCMD iwpriv $WIRELESSIF set WscConfStatus=1
					 echo "Done! a new WPS Key will be generated in the *NEXT* WPS Session"
					 sleep 2
				fi
			elif [ "$MenuOpt" = "4" ]
			then
				echo "Are you sure (Disable WPS) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					 NVS WscModeOption 0
					 $SUDOCMD iwpriv $WIRELESSIF set WscConfMode=0 1>/dev/null 2>\&1
				fi
			fi
		fi
	done
}

