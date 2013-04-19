#!/bin/sh

#### Basic Settings #####
#########################

AP_Wireless_Basic_Settings_Menu()
{
	while [ 1 = 1 ]
	do
		Menu=2

		SpaceInfo=1
		LongInfoTable=0

		MenuName=" Wireless Settings (AP,$WIFNAME) -> Basic "

		RADIO_D=$(NVG RadioOff)
		NET_MODE=$(NVG WirelessMode)
		SSID=$(NVG SSID1)
		HIDDEN_SSID=$(NVG HideSSID)
		ISOLATED_SSID=$(NVG NoForwarding)

		BSSID=$(iwconfig $WIRELESSIF | sed 's/ /\n/g'| sed -n "/^\([0-9A-Z][0-9A-Z]:\)\{5\}[0-9A-Z][0-9A-Z]$/p")

		CHANNEL=$(NVG Channel)
		HT_MCS=$(NVG HT_MCS)
		MODULATION=$(NVG FixedTxMode)
		HT_RXSTREAM=$(NVG HT_RxStream)
		HT_TXSTREAM=$(NVG HT_TxStream)

		if [ "$RADIO_D" = "1" ]
		then
			MenuItem1="1) Enable Radio"
			MenuInfo1="Radio: Disabled"
		else
			MenuItem1="1) Disable Radio"
			MenuInfo1="Radio: Enabled"
		fi

		MenuItem2="2) Change Network Mode"

		NET_STR="Network Mode: 802.11"

		case $NET_MODE in
			"0") MenuInfo2="$NET_STR b/g mixed mode";;
			"1") MenuInfo2="$NET_STR b only";;
			"2") MenuInfo2="$NET_STR a only";;
			"4") MenuInfo2="$NET_STR g only";;
			"6") MenuInfo2="$NET_STR n only (2.4 Ghz)";;
			"8") MenuInfo2="$NET_STR a/n mixed mode ";;
			"9") MenuInfo2="$NET_STR b/g/n mixed mode ";;
			"11") MenuInfo2="$NET_STR n only (5 Ghz) ";;
		esac

		MenuItem3="3) Change SSID"

		if [ "$HIDDEN_SSID" = "1" ] && [ "$ISOLATED_SSID" = "1" ]
		then
			MenuInfo3="SSID: $SSID (Hidden,Isolated)"
		elif [ "$HIDDEN_SSID" = "1" ] && [ "$ISOLATED_SSID" != "1" ]
		then
			MenuInfo3="SSID: $SSID (Hidden)"
		elif [ "$HIDDEN_SSID" != "1" ] && [ "$ISOLATED_SSID" = "1" ]
		then
			MenuInfo3="SSID: $SSID (Isolated)"
		elif [ "$HIDDEN_SSID" != "1" ] && [ "$ISOLATED_SSID" != "1" ]
		then
			MenuInfo3="SSID: $SSID"
		fi

		MenuInfo4="BSSID: $BSSID"

		MenuItem4="4) Change Channel Mode"

		case $CHANNEL in
			## 2.4G
			"1") FR="2412";;
			"2") FR="2417";;
			"3") FR="2422";;
			"4") FR="2427";;
			"5") FR="2432";;
			"6") FR="2437";;
			"7") FR="2442";;
			"8") FR="2447";;
			"9") FR="2452";;
			"10") FR="2457";;
			"11") FR="2462";;
			"12") FR="2467";;
			"13") FR="2472";;
			"14") FR="2482";;

			# 5G
			"36") FR="5180";;
			"40") FR="5200";;
			"44") FR="5220";;
			"48") FR="5240";;
			"52") FR="5260";;
			"56") FR="5280";;
			"60") FR="5300";;
			"64") FR="5320";;
			"100") FR="5500";;
			"104") FR="5520";;
			"108") FR="5540";;
			"112") FR="5560";;
			"116") FR="5580";;
			"120") FR="5600";;
			"124") FR="5620";;
			"128") FR="5640";;
			"132") FR="5640";;
			"136") FR="5640";;
			"149") FR="5745";;
			"153") FR="5765";;
			"157") FR="5785";;
			"161") FR="5805";;
		esac

		MenuInfo5="Channel Mode: Channel $CHANNEL ( $FR Mhz)"

		if [ "$CHANNEL" = "0" ]
		then
			MenuInfo5="Channel Mode: Channel Autoselect"
		fi

		if [ "$NET_MODE" -lt 5 ] # /abg modes
		then
			MenuItemCtr=7
			MenuInfoCtr=8

			case $HT_MCS in
				"0") if [ "$MODULATION" = "CCK" ]; then MenuInfo6="Rate: 1 MBps"; else MenuInfo6="Rate: 6 MBps"; fi ;;
				"1") if [ "$MODULATION" = "CCK" ]; then MenuInfo6="Rate: 2 MBps"; else MenuInfo6="Rate: 9 MBps";fi ;;
				"2") if [ "$MODULATION" = "CCK" ]; then MenuInfo6="Rate: 5 MBps"; else MenuInfo6="Rate: 12 MBps";fi ;;
				"3") if [ "$MODULATION" = "CCK" ]; then MenuInfo6="Rate: 11 MBps"; else MenuInfo6="Rate: 18 MBps";fi ;;
				"4") MenuInfo6="Rate: 24 MBps";;
				"5") MenuInfo6="Rate: 36 MBps";;
				"6") MenuInfo6="Rate: 48 MBps";;
				"7") MenuInfo6="Rate: 54 MBps";;
				"33") MenuInfo6="Rate: Auto";;
			esac

			MenuItem5="5) Change Rate"
			MenuItem6="6) Change HT Tx Stream"
			MenuItem7="7) Change HT Rx Stream"

			MenuInfo7="HT Tx Stream: $HT_TXSTREAM"
			MenuInfo8="HT Rx Stream: $HT_RXSTREAM"
		else ## n modes
			MenuItem5="5) Change HT Tx Stream"
			MenuItem6="6) Change HT Rx Stream"
			MenuItem7="7) HT Physical Mode Options"

			MenuInfo6="HT Tx Stream: $HT_TXSTREAM"
			MenuInfo7="HT Rx Stream: $HT_RXSTREAM"

			MenuItemCtr=7
			MenuInfoCtr=7
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
		elif [ "$MenuOpt" = "3" ] # Change SSID
		then
			echo "Are you sure? (Change SSID) [y/n] "
			read YN

			if [ $YN = "Y" ] || [ $YN = "y" ]
			then
				echo "Enter new SSID "
				read NEW_SSID

				echo "Broadcast network name? (Disable Hidden mode) [y/n]"
				read YN1

				echo "AP Isolation? (Enable Isolated Mode) [y/n]"
				read YN2

				if [ $YN1 = "Y" ] || [ $YN1 = "y" ]
				then
					YN1="0"
				else
					YN1="1"
				fi

				if [ $YN2 = "Y" ] || [ $YN2 = "y" ]
				then
					YN2="1"
				else
					YN2="0"
				fi

				NVS SSID1 $NEW_SSID
				NVS HideSSID $YN1
				NVS NoForwarding $YN2

				IWP HideSSID $YN1
				IWP NoForwarding $YN2
			fi
		elif [ "$MenuOpt" = "4" ] # change channel
		then
			if [ "$NET_MODE" = "2" ] || [ "$NET_MODE" = "8" ] || [ "$NET_MODE" = "11" ]
			then
				echo "Change Channel Mode (5 Ghz: Channels: 36-64,  100-136 , 149-161 (leaps of 4)) or 0 (auto)"
				read NEW_CHANNEL
				valid=0
				case $NEW_CHANNEL in
					"0") valid=1;;
					"36") valid=1;; "40") valid=1;; "44") valid=1;; "48") valid=1;; "52") valid=1;; "56") valid=1;;
					"60") valid=1;; "64") valid=1;;
					"100") valid=1;; "104") valid=1;; "108") valid=1;; "112") valid=1;; "116") valid=1;; "120") valid=1;;
					"124") valid=1;; "128") valid=1;; "132") valid=1;; "136") valid=1;;
					"149") valid=1;; "153") valid=1;; "157") valid=1;; "161") valid=1;;
				esac

				if [ "$valid" = "1" ]
				then
					NVS Channel $NEW_CHANNEL
					IWP Channel $NEW_CHANNEL
				fi
			else
				echo "Change Channel Mode (2.4 Ghz: Channels 1-14 or 0 (auto) )"
				read NEW_CHANNEL
				if ([ "$NEW_CHANNEL" -gt 0 ] && [ "$NEW_CHANNEL" -lt 15 ]) || [ "$NEW_CHANNEL" = "0" ]
				then
					NVS Channel $NEW_CHANNEL
					IWP Channel $NEW_CHANNEL
				fi
			fi
		fi

		if [ "$NET_MODE" -lt 5 ] # abg modes
		then
			if [ "$MenuOpt" = "5" ] # change rate for abg modes
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

				read SELECTION

				NEW_HT_MCS=-1
				NEW_FixedTxMode=-1

				case $SELECTION in
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

				if [ "$NEW_HT_MCS" != "-1" ] && [ "$NEW_FixedTxMode" != "-1" ]
				then
					NVS HT_MCS $NEW_HT_MCS
					NVS FixedTxMode $NEW_FixedTxMode

					if [ "$NEW_FixedTxMode" = "NONE" ]
					then
						IWP FixedTxMode 0
					elif [ "$NEW_FixedTxMode" = "CCK" ]
					then
						IWP FixedTxMode 1
					elif [ "$NEW_FixedTxMode" = "OFDM" ]
					then
						IWP FixedTxMode 2
					fi

					IWP HtMcs $NEW_HT_MCS
				fi
			elif [ "$MenuOpt" = "6" ]
			then
				echo "Enter new HT Tx Stream (1,2 or 3 )"
				read NEW_HT_TXSTREAM
				if [ "$NEW_HT_TXSTREAM" = "1" ] || [ "$NEW_HT_TXSTREAM" = "2" ] || [ "$NEW_HT_TXSTREAM" = "3" ]
				then
					NVS HT_TxStream $NEW_HT_TXSTREAM
					IWP HtTxStream $NEW_HT_TXSTREAM
				fi
			elif [ "$MenuOpt" = "7" ]
			then
				echo "Enter new HT Rx Stream (1,2 or 3 )"
				read NEW_HT_RXSTREAM
				if [ "$NEW_HT_RXSTREAM" = "1" ] || [ "$NEW_HT_RXSTREAM" = "2" ] || [ "$NEW_HT_RXSTREAM" = "3" ]
				then
					NVS HT_RxStream $NEW_HT_RXSTREAM
					IWP HtRxStream $NEW_HT_RXSTREAM
				fi
			fi
		else # n modes
				if [ "$MenuOpt" = "5" ]
				then
				echo "Enter new HT Tx Stream (1,2 or 3 )"
				read NEW_HT_TXSTREAM
				if [ "$NEW_HT_TXSTREAM" = "1" ] || [ "$NEW_HT_TXSTREAM" = "2" ] || [ "$NEW_HT_TXSTREAM" = "3" ]
				then
					NVS HT_TxStream $NEW_HT_TXSTREAM
					IWP HtTxStream $NEW_HT_TXSTREAM
				fi
			elif [ "$MenuOpt" = "6" ]
			then
				echo "Enter new HT Rx Stream (1,2 or 3 )"
				read NEW_HT_RXSTREAM
				if [ "$NEW_HT_RXSTREAM" = "1" ] || [ "$NEW_HT_RXSTREAM" = "2" ] || [ "$NEW_HT_RXSTREAM" = "3" ]
				then
					NVS HT_RxStream $NEW_HT_RXSTREAM
					IWP HtRxStream $NEW_HT_RXSTREAM
				fi
			elif [ "$MenuOpt" = "7" ]
			then
				AP_Wireless_Basic_HT_PhyMode_Settings_Menu
			fi
		fi
	done
}

