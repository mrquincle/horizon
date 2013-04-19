#!/bin/sh

##################################### AP Wireless Settings #############################################
#####################################################################################################

STA_WirelessSettingsMenu()
{
	while [ 1 = 1 ]
	do
		Menu=2

		SpaceInfo=1
		LongInfoTable=0

		MenuName=" Wireless Settings (Station,$WIFNAME)"
		MenuItemCtr=5

		MenuItem1="1) Basic Settings"
		MenuItem2="2) QOS Settings"
		MenuItem3="3) 11n Settings"
		MenuItem4="4) WiFi Protected Setup (WPS)"
		MenuItem5="5) Site Survey"

		MenuInfoCtr=0

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
			STA_Wireless_Basic_Settings_Menu
		elif [ "$MenuOpt" = "2" ]
		then
			STA_Wireless_QOS_Settings_Menu
		elif [ "$MenuOpt" = "3" ]
		then
			STA_Wireless_11n_Settings_Menu
		elif [ "$MenuOpt" = "4" ]
		then
			STA_Wireless_WPS_Settings_Menu
		elif [ "$MenuOpt" = "5" ]
		then
			SiteSurveyMenu
		fi
	done
}

#### Basic Settings #####
#########################

STA_Wireless_Basic_Settings_Menu()
{
	while [ 1 = 1 ]
	do
		Menu=2

		SpaceInfo=0
		LongInfoTable=0
		MenuItemCtr=10
		MenuInfoCtr=9

		MenuName=" Wireless Settings (Station,$WIFNAME) -> Basic "

		RADIO_D=$(NVG RadioOff)
		NET_MODE=$(NVG WirelessMode)
		COUNTRY_REGION=$(NVG CountryRegion)
		COUNTRY_REGION_A=$(NVG CountryRegionABand)
		BGProtection=$(NVG BGProtection)
		TxBurst=$(NVG TxBurst)

		if [ "$RADIO_D" = "1" ]
		then
			MenuItem1="1) Enable Radio"
			MenuInfo1="Radio: Disabled"
		else
			MenuItem1="1) Disable Radio"
			MenuInfo1="Radio: Enabled"
		fi

		MenuItem2="2) Change Network Mode"

		MenuInfo2="Network Mode: "

		NET_STR="Network Mode: 802.11"
		BGMode=0;
		AMode=0;
		case $NET_MODE in
			"0") MenuInfo2="$NET_STR b/g mixed mode"; BGMode=1;;
			"1") MenuInfo2="$NET_STR b only"; BGMode=1;;
			"2") MenuInfo2="$NET_STR a only"; AMode=1;;
			"3") MenuInfo2="$NET_STR a/b/g mixed mode"; BGMode=1; AMode=1 ;;
			"4") MenuInfo2="$NET_STR g only"; BGMode=1;;
			"5") MenuInfo2="$NET_STR a/b/g/n mixed mode"; BGMode=1; AMode=1;;
			"6") MenuInfo2="$NET_STR n only (2.4 Ghz)";;
			"7") MenuInfo2="$NET_STR g/n mixed mode"; BGMode=1;;
			"8") MenuInfo2="$NET_STR a/n mixed mode"; AMode=1;;
			"9") MenuInfo2="$NET_STR b/g/n mixed mode"; BGMode=1;;
			"10") MenuInfo2="$NET_STR a/g/n mixed mode"; BGMode=1;;
			"11") MenuInfo2="$NET_STR n only (5 Ghz) ";;
		esac

		if [ "$BGMode" = "1" ]
		then
			MenuItem3="3) Change Country Region Code (802.11 B/G)"
		else
			MenuItem3="3) Change Country Region Code (802.11 B/G) (*Feature N/A*)"
		fi

		if [ "$AMode" = "1" ]
		then
			MenuItem4="4) Change Country Region Code (802.11 A)"
		else
			MenuItem4="4) Change Country Region Code (802.11 A) ( *Feature N/A*)"
		fi

		MenuInfo3="802.11 B/G Channels:"

		case $COUNTRY_REGION in
			"0") MenuInfo3="802.11 B/G Channels: 1-11";;
			"1") MenuInfo3="802.11 B/G Channels: 1-13";;
			"2") MenuInfo3="802.11 B/G Channels: 10-11";;
			"3") MenuInfo3="802.11 B/G Channels: 10-13";;
			"4") MenuInfo3="802.11 B/G Channels: 14";;
			"5") MenuInfo3="802.11 B/G Channels: 1-14";;
			"6") MenuInfo3="802.11 B/G Channels: 3-9";;
			"7") MenuInfo3="802.11 B/G Channels: 5-13";;
		esac

		MenuInfo4="802.11 A Channels:"

		case $COUNTRY_REGION_A in
			"0") MenuInfo4="802.11 A Channels: 36,40,44,48,52,56,60,64,149,153,157,161,165";;
			"1") MenuInfo4="802.11 A Channels: 36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140";;
			"2") MenuInfo4="802.11 A Channels: 36,40,44,48,52,56,60,64";;
			"3") MenuInfo4="802.11 A Channels: 52,56,60,64,149,153,157,161";;
			"4") MenuInfo4="802.11 A Channels: 149,153,157,161,165";;
			"5") MenuInfo4="802.11 A Channels: 149,153,157,161";;
			"6") MenuInfo4="802.11 A Channels: 36,40,44,48";;
			"7") MenuInfo4="802.11 A Channels: 36-140,149,153,157,161,165";;
			"8") MenuInfo4="802.11 A Channels: 52,56,60,64";;
			"9") MenuInfo4="802.11 A Channels: 34,38,42,46";;
			"10") MenuInfo4="802.11 A Channels: 34,36,38,40,42,44,46,48,52,56,60,64";;
		esac

		MenuItem5="5) Change BG Protection Mode"

		if [ "$BGProtection" = "0" ]
		then
			MenuInfo5="BG Protection Mode: Auto"
		elif [ "$BGProtection" = "1" ]
		then
			MenuInfo5="BG Protection Mode: On"
		elif [ "$BGProtection" = "2" ]
		then
			MenuInfo5="BG Protection Mode: Off"
		fi

		if [ "$TxBurst" = "0" ] ## Tx Burst
		then
			MenuItem6="6) Enable Tx Burst"
			MenuInfo6="Tx Burst: Disabled"
		else
			MenuItem6="6) Disable Tx Burst"
			MenuInfo6="Tx Burst: Enabled"
		fi

		if [ "$NET_MODE" -lt 5 ] # /abg modes
		then
			MenuItemCtr=6
			MenuInfoCtr=7

			MODULATION=$(NVG FixedTxMode)

			MenuItem7="7) Change Rate"

			case $HT_MCS in
				"0") if [ "$MODULATION" = "CCK" ]; then MenuInfo7="Rate: 1 MBps"; else MenuInfo7="Rate: 6 MBps"; fi ;;
				"1") if [ "$MODULATION" = "CCK" ]; then MenuInfo7="Rate: 2 MBps"; else MenuInfo7="Rate: 9 MBps";fi ;;
				"2") if [ "$MODULATION" = "CCK" ]; then MenuInfo7="Rate: 5 MBps"; else MenuInfo7="Rate: 12 MBps";fi ;;
				"3") if [ "$MODULATION" = "CCK" ]; then MenuInfo7="Rate: 11 MBps"; else MenuInfo7="Rate: 18 MBps";fi ;;
				"4") MenuInfo7="Rate: 24 MBps";;
				"5") MenuInfo7="Rate: 36 MBps";;
				"6") MenuInfo7="Rate: 48 MBps";;
				"7") MenuInfo7="Rate: 54 MBps";;
				"33") MenuInfo7="Rate: Auto";;
			esac
		else ## n modes
			MenuItemCtr=10
			MenuInfoCtr=10

			HT_OpMode=$(NVG HT_OpMode)
			HT_BW=$(NVG HT_BW)
			HT_GI=$(NVG HT_GI)
			HT_MCS=$(NVG HT_MCS)

			if [ "$HT_OpMode" = "0" ]
			then
				MenuItem7="7) Change Operating Mode (to Green Field)"
				MenuInfo7="Operating Mode: Mixed Mode"
			else
				MenuItem7="7) Change Operating Mode (to Mixed Mode)"
				MenuInfo7="Operating Mode: Green Field"
			fi

			if [ "$HT_BW" = "0" ] ## Channel BW
			then
				MenuItem8="8) Change Channel Bandwidth (to 20/40 Mhz)"
				MenuInfo8="Channel Bandwidth: 20 Mhz"
			else
				MenuItem8="8) Change Channel Bandwidth (to 20 Mhz)"
				MenuInfo8="Channel Bandwidth: 20/40 Mhz"
			fi

			if [ "$HT_GI" = "0" ] ## GI
			then
				MenuItem9="9) Change Guard Interval (to Auto)"
				MenuInfo9="Guard Interval: Long"
			else
				MenuItem9="9) Change Guard Interval (to Long)"
				MenuInfo9="Guard Interval: Auto"
			fi

			MenuItem10="10) Change MCS"

			if [ "$HT_MCS" != "33" ]
			then
				MenuInfo10="MCS: $HT_MCS"
			else
				MenuInfo10="MCS: Auto"
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

		if [ "$MenuOpt" = "1" ] # Disable/Enable Radio
		then
			if [ "$RADIO_D" = "1" ]
			then
				echo "Are you sure? (Enable Radio) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS RadioOff 0
					IWP RadioOn 1
				fi
			else
				echo "Are you sure? (Disable Radio) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS RadioOff 1
					IWP RadioOn 0
				fi
			fi
		elif [ "$MenuOpt" = "2" ] # Network Mode
		then

			if [ "$WIRELESSIF" = "$PRI_WIF" ] # 5GHZ
			then
				echo "Select a new network mode: "
				echo " ------------------------- "
				echo "1) 802.11 a only"
				echo "2) 802.11 a/n mixed mode "
				echo "3) 802.11 n only (5 Ghz) "

				read SELECTION

				NEW_NET_MODE=-1

				case $SELECTION in
					"1") NEW_NET_MODE=2;;
					"2") NEW_NET_MODE=8;;
					"3") NEW_NET_MODE=11;;
				esac

				if [ "$NEW_NET_MODE" != "-1" ]
				then
					NVS WirelessMode $NEW_NET_MODE
					IWP WirelessMode $NEW_NET_MODE
				fi
			else # 2.4 GHZ
				echo "Select a new network mode: "
				echo " ------------------------- "
				echo "1) 802.11 b/g mixed mode"
				echo "2) 802.11 b only"
				echo "3) 802.11 g only"
				echo "4) 802.11 n only (2.4 Ghz)"
				echo "5) 802.11 b/g/n mixed mode "

				read SELECTION

				NEW_NET_MODE=-1

				case $SELECTION in
					"1") NEW_NET_MODE=0;;
					"2") NEW_NET_MODE=1;;
					"3") NEW_NET_MODE=4;;
					"4") NEW_NET_MODE=6;;
					"5") NEW_NET_MODE=9;;
				esac

				if [ "$NEW_NET_MODE" != "-1" ]
				then
					NVS WirelessMode $NEW_NET_MODE
					IWP WirelessMode $NEW_NET_MODE
				fi
			fi
		elif [ "$MenuOpt" = "3" ] && [ "$BGMode" = "1" ] # Country Code
		then
			echo "Select a Country Region Code (802.11 B/G): "
			echo " --------------------------------------- "

			echo "0) Channels 1-11"
			echo "1) Channels 1-13"
			echo "2) Channels 10-11"
			echo "3) Channels 10-13"
			echo "4) Channels 14"
			echo "5) Channels 1-14"
			echo "6) Channels 3-9"
			echo "7) Channels 5-13"
			read NEW_COUNTRY_REGION

			if [ "$NEW_COUNTRY_REGION" -gt -1 ] && [ "$NEW_COUNTRY_REGION" -lt 8 ]
			then
				NVS CountryRegion $NEW_COUNTRY_REGION
				IWP CountryRegion $NEW_COUNTRY_REGION
			fi
		elif [ "$MenuOpt" = "4" ] && [ "$AMode" = "1" ] ## Country Code (802.11A)
		then
			echo "Select a Country Region Code (802.11 A): "
			echo " --------------------------------------- "
			echo "0) Channels 36,40,44,48,52,56,60,64,149,153,157,161,165"
			echo "1) Channels 36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140"
			echo "2) Channels 36,40,44,48,52,56,60,64"
			echo "3) Channels 52,56,60,64,149,153,157,161"
			echo "4) Channels 149,153,157,161,165"
			echo "5) Channels 149,153,157,161"
			echo "6) Channels 36,40,44,48"
			echo "7) Channels 36-140,149,153,157,161,165"
			echo "8) Channels 52,56,60,64"
			echo "9) Channels 34,38,42,46"
			echo "10) Channels 34,36,38,40,42,44,46,48,52,56,60,64"

			read NEW_COUNTRY_REGION_A

			if [ "$NEW_COUNTRY_REGION_A" -gt -1 ] && [ "$NEW_COUNTRY_REGION_A" -lt 8 ]
			then
				NVS CountryRegionABand $NEW_COUNTRY_REGION_A
				IWP CountryRegionABand $NEW_COUNTRY_REGION_A
			fi
		elif [ "$MenuOpt" = "5" ] # Change BG Protection Mode)
		then
			echo "Enter new BG Protection Mode value (0 - Auto , 1 - On , 2 - Off) "
			read NEW_BGProtection
			if [ "$NEW_BGProtection" = "0" ] || [ "$NEW_BGProtection" = "1" ] || [ "$NEW_BGProtection" = "2" ]
			then
				NVS BGProtection $NEW_BGProtection
				IWP BGProtection $NEW_BGProtection
			fi
		elif [ "$MenuOpt" = "6" ] # Change Tx Burst
		then
			if [ "$TxBurst" = "0" ]
			then
				echo "Are you sure? (Enable Tx Burst) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS TxBurst 1
					IWP TxBurst 1
				fi
			else
				echo "Are you sure? (Disable Tx Burst) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS TxBurst 0
					IWP TxBurst 0
				fi
			fi
		fi

		if [ "$NET_MODE" -gt 4 ] ## n modes
		then
			if [ "$MenuOpt" = 7 ]
			then
				if [ "$HT_OpMode" = "0" ]
				then
					echo "Are you sure? (Change Operating Mode to Green Field) [y/n] "
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS HT_OpMode 1
					fi
				else
					echo "Are you sure? (Change Operating Mode to Mixed Mode) [y/n] "
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS HT_OpMode 0
					fi
				fi
			elif [ "$MenuOpt" = 8 ]
			then
				if [ "$HT_BW" = "0" ]
				then
					echo "Are you sure? (Change Channel Bandwidth to 20/40 Mhz) [y/n] "
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS HT_BW 1
						IWP HtBw 1
						fi
				else
					echo "Are you sure? (Change Channel Bandwidth to 20 Mhz) [y/n] "
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS HT_BW 0
						IWP HtBw 0
					fi
				fi
			elif [ "$MenuOpt" = 9 ]
			then
				if [ "$HT_GI" = "0" ]
				then
					echo "Are you sure? (Change Guard Interval to Auto) [y/n] "
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS HT_GI 1
						IWP HtGi 1
					fi
				else
					echo "Are you sure? (Change Guard Interval to Long) [y/n] "
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS HT_GI 0
						IWP HtGi 0
					fi
				fi
			elif [ "$MenuOpt" = 10 ]
			then
				echo "Enter new MCS (0-23,32, or 33 (auto))"
				read NEW_MCS
				if ([ "$NEW_MCS" -gt 0 ] && [ "$NEW_MCS" -lt 24 ]) || [ "$NEW_MCS" = "32" ] || [ "$NEW_MCS" = "33" ] || [ "$NEW_MCS" = "0" ]
				then
					NVS HT_MCS $NEW_MCS
				fi
			fi
		else # abg modes
			if [ "$MenuOpt" = "7" ] # change rate for abg modes
			then
				echo " Select Desired Rate"
				echo " -----------------"
				echo "1) Auto"
				echo ""
				echo "2) 1 MBps      3) 2 MBps"
				echo ""
				echo "4) 5 MBps      5) 6 MBps"
				echo ""
				echo "6) 9 MBps      7) 11 MBps"
				echo ""
				echo "8) 12 MBps     9) 18 MBps"
				echo ""
				echo "10) 24 MBps    11) 36 MBps"
				echo ""
				echo "12) 48 MBps    13) 54 MBps"
				echo ""
				echo ""

				read NEW_RATE