AP_Wireless_Basic_HT_PhyMode_Settings_Menu ()
{
	while [ 1 = 1 ]
	do
		Menu=2

		SpaceInfo=0
		LongInfoTable=0
		MenuName=" Wireless Settings (AP,$WIFNAME) -> Basic -> HT Physical Mode"

		HT_OpMode=$(NVG HT_OpMode)
		HT_BW=$(NVG HT_BW)
		HT_GI=$(NVG HT_GI)
		HT_MCS=$(NVG HT_MCS)
		HT_RDG=$(NVG HT_RDG)
		HT_STBC=$(NVG HT_STBC)
		HT_AMDSU=$(NVG HT_AMSDU)
		HT_AutoBA=$(NVG HT_AutoBA)
		HT_BADecline=$(NVG HT_BADecline)
		HT_DisallowTKIP=$(NVG HT_DisallowTKIP)

		if [ "$HT_OpMode" = "0" ]
		then
			MenuItem1="1) Change Operating Mode (to Green Field)"
			MenuInfo1="Operating Mode: Mixed Mode"
		else
			MenuItem1="1) Change Operating Mode (to Mixed Mode)"
			MenuInfo1="Operating Mode: Green Field"
		fi

		if [ "$HT_BW" = "0" ]
		then
			MenuItem2="2) Change Channel Bandwidth (to 20/40 Mhz)"
			MenuInfo2="Channel Bandwidth: 20 Mhz"
		else
			MenuItem2="2) Change Channel Bandwidth (to 20 Mhz)"
			MenuInfo2="Channel Bandwidth: 20/40 Mhz"
		fi

		if [ "$HT_GI" = "0" ]
		then
			MenuItem3="3) Change Guard Interval (to Auto)"
			MenuInfo3="Guard Interval: Long"
		else
			MenuItem3="3) Change Guard Interval (to Long)"
			MenuInfo3="Guard Interval: Auto"
		fi

		MenuItem4="4) Change MCS"
		if [ "$HT_MCS" != "33" ]
		then
			MenuInfo4="MCS: $HT_MCS"
		else
			MenuInfo4="MCS: Auto"
		fi

		if [ "$HT_RDG" = "0" ]
		then
			MenuItem5="5) Enable Reverse Direction Grant (RDG)"
			MenuInfo5="Reverse Direction Grant: Disabled"
		else
			MenuItem5="5) Disable Reverse Direction Grant (RDG)"
			MenuInfo5="Reverse Direction Grant: Enabled"
		fi

		if [ "$HT_STBC" = "0" ]
		then
			MenuItem6="6) Enable Space Time Block Coding (STBC)"
			MenuInfo6="Space Time Block Coding: Disabled"
		else
			MenuItem6="6) Disable Space Time Block Coding (STBC)"
			MenuInfo6="Space Time Block Coding: Enabled"
		fi

		if [ "$HT_AMSDU" = "0" ]
		then
			MenuItem7="7) Enable Aggregation MSDU (A-MSDU)"
			MenuInfo7="Aggregation MSDU: Disabled"
		else
			MenuItem7="7) Disable Aggregation MSDU (A-MSDU)"
			MenuInfo7="Aggregation MSDU: Enabled"
		fi

		if [ "$HT_AutoBA" = "0" ]
		then
			MenuItem8="8) Enable Automatic Block Ack"
			MenuInfo8="Automatic Block Ack: Disabled"
		else
			MenuItem8="8) Disable Automatic Block Ack"
			MenuInfo8="Automatic Block Ack: Enabled"
		fi

		if [ "$HT_BADecline" = "0" ]
		then
			MenuItem9="9) Enable Block Ack Decline"
			MenuInfo9="Block Ack Decline: Disabled"
		else
			MenuItem9="9) Disable Block Ack Decline"
			MenuInfo9="Block Ack Decline: Enabled"
		fi

		if [ "$HT_DisallowTKIP" = "0" ]
		then
			MenuItem10="10) Enable Disallow TKIP"
			MenuInfo10="Disallow TKIP: Disabled"
		else
			MenuItem10="10) Disable Disallow TKIP"
			MenuInfo10="Disallow TKIP: Enabled"
		fi

		MenuItemCtr=10
		MenuInfoCtr=10

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

		if [ "$MenuOpt" = "1" ] # Change Operating Mode (Green Field/Mixed Mode)
		then
			if [ "$HT_OpMode" = "0" ]
			then
				echo "Are you sure? (Change Operating Mode to Green Field) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS HT_OpMode 1
					IWP HtOpMode 1
				fi
			else
				echo "Are you sure? (Change Operating Mode to Mixed Mode) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS HT_OpMode 0
					IWP HtOpMode 0
				fi
			fi
		elif [ "$MenuOpt" = "2" ] # Change Channel Bandwidth
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
		elif [ "$MenuOpt" = "3" ] # Change Guard Interval
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
		elif [ "$MenuOpt" = "4" ] # Change MCS
		then
			echo "Enter new MCS (0-23,32, or 33 (auto))"
			read NEW_MCS
			if ([ "$NEW_MCS" -gt 0 ] && [ "$NEW_MCS" -lt 24 ]) || [ "$NEW_MCS" = "32" ] || [ "$NEW_MCS" = "33" ] || [ "$NEW_MCS" = "0" ]
			then
				NVS HT_MCS $NEW_MCS
				IWP HtMcs $NEW_MCS
			fi
		elif [ "$MenuOpt" = "5" ] # Change RDG
		then
			if [ "$HT_RDG" = "0" ]
			then
				echo "Are you sure? (Enable Reverse Direction Grant) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS HT_RDG 1
					IWP HtRdg 1
				fi
			else
				echo "Are you sure? (Disable Reverse Direction Grant) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS HT_RDG 0
					IWP HtRdg 0
				fi
			fi
		elif [ "$MenuOpt" = "6" ] # Change STBC
		then
			if [ "$HT_STBC" = "0" ]
			then
				echo "Are you sure? (Enable Space Time Block Coding) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS HT_STBC 1
					IWP HtStbc 1
				fi
			else
				echo "Are you sure? (Disable Space Time Block Coding) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS HT_STBC 0
					IWP HtStbc 0
				fi
			fi
		elif [ "$MenuOpt" = "7" ] # Change AMSDU
		then
			if [ "$HT_AMSDU" = "0" ]
			then
				echo "Are you sure? (Enable Aggregation MSDU) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS HT_AMSDU 1
					IWP HtAmsdu 1
				fi
			else
				echo "Are you sure? (Disable Aggregation MSDU) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS HT_AMSDU 0
					IWP HtAmsdu 0
				fi
			fi
		elif [ "$MenuOpt" = "8" ] # Change Auto Block Ack
		then
			if [ "$HT_AutoBA" = "0" ]
			then
				echo "Are you sure? (Enable Auto Block Ack) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS HT_AutoBA 1
					IWP HtAutoBa 1
				fi
			else
				echo "Are you sure? (Disable Auto Block Ack) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS HT_AutoBA 0
					IWP HtAutoBa 0
				fi
			fi
		elif [ "$MenuOpt" = "9" ] # Change Block Ack Decline
		then
			if [ "$HT_BADecline" = "0" ]
			then
				echo "Are you sure? (Enable Block Ack Decline) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS HT_BADecline 1
					IWP BADecline 1
				fi
			else
				echo "Are you sure? (Disable Block Ack Decline) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS HT_BADecline 0
					IWP BADecline 0
				fi
			fi
		elif [ "$MenuOpt" = "10" ] # Change Disallow TKIP
		then
			if [ "$HT_DisallowTKIP" = "0" ]
			then
				echo "Are you sure? (Enable Disallow TKIP) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS HT_DisaTXllowTKIP 1
				fi
			else
				echo "Are you sure? (Disable Disallow TKIP) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS HT_DisallowTKIP 0
				fi
			fi
		fi
	done
}

AP_Wireless_Statistics()
{
	while [ 1 = 1 ]
	do
		Menu=1
		MenuName=" Wireless Statistics(AP,$WIFNAME):"

		SpaceInfo=1
		LongInfoTable=0
		MenuInfoCtr=7
		RX_BPS=$(iwpriv $WIRELESSIF show Rx_bps | sed -n '2p')
		MenuInfo1="Rx Bits/Sec: $RX_BPS"

		TX_BPS=$(iwpriv $WIRELESSIF show Tx_bps | sed -n '2p')
		MenuInfo2="Tx Bits/Sec: $TX_BPS"

		PACKET_STAT=$(iwpriv $WIRELESSIF show stat | grep 'Packets' )
		MenuInfo3=""

		MenuInfo4=$(echo $PACKET_STAT | sed 's/Packets/\nPackets/g' | sed -n '2p')
		MenuInfo5=$(echo $PACKET_STAT | sed 's/Packets/\nPackets/g'| sed 's/Error/\nError/g' | sed -n '3p')
		MenuInfo6=$(echo $PACKET_STAT | sed 's/Drop/\nDrop/g' | sed -n '2p')
		MenuInfo7=$(echo $PACKET_STAT | sed 's/Error/\nError/g' | sed 's/Drop/\nDrop/g' | sed -n '2p')

		MenuItemCtr=0

		Refresh=0

		ReadInput $SHORT_REFRESH
		MenuOpt=$?

		if [ "$MenuOpt" = "0" ]
		then
			return
		fi

		while [ $MenuOpt -lt 1 ] || [ $MenuOpt -gt $MenuItemCtr ]
		do
			RX_BPS=$(iwpriv $WIRELESSIF show Rx_bps | sed -n '2p')
			MenuInfo1="Rx Bits/Sec: $RX_BPS"

			TX_BPS=$(iwpriv $WIRELESSIF show Tx_bps | sed -n '2p')
			MenuInfo2="Tx Bits/Sec: $TX_BPS"

			PACKET_STAT=$(iwpriv $WIRELESSIF show stat | grep 'Packets' )
			MenuInfo4=$(echo $PACKET_STAT | sed 's/Packets/\nPackets/g' | sed -n '2p')
			MenuInfo5=$(echo $PACKET_STAT | sed 's/Packets/\nPackets/g' | sed 's/Error/\nError/g' | sed -n '3p')
			MenuInfo6=$(echo $PACKET_STAT | sed 's/Drop/\nDrop/g' | sed -n '2p')
			MenuInfo7=$(echo $PACKET_STAT | sed 's/Error/\nError/g' | sed 's/Drop/\nDrop/g' | sed -n '2p')

			ReadInput $SHORT_REFRESH
			MenuOpt=$?
			if [ "$MenuOpt" = "0" ]
			then
				return
			fi
		done
	done
}