#				NVS HT_MCS
#				FixedTxMode
				case $NEW_RATE in
					"1") NEW_HT_MCS=33;NEW_FixedTxMode=NONE;;
					"2") NEW_HT_MCS=0;NEW_FixedTxMode=CCK;;
					"3") NEW_HT_MCS=1;NEW_FixedTxMode=CCK;;
					"4") NEW_HT_MCS=2;NEW_FixedTxMode=CCK;;
					"5") NEW_HT_MCS=0;NEW_FixedTxMode=OFDM;;
					"6") NEW_HT_MCS=1;NEW_FixedTxMode=OFDM;;
					"7") NEW_HT_MCS=3;NEW_FixedTxMode=CCK;;
					"8") NEW_HT_MCS=2;NEW_FixedTxMode=OFDM;;
					"9") NEW_HT_MCS=3;NEW_FixedTxMode=OFDM;;
					"10") NEW_HT_MCS=4;NEW_FixedTxMode=OFDM;;
					"11") NEW_HT_MCS=5;NEW_FixedTxMode=OFDM;;
					"12") NEW_HT_MCS=6;NEW_FixedTxMode=OFDM;;
					"13") NEW_HT_MCS=7;NEW_FixedTxMode=OFDM;;
				esac

				NVS HT_MCS $NEW_HT_MCS
				NVS FixedTxMode $NEW_FixedTxMode

				if [ "$NEW_FixedTxMode" ="NONE" ]
				then
					IWP FixedTxMode 0
				elif [ "$NEW_FixedTxMode" ="CCK" ]
				then
					IWP FixedTxMode 1
				elif [ "$NEW_FixedTxMode" ="OFDM" ]
				then
					IWP FixedTxMode 2
				fi

				IWP HtMcs $NEW_HT_MCS
			fi
		fi
	done
}