################ AP Operations Menu (WPS,Station List, Statistics) #####
AP_OperationsMenu()
{
	while [ 1 = 1 ]
	do
		Menu=2

		SpaceInfo=1
		LongInfoTable=0

		MenuName=" Wireless Settings -> AP Operations (AP, $WIFNAME) "
		MenuItemCtr=3

		MenuItem1="1) WiFi Protected Setup (WPS)"
		MenuItem2="2) Station List"
		MenuItem3="3) Statistics"

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
		if [ "$MenuOpt" = "1" ] # WPS
		then 
			if [ "$COMPRESSED_MODE" = "1" ]
			then
				$SUDOCMD rm -f $(pwd)/inic_cmdr_ap_wireless.sh
				$SUDOCMD tar -zxvf inic_cmdr.tar.gz inic_cmdr_ap_wireless_misc.sh
			fi

			. $(pwd)/inic_cmdr_ap_wireless_misc.sh

	 		AP_Wireless_WPS_Settings_Menu

			if [ "$COMPRESSED_MODE" = "1" ]
			then
				$SUDOCMD rm -f $(pwd)/inic_cmdr_ap_wireless_misc.sh
			fi
			
		elif [ "$MenuOpt" = "2" ] # Station List
		then
			StationListMenu
		elif [ "$MenuOpt" = "3" ] # Statistics
		then
			AP_Wireless_Statistics
		fi
	done
}