#### QOS Settings #####
#########################

STA_Wireless_QOS_Settings_Menu()
{
	while [ 1 = 1 ]
	do
		Menu=2

		SpaceInfo=1
		LongInfoTable=0

		MenuName=" Wireless Settings (Station,$WIFNAME)-> QOS Settings "

		WMM_EN=$(NVG WmmCapable)
		APSD_EN=$(NVG APSDCapable)

		if [ "$WMM_EN" = "0" ] ## server disabled
		then
			MenuItemCtr=1
			MenuInfoCtr=1

			MenuItem1="1) Enable WMM Capabilities"
			MenuInfo1="WMM Capabilities: Disabled"
		else # server enabled
			MenuItemCtr=7
			MenuInfoCtr=7

			MenuInfo1="WMM Capabilities: Enabled"

			if [ "$APSD_EN" = "0" ] ## APSD disabled
			then
				MenuItem1="1) Enable WMM Power Saving"
				MenuInfo2="WMM Power Saving: Disabled"
			else
				MenuItem1="1) Disable WMM Power Saving"
				MenuInfo2="WMM Power Saving: Enabled"
			fi

			APSDAC=$(NVG APSDAC | sed 's/0/Disabled/g' | sed 's/1/Enabled/g' | sed 's/;/\n/g')

			AC_BE=$(echo "$APSDAC" | sed -n '1p')
			AC_BK=$(echo "$APSDAC" | sed -n '2p')
			AC_VI=$(echo "$APSDAC" | sed -n '3p')
			AC_VO=$(echo "$APSDAC" | sed -n '4p')

			DLS_EN=$(NVG DLSCapable)

			if [ "$AC_BE" = "Disabled" ]
			then
				MenuItem2="2) Enable AC_BE"
			else
				MenuItem2="2) Disable AC_BE"
			fi

			if [ "$AC_BK" = "Disabled" ]
			then
				MenuItem3="3) Enable AC_BK"
			else
				MenuItem3="3) Disable AC_BK"
			fi

			if [ "$AC_VI" = "Disabled" ]
			then
				MenuItem4="4) Enable AC_VI"
			else
				MenuItem4="4) Disable AC_VI"
			fi

			if [ "$AC_VO" = "Disabled" ]
			then
				MenuItem5="5) Enable AC_VO"
			else
				MenuItem5="5) Disable AC_VO"
			fi

			MenuInfo3="Power Save Mode AC_BE: $AC_BE"
			MenuInfo4="Power Save Mode AC_BK: $AC_BK"
			MenuInfo5="Power Save Mode AC_VI: $AC_VI"
			MenuInfo6="Power Save Mode AC_VO: $AC_VO"

			if [ "$DLS_EN" = "0" ] ## DLS disabled
			then
				MenuItem6="6) Enable DLS "
				MenuInfo7="DLS: Disabled"
			else
				MenuItem6="6) Disable DLS"
				MenuInfo7="DLS:Enabled"
			fi

			MenuItem7="7) Disable WMM Capabilities"
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

		if [ "$WMM_EN" = "0" ] ## server disabled
		then
			if [ "$MenuOpt" = "1" ]
			then
				echo "Are you sure (Enable WMM Capabilities) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS WmmCapable 1
					IWP WmmCapable 1
					fi
			fi
		else # server enabled
			if [ "$MenuOpt" = "1" ]
			then
				if [ "$APSD_EN" = "0" ]
				then
					echo "Are you sure (Enable WMM Power Saving) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS APSDCapable 1
					fi
				else
					echo "Are you sure (Disable WMM Power Saving) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS APSDCapable 0
					fi
				fi
			elif [ "$MenuOpt" = "2" ]
			then
				if [ "$AC_BE" = "Disabled" ]
				then
					echo "Are you sure (Enable AC_BE) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NEW_APSDAC=$(echo "Enabled;$AC_BK;$AC_VI;$AC_VO" | sed 's/Enabled/1/g' | sed 's/Disabled/0/g')
						NVS APSDAC $NEW_APSDAC
					fi
				else
					echo "Are you sure (Disable AC_BE) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NEW_APSDAC=$(echo "Disabled;$AC_BK;$AC_VI;$AC_VO" | sed 's/Enabled/1/g' | sed 's/Disabled/0/g')
						NVS APSDAC $NEW_APSDAC
					fi
				fi
			elif [ "$MenuOpt" = "3" ]
			then
				if [ "$AC_BK" = "Disabled" ]
				then
					echo "Are you sure (Enable AC_BK) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NEW_APSDAC=$(echo "$AC_BE;Enabled;$AC_VI;$AC_VO" | sed 's/Enabled/1/g' | sed 's/Disabled/0/g')
						NVS APSDAC $NEW_APSDAC
					fi
				else
					echo "Are you sure (Disable AC_BK) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NEW_APSDAC=$(echo "$AC_BE;Disabled;$AC_VI;$AC_VO" | sed 's/Enabled/1/g' | sed 's/Disabled/0/g')
						NVS APSDAC $NEW_APSDAC
					fi
				fi
			elif [ "$MenuOpt" = "4" ]
			then
				if [ "$AC_VI" = "Disabled" ]
				then
					echo "Are you sure (Enable AC_VI) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NEW_APSDAC=$(echo "$AC_BE;$AC_BK;Enabled;$AC_VO" | sed 's/Enabled/1/g' | sed 's/Disabled/0/g')
						NVS APSDAC $NEW_APSDAC
					fi
				else
					echo "Are you sure (Disable AC_VI) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NEW_APSDAC=$(echo "$AC_BE;$AC_BK;Disabled;$AC_VO" | sed 's/Enabled/1/g' | sed 's/Disabled/0/g')
						NVS APSDAC $NEW_APSDAC
					fi
				fi
			elif [ "$MenuOpt" = "5" ]
			then
				if [ "$AC_VO" = "Disabled" ]
				then
					echo "Are you sure (Enable AC_VO) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NEW_APSDAC=$(echo "$AC_BE;$AC_BK;$AC_VI;Enabled" | sed 's/Enabled/1/g' | sed 's/Disabled/0/g')
						NVS APSDAC $NEW_APSDAC
					fi
				else
					echo "Are you sure (Disable AC_VO) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NEW_APSDAC=$(echo "$AC_BE;$AC_BK;$AC_VI;Disabled" | sed 's/Enabled/1/g' | sed 's/Disabled/0/g')
						NVS APSDAC $NEW_APSDAC
					fi
				fi
			elif [ "$MenuOpt" = "6" ]
			then
				if [ "$DLS_EN" = "Disabled" ]
				then
					echo "Are you sure (Enable Direct Link Setup) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS DLSCapable 1
					fi
				else
					echo "Are you sure (Disable Direct Link Setup) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS DLSCapable 0
					fi
				fi
			elif [ "$MenuOpt" = "7" ]
			then
				echo "Are you sure (Disable WMM Capabilities) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS WmmCapable 0
					IWP WmmCapable 0
				fi
			fi
		fi
	done
}

#### 11n Settings #####
#########################

STA_Wireless_11n_Settings_Menu()
{
	while [ 1 = 1 ]
	do
		Menu=2

		SpaceInfo=1
		LongInfoTable=0

		MenuName=" Wireless Settings (Station,$WIFNAME) -> 11n Settings "
		MPDU_EN=$(NVG staPolicy)

		if [ "$MPDU_EN" = "0" ] ## MDPU Agg disabled
		then
			MenuItemCtr=1
			MenuInfoCtr=1

			MenuItem1="1) Enable MPDU Aggregation"
			MenuInfo1="MPDU Aggregation: Disabled"
		else # server enabled
			MenuItemCtr=4
			MenuInfoCtr=4

			HT_AutoBA=$(NVG HT_AutoBA)
			HT_MpduDensity=$(NVG HT_MpduDensity)
			HT_AMDSU=$(NVG HT_AMSDU)

			MenuInfo1="MPDU Aggregation: Enabled"

			if [ "$HT_AutoBA" = "0" ] ## Auto BlockAck Disabled
			then
				MenuItem1="1) Enable Automatic Block Ack"
				MenuInfo2="Automatic Block Ack: Disabled"
			else
				MenuItem1="1) Disable Automatic Block Ack"
				MenuInfo2="Automatic Block Ack: Enabled"
			fi

			MenuItem2="2) Change MPDU Density"
			MenuInfo3="MDPU Density: $HT_MpduDensity"

			if [ "$HT_AMSDU" = "0" ] ## AMSDU Enabled/Disabled
			then
				MenuItem3="3) Enable Aggregation MSDU"
				MenuInfo4="Aggregation MSDU: Disabled"
			else
				MenuItem3="3) Disable Aggregation MSDU"
				MenuInfo4="Aggregation MSDU: Enabled"
			fi

			MenuItem4="4) Disable MPDU Aggregation"
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

		if [ "$MPDU_EN" = "0" ] ## MPDU AGG Disabled
		then
			if [ "$MenuOpt" = "1" ]
			then
				echo "Are you sure (Enable MPDU Aggregation) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS staPolicy 1
				fi
			fi
		else
			if [ "$MenuOpt" = "1" ]
			then
				if [ "$HT_AutoBA" = "0" ]
				then
					echo "Are you sure (Enable Automatic Block Ack) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS HT_AutoBA 1
						IWP HtAutoBa 1
					fi
				else
					echo "Are you sure (Disable Automatic Block Ack) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS HT_AutoBA 0
						IWP HtAutoBa 0
					fi
				fi
			elif [ "$MenuOpt" = "2" ]
			then
				echo "Enter new MPDU Density (range 0-7)"
				read NEW_MPDU_D
				while (![ "$NEW_MPDU_D" -gt -1 ] && [ "$NEW_MPDU_D" -lt 8 ])
				do
					echo "Invalid input!"
					echo "Enter new MPDU Density (range 0-7)"
					read NEW_MPDU_D
				done

				NVS HT_MpduDensity $NEW_MPDU_D
				IWP HtMpduDensity $NEW_MPDU_D
			elif [ "$MenuOpt" = "3" ]
			then
				if [ "$HT_AMDSU" = "0" ]
				then
					echo "Are you sure (Enable Aggregation MSDU) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS HT_AMSDU 1
						IWP HtAmsdu 1
					fi
				else
					echo "Are you sure (Disable Aggregation MSDU) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS HT_AMSDU 0
						IWP HtAmsdu 0
					fi
				fi
			elif [ "$MenuOpt" = "4" ]
			then
				echo "Are you sure (Disable MDPU Aggregation) [y/n] ?"
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS staPolicy 0
				fi
			fi
		fi
	done
}