################ APCLI Operations Menu (WPS,Station List, Statistics) #####

APCLI_OperationsMenu()
{
	while [ 1 = 1 ]
	do
		Menu=2

		SpaceInfo=1
		LongInfoTable=0

		MenuName=" Wireless Settings -> APCli Operations ($WIFNAME) "
		MenuItemCtr=3

		MenuItem1="1) WiFi Protected Setup (WPS)"
		MenuItem2="2) Site Survery"
		MenuItem3="3) Statistics"

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
		if [ "$MenuOpt" = "1" ] # WPS
		then 
			if [ "$COMPRESSED_MODE" = "1" ]
			then

				$SUDOCMD rm -f $(pwd)/inic_cmdr_main.sh
				$SUDOCMD tar -zxvf inic_cmdr.tar.gz inic_cmdr_sta_wireless.sh

			fi

			. $(pwd)/inic_cmdr_sta_wireless.sh

			STA_Wireless_WPS_Settings_Menu

			if [ "$COMPRESSED_MODE" = "1" ]
			then
				$SUDOCMD rm -f $(pwd)/inic_cmdr_sta_wireless.sh
			fi
			
		elif [ "$MenuOpt" = "2" ] # Site Survey
		then
			SiteSurveyMenu
		elif [ "$MenuOpt" = "3" ] # Statistics
		then
			AP_Wireless_Statistics
		fi
	done
}





################ AP Wireless Settings ###################

AP_WirelessSettingsMenu()
{
	while [ 1 = 1 ]
	do
		Menu=2

		SpaceInfo=1
		LongInfoTable=0

		MenuName=" Wireless Settings (AP, $WIFNAME) "
		MenuItemCtr=6

		MenuItem1="1) Basic Settings"
		MenuItem2="2) Advanced Settings"
		MenuItem3="3) Security Settings"

		if [ "$WIRELESSIF" = "$PRI_WIF" ]
		then
			EN_APCLI=$EN_APCLI_5
			EN_WDS=$EN_WDS_5
		fi

		if [ "$WIRELESSIF" = "$SEC_WIF" ]
		then
			EN_APCLI=$EN_APCLI_2_4
			EN_WDS=$EN_WDS_2_4
		fi

		if [ "$EN_WDS" = "1" ]
		then
			MenuItem4="4) WDS Settings"
		else
			MenuItem4="4) WDS Settings (*Feature N/A*)"
		fi

		MenuItem5="5) AP Operations (WPS,Station List,Statistics)"
		
		if [ "$EN_APCLI" = "1" ]
		then
			MenuItem6="6) Station (APCli) Operations (WPS,Site Survery,Statistics)"
		else
			MenuItem6="6) Station (APCli) Operations (*Feature N/A*)"
		fi

		MenuItem7="7) Station List"
		MenuItem8="8) Statistics"

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
			AP_Wireless_Basic_Settings_Menu
		elif [ "$MenuOpt" = "2" ]
		then
			if [ "$COMPRESSED_MODE" = "1" ]
			then
				$SUDOCMD rm -f $(pwd)/inic_cmdr_ap_wireless.sh
				$SUDOCMD tar -zxvf inic_cmdr.tar.gz inic_cmdr_ap_wireless_advanced.sh
			fi

			. $(pwd)/inic_cmdr_ap_wireless_advanced.sh

			AP_Wireless_Advanced_Settings_Menu

			if [ "$COMPRESSED_MODE" = "1" ]
			then
				$SUDOCMD rm -f $(pwd)/inic_cmdr_ap_wireless_advanced.sh
			fi
		elif [ "$MenuOpt" = "3" ]
		then
			if [ "$COMPRESSED_MODE" = "1" ]
			then
				$SUDOCMD rm -f $(pwd)/inic_cmdr_ap_wireless.sh
				$SUDOCMD tar -zxvf inic_cmdr.tar.gz inic_cmdr_ap_wireless_misc.sh
			fi

			. $(pwd)/inic_cmdr_ap_wireless_misc.sh

			AP_Wireless_Security_Settings_Menu

			if [ "$COMPRESSED_MODE" = "1" ]
			then
				$SUDOCMD rm -f $(pwd)/inic_cmdr_ap_wireless_misc.sh
			fi
		elif [ "$MenuOpt" = "4" ] && [ "$EN_WDS" = "1" ] # WDS
		then
			if [ "$COMPRESSED_MODE" = "1" ]
			then
				$SUDOCMD rm -f $(pwd)/inic_cmdr_ap_wireless.sh
				$SUDOCMD tar -zxvf inic_cmdr.tar.gz inic_cmdr_ap_wireless_misc.sh
			fi

	 		. $(pwd)/inic_cmdr_ap_wireless_misc.sh

			AP_Wireless_WDS_Settings_Menu

			if [ "$COMPRESSED_MODE" = "1" ]
			then
				$SUDOCMD rm -f $(pwd)/inic_cmdr_ap_wireless_misc.sh
			fi
		elif [ "$MenuOpt" = "5" ]
		then
			AP_OperationsMenu
		elif [ "$MenuOpt" = "6" ] && [ "$EN_APCLI" = "1" ] # APCLI
		then

			O_WIRELESSIF=$WIRELESSIF

			if [ "$WIRELESSIF" = "$PRI_WIF" ]
			then
				WIRELESSIF="$PRI_APCLI_WIF"
			elif [ "$WIRELESSIF" = "$SEC_WIF" ]
			then
				WIRELESSIF="$SEC_APCLI_WIF"
			fi

			$SUDOCMD ifconfig $WIRELESSIF up

			APCLI_OperationsMenu

			WIRELESSIF=$O_WIRELESSIF

		fi
	done
}