##### Station WPS Settings (Also APCLI WPS) ######

STA_Wireless_WPS_Settings_Menu()  
{
	while [ 1 = 1 ]
	do
		Menu=3
		MenuName=" Wireless Settings (Station,$WIFNAME)-> WiFi Protected Setup"
	
		SpaceInfo=1
		LongInfoTable=0

		MenuItemCtr=2

		MenuItem1="1) Start WPS PBC Mode"
		MenuItem2="2) Start WPS PIN Mode"

		MenuInfoCtr=2

		if [ "$WIRELESSIF" = "$PRI_WIF" ]
		then
			WPS_Status=$(iwpriv $WIRELESSIF show WPSStatus| sed 's/:/\n/g' | sed -n '2p')

		else
			WPS_Status=$(iwpriv $WIRELESSIF show WPSStatus| sed -n '3p' | sed 's/=/\n/g' | sed -n '2p' )
		fi

		WPS_StatusStr=$(WPSStatusString $WPS_Status)

		MenuInfo1="WPS Status: $WPS_StatusStr"

		if [ "$WIRELESSIF" = "$PRI_WIF" ] || [ "$WIRELESSIF" = "$SEC_WIF" ]
		then
			MenuInfo2=$(iwpriv $WIRELESSIF stat | grep PinCode | sed 's/ /\n/g' | grep PinCode )
		else	# APCLI
			MenuInfo2=$(iwpriv $WIRELESSIF stat | grep PinCode | sed -n '2p' | sed 's/      //g')
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
			# Refresh WPS Status
			if [ "$WIRELESSIF" = "$PRI_WIF" ]
			then
				WPS_Status=$(iwpriv $WIRELESSIF show WPSStatus| sed 's/:/\n/g' | sed -n '2p')
			else
				WPS_Status=$(iwpriv $WIRELESSIF show WPSStatus| sed -n '3p' | sed 's/=/\n/g' | sed -n '2p' )
			fi
	
			WPS_StatusStr=$(WPSStatusString $WPS_Status)
	
			MenuInfo1="WPS Status: $WPS_StatusStr"

			############

			ReadInput $LONG_REFRESH
			MenuOpt=$?
			if [ "$MenuOpt" = "0" ]
			then
				return
			fi
		done

		if [ "$MenuOpt" = "1" ]
		then
			echo "Start WPS in PBC Mode [y/n] ?"
			read YN

			if [ $YN = "Y" ] || [ $YN = "y" ]
			then
				
				if [ "$WIRELESSIF" = "$PRI_WIF" ] || [ "$WIRELESSIF" = "$SEC_WIF" ]
				then

					if [ "$PLATFORM" = "Target" ]
					then
						touch /sbin/wps_started
					fi
	
					$SUDOCMD iwpriv $WIRELESSIF set WirelessMode="$(nvram_get WirelessMode)"
					$SUDOCMD iwpriv $WIRELESSIF wsc_cred_count 0
					$SUDOCMD iwpriv $WIRELESSIF wsc_conf_mode 1
					$SUDOCMD iwpriv $WIRELESSIF wsc_mode 2
					$SUDOCMD iwpriv $WIRELESSIF wsc_start
				else #APCLI
					IWP WscConfMode 1
					IWP WscMode 2 #PBC
					IWP WscGetConf 1
				fi
			fi

		elif [ "$MenuOpt" = "2" ]
		then
			echo "Start WPS in PIN Mode [y/n] ?"
			read YN

			if [ $YN = "Y" ] || [ $YN = "y" ]
			then
				if [ "$WIRELESSIF" = "$PRI_WIF" ] || [ "$WIRELESSIF" = "$SEC_WIF" ]
				then
					if [ "$WIRELESSIF" != "$PRI_WIF" ] # Not needed in 5.ghz
					then
						echo "Enter Access Point's SSID"
						read APSSID
					fi
	
					if [ "$PLATFORM" = "Target" ]
					then
						touch /sbin/wps_started
					fi

					$SUDOCMD iwpriv $WIRELESSIF set WirelessMode="$(nvram_get WirelessMode)"
					$SUDOCMD iwpriv $WIRELESSIF wsc_cred_count 0
					$SUDOCMD iwpriv $WIRELESSIF wsc_conf_mode 1
					$SUDOCMD iwpriv $WIRELESSIF wsc_mode 1
					$SUDOCMD iwpriv $WIRELESSIF wsc_ap_band 0 ## Really Needed only in 2.4ghz
					$SUDOCMD iwpriv $WIRELESSIF wsc_ssid $APSSID ## Really Needed only in 2.4ghz
					$SUDOCMD iwpriv $WIRELESSIF wsc_start
				else #APCLI
					IWP WscConfMode 1
					IWP WscMode 1 #PIN
					IWP WscGetConf 1
				fi
			fi
		fi
	done
}

