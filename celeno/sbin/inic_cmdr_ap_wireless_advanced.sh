#!/bin/sh

## Wireless - Advanced Settings ##
##################################

AP_Wireless_Advanced_Settings_Menu ()
{
	while [ 1 = 1 ]
	do
		Menu=2

		SpaceInfo=0
		LongInfoTable=0
		MenuName=" Wireless Settings (AP,$WIFNAME) -> Advanced"

		BGProtection=$(NVG BGProtection)
		BeaconPeriod=$(NVG BeaconPeriod)
		DtimPeriod=$(NVG DtimPeriod)
		FragThreshold=$(NVG FragThreshold)
		RTSThreshold=$(NVG RTSThreshold)
		TxPower=$(NVG TxPower)
		TxPreamble=$(NVG TxPreamble)
		ShortSlot=$(NVG ShortSlot)
		TxBurst=$(NVG TxBurst)
		PktAggregate=$(NVG PktAggregate)
		IEEE80211H=$(NVG IEEE80211H)
		CountryCode=$(NVG CountryCode)

		MenuItemCtr=14
		MenuInfoCtr=12

		MenuItem1="1) Change BG Protection Mode"
		if [ "$BGProtection" = "0" ]
		then
			MenuInfo1="BG Protection Mode: Auto"
		elif [ "$BGProtection" = "1" ]
		then
			MenuInfo1="BG Protection Mode: On"
		elif [ "$BGProtection" = "2" ]
		then
			MenuInfo1="BG Protection Mode: Off"
		fi

		MenuItem2="2) Change Beacon Period"
		MenuInfo2="Beacon Period: $BeaconPeriod ms"

		MenuItem3="3) Change Data Beacon Rate (DTIM)"
		MenuInfo3="Data Beacon Rate: $DtimPeriod ms"

		MenuItem4="4) Change Fragmentation Threshold"
		MenuInfo4="Fragmentation Threshold: $FragThreshold"

		MenuItem5="5) Change RTS Threshold"
		MenuInfo5="RTS Threshold: $RTSThreshold"

		MenuItem6="6) Change Tx Power"
		MenuInfo6="Tx Power: $TxPower"

		if [ "$TxPreamble" = "0" ] ## Tx Preamble
		then
			MenuItem7="7) Enable Short Preamble"
			MenuInfo7="Short Preamble: Disabled"
		else
			MenuItem7="7) Disable Short Preamble"
			MenuInfo7="Short Preamble: Enabled"
		fi

		if [ "$ShortSlot" = "0" ] ## Short Slot
		then
			MenuItem8="8) Enable Short Slot"
			MenuInfo8="Short Slot: Disabled"
		else
			MenuItem8="8) Disable Short Slot"
			MenuInfo8="Short Slot: Enabled"
		fi

		if [ "$TxBurst" = "0" ] ## Tx Burst
		then
			MenuItem9="9) Enable Tx Burst"
			MenuInfo9="Tx Burst: Disabled"
		else
			MenuItem9="9) Disable Tx Burst"
			MenuInfo9="Tx Burst: Enabled"
		fi

		if [ "$PktAggregate" = "0" ] ## Packet Aggregate
		then
			MenuItem10="10) Enable Packet Aggregate"
			MenuInfo10="Packet Aggregate: Disabled"
		else
			MenuItem10="10) Disable Packet Aggregate"
			MenuInfo10="Packet Aggregate: Enabled"
		fi

		if [ "$IEEE80211H" = "0" ] ## 802.11H
		then
			MenuItem11="11) Enable IEEE 802.11 H Support"
			MenuInfo11="IEEE 802.11 H Support: Disabled"
		else
			MenuItem11="11) Disable IEEE 802.11 H Support"
			MenuInfo11="IEEE 802.11 H Support: Enabled"
		fi

		MenuItem12="12) Change Country Code"

		case "$CountryCode" in
			"NA") MenuInfo12="Country Code: None";;
			"US") MenuInfo12="Country Code: United States (US)";;
			"JP") MenuInfo12="Country Code: Japan (JP)";;
			"FR") MenuInfo12="Country Code: France (FR)";;
			"TW") MenuInfo12="Country Code: Taiwan (TW)";;
			"IE") MenuInfo12="Country Code: Ireland (IE)";;
			"HK") MenuInfo12="Country Code: Hong Kong (HK)";;
		esac

		MenuItem13="13) WiFi Multimedia (WMM) Settings"
		MenuItem14="14) Misc Settings"

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

		if [ "$MenuOpt" = "1" ] # Change BG Protection Mode)
		then
			echo "Enter new BG Protection Mode value (0 - Auto , 1 - On , 2 - Off) "
			read NEW_BGProtection
			if [ "$NEW_BGProtection" = "0" ] || [ "$NEW_BGProtection" = "1" ] || [ "$NEW_BGProtection" = "2" ]
			then
				NVS BGProtection $NEW_BGProtection
				IWP BGProtection $NEW_BGProtection
			fi
		elif [ "$MenuOpt" = "2" ] # Change Beacon Period
		then
			echo "Enter new Beacon Period value (range: 20 - 999, default 100) "
			read NEW_BeaconPeriod
			if [ "$NEW_BeaconPeriod" -gt 19 ] && [ "$NEW_BeaconPeriod" -lt 1000 ]
			then
				NVS BeaconPeriod $NEW_BeaconPeriod
				IWP BeaconPeriod $NEW_BeaconPeriod
			fi
		elif [ "$MenuOpt" = "3" ] # Change Data Beacon Rate
		then
			echo "Enter new Data Beacon Rate value (range 1 - 255, default 1) "
			read NEW_DtimPeriod
			if [ "$NEW_DtimPeriod" -gt 0 ] && [ "$NEW_DtimPeriod" -lt 256 ]
			then
				NVS DtimPeriod $NEW_DtimPeriod
				IWP DtimPeriod $NEW_DtimPeriod
			fi
		elif [ "$MenuOpt" = "4" ] # Change Fragmentation Threshold
		then
			echo "Enter new Fragmentation Threshold value (range 256 - 2346, default 2346) "
			read NEW_FragThreshold
			if [ "$NEW_FragThreshold" -gt 255 ] && [ "$NEW_FragThreshold" -lt 2347 ]
			then
				NVS FragThreshold $NEW_FragThreshold
				IWP FragThreshold $NEW_FragThreshold
			fi
		elif [ "$MenuOpt" = "5" ] # Change RTS Threshold
		then
			echo "Enter new RTS Threshold value (range 1 - 2347, default 2347) "
			read NEW_RTSThreshold
			if [ "$NEW_RTSThreshold" -gt 0 ] && [ "$NEW_RTSThreshold" -lt 2348 ]
			then
				NVS RTSThreshold $NEW_RTSThreshold
				IWP RTSThreshold $NEW_RTSThrehold
			fi
		elif [ "$MenuOpt" = "6" ] # Change Tx Power
		then
			echo "Enter new Tx Power value (range 1 - 100, default 100) "
			read NEW_TxPower
			if [ "$NEW_TxPower" -gt 0 ] && [ "$NEW_TxPower" -lt 101 ]
			then
				NVS TxPower $NEW_TxPower
				IWP TxPower $NEW_TxPower
			fi
		elif [ "$MenuOpt" = "7" ] # Change Tx Preamble
		then
			if [ "$TxPreamble" = "0" ]
			then
				echo "Are you sure? (Enable Tx Preamble) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS TxPreamble 1
					IWP TxPreamble 1
				fi
			else
				echo "Are you sure? (Disable Tx Preamble) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS TxPreamble 0
					IWP TxPreamble 0
				fi
			fi
		elif [ "$MenuOpt" = "8" ] # Change Short Slot
		then
			if [ "$ShortSlot" = "0" ]
			then
				echo "Are you sure? (Enable Short Slot) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS ShortSlot 1
					IWP ShortSlot 1
				fi
			else
				echo "Are you sure? (Disable Short Slot) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS ShortSlot 0
					IWP ShortSlot 0
				fi
			fi
		elif [ "$MenuOpt" = "9" ] # Change Tx Burst
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
		elif [ "$MenuOpt" = "10" ] # Change Pkt Aggregate
		then
			if [ "$PktAggregate" = "0" ]
			then
				echo "Are you sure? (Enable Packet Aggregate) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS PktAggregate 1
					IWP PktAggregate 1
				fi
			else
				echo "Are you sure? (Disable Packet Aggregate) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS PktAggregate 0
					IWP PktAggregate 0
				fi
			fi
		elif [ "$MenuOpt" = "11" ] # Change 80211H Support
		then
			if [ "$IEEE80211H" = "0" ]
			then
				echo "Are you sure? (Enable IEEE 80211H Support) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS IEEE80211H 1
					IWP IEEE80211H 1
				fi
			else
				echo "Are you sure? (Disable IEEE 80211H Support) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS IEEE80211H 0
					IWP IEEE80211H 0
				fi
			fi
		elif [ "$MenuOpt" = "12" ] ## Change Country Code
		then
			echo " Select Country Code"
			echo " -----------------"
			echo "1) None"
			echo "2) Japan (JP)"
			echo "3) France (FR)"
			echo "4) United States (US)"
			echo "5) Taiwan (TW)"
			echo "6) Ireland (IE)"
			echo "7) Hong Kong (HK)"

			read CC

			case "$CC" in
				"1") NVS CountryCode NA; IWP CountryCode NA;;
				"2") NVS CountryCode JP; IWP CountryCode JP;;
				"3") NVS CountryCode FR; IWP CountryCode FR;;
				"4") NVS CountryCode US; IWP CountryCode US;;
				"5") NVS CountryCode TW; IWP CountryCode TW;;
				"6") NVS CountryCode IE; IWP CountryCode IE;;
				"7") NVS CountryCode HK; IWP CountryCode HK;;
			esac
		elif [ "$MenuOpt" = "13" ]
		then
			AP_Wireless_Advanced_WMM_Settings_Menu
		elif [ "$MenuOpt" = "14" ]
		then
			AP_Wireless_Advanced_5GMisc_Settings_Menu
		fi
	done
}

### Additional Settings 5G only ##
##################################

AP_Wireless_Advanced_5GMisc_Settings_Menu ()
{
	while [ 1 = 1 ]
	do
		Menu=2

		SpaceInfo=0
		LongInfoTable=0
		MenuName=" Wireless Settings (AP,$WIFNAME) -> Misc"

		M2UCompiled=$(cat $(pwd)/config.sh | grep CONFIG_RT2860V2_AP_IGMP_SNOOP=y)
		APCarrierCompiled=$(cat $(pwd)/config.sh | grep CONFIG_RT2860V2_AP_CARRIER=y)
		DFSCompiled=$(cat $(pwd)/config.sh | grep CONFIG_RT2860V2_AP_DFS=y)
		DLSCompiled=$(cat $(pwd)/config.sh | grep CONFIG_RT2860V2_AP_DLS=y)
		VTurbineCompiled=$(cat $(pwd)/config.sh | grep CONFIG_RT2860V2_AP_VIDEO_TURBINE=y)

		MenuInfoCtr=5
		MenuItemCtr=5

		if [ -n "$M2UCompiled" ]
		then
			M2UEnabled=$(NVG M2UEnabled)
			if [ "$M2UEnabled" = "0" ]
			then
				MenuItem1="1) Enable Multicast to Unicast converter"
				MenuInfo1="Multicast to Unicast converter: Disabled"
			else
				MenuItem1="1) Disable Multicast to Unicast converter"
				MenuInfo1="Multicast to Unicast converter: Enabled"
			fi
		else
			MenuItem1="1) Multicast to Unicast converter: Feature N/A"
			MenuInfo1="Multicast to Unicast converter: Feature N/A"
		fi

		if [ -n "$APCarrierCompiled" ]
		then
			CarrierDetect=$(NVG CarrierDetect)
			if [ "$CarrierDetect" = "0" ]
			then
				MenuItem2="2) Enable Carrier Detect"
				MenuInfo2="AP Carrier Detect: Disabled"
			else
				MenuItem2="2) Disable Carrier Detect"
				MenuInfo2="Multicast to Unicast converter: Enabled"
			fi
		else
			MenuItem2="2) Carrier Detect: Feature N/A"
			MenuInfo2="Carrier Detect: Feature N/A"
		fi

		if [ -n "$DLSCompiled" ]
		then
			DLS_EN=$(NVG DLSCapable)

			if [ "$DLS_EN" = "0" ] ## DLS disabled
			then
				MenuItem3="3) Enable DLS "
				MenuInfo3="DLS: Disabled"
			else
				MenuItem3="3) Disable DLS"
				MenuInfo3="DLS:Enabled"
			fi
		else
			MenuItem3="3) DLS: Feature N/A"
			MenuInfo3="DLS: Feature N/A"
		fi

		if [ -n "$DFSCompiled" ]
		then
			RDRegion=$(NVG RDRegion)

			MenuItem4="4) Change RD Region"
			MenuInfo4="RD Region: $RDRegion"
		else
			MenuItem4="4) DFS: Feature N/A"
			MenuInfo4="DFS: Feature N/A"
		fi

		if [ -n "$VTurbineCompiled" ]
		then
			VIDTURBINE_EN=$(NVG VideoTurbine)
			MenuItem5="5) Change Video Turbine Mode"

			if [ "$VIDTURBINE_EN" = "0" ]
			then
				MenuInfo5="Video Turbine: Disabled"
			elif [ "$VIDTURBINE_EN" = "1" ]
			then
				MenuInfo5="Video Turbine: Enabled"
			elif [ "$VIDTURBINE_EN" = "2" ]
			then
				MenuInfo5="Video Turbine: Auto"
			fi
		else
			MenuItem5="5) Video Turbine: Feature N/A"
			MenuInfo5="Video Turbine: Feature N/A"
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

		if [ "$MenuOpt" = "1" ] && [ -n "$M2UCompiled" ] # Change MultiCast to unicast converter
		then
			if [ "$M2UEnabled" = "0" ]
			then
				echo "Are you sure? (Enable Multicast to Unicast converter) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS M2UEnabled 1
					IWP IgmpSnEnable 1
				fi
			else
				echo "Are you sure? (Disable Multicast to Unicast converter) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS M2UEnabled 0
					IWP IgmpSnEnable 0
				fi
			fi
		elif [ "$MenuOpt" = "2" ] && [ -n "$APCarrierCompiled" ] # Change Carrier Detect
		then
			if [ "$CarrierDetect" = "0" ]
			then
				echo "Are you sure? (Enable Carrier Detect) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS CarrierDetect 1
					IWP CarrierDetect 1
				fi
			else
				echo "Are you sure? (Disable Carrier Detect) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS CarrierDetect 0
					IWP CarrierDetect 0
				fi
			fi
		elif [ "$MenuOpt" = "3" ] && [ -n "$DLSCompiled" ] # Change DLS
		then
			if [ "$DLS_EN" = "0" ]
			then
				echo "Are you sure? (Enable DLS) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS DLSCapable 1
				fi
			else
				echo "Are you sure? (Disable DLS) [y/n] "
				read YN
				if [ $YN = "Y" ] || [ $YN = "y" ]
				then
					NVS DLSCapable 0
				fi
			fi
		elif [ "$MenuOpt" = "4" ] && [ -n "$DFSCompiled" ] # Change DFS
		then
			echo "Choose a new RD Region"
			echo " -----------------"
			echo "1) FCC"
			echo "2) CE"
			echo "3) JAP"

			read NEW_RDRegion

			if [ "$NEW_RDRegion" = "1" ]
			then
				NVS RDRegion FCC
			elif [ "$NEW_RDRegion" = "2" ]
			then
				NVS RDRegion CE
			elif [ "$NEW_RDRegion" = "3" ]
			then
				NVS RDRegion JAP
			fi
		elif [ "$MenuOpt" = "5" ] && [ -n "$VTurbineCompiled" ] # Change Video Turbine
		then
			echo "Choose a new Video Turbine Mode"
			echo " -----------------"
			echo "1) Enabled"
			echo "2) Disabled"
			echo "3) Auto"

			read NEW_VTurbineMode

			if [ "$NEW_VTurbineMode" = "1" ]
			then
				NVS VideoTurbine 1
			elif [ "$NEW_VTurbineMode" = "2" ]
			then
				NVS VideoTurbine 0
			elif [ "$NEW_VTurbineMode" = "3" ]
			then
				NVS VideoTurbine 2
			fi
		fi
	done
}

### WMM Settings ####
######################

AP_Wireless_Advanced_WMM_Settings_Menu()
{
	while [ 1 = 1 ]
	do
		Menu=3
		MenuName=" Wireless Settings (AP,$WIFNAME) -> Advanced -> WMM"

		SpaceInfo=0
		LongInfoTable=0

		WMM_EN=$(NVG WmmCapable)
		APSD_EN=$(NVG APSDCapable)

		if [ "$WMM_EN" = "0" ] ## server disabled
		then
			MenuItemCtr=2
			MenuItem1="1) Enable WMM Capabilities"

			MenuInfoCtr=2
			MenuInfo1="WMM Capabilities: Disabled"

			if [ "$APSD_EN" = "0" ] ## APSD disabled
			then
				MenuItem2="2) Enable APSD Capabilities"
				MenuInfo2="APSD Capabilities: Disabled"
			else
				MenuItem2="2) Disable APSD Capabilities"
				MenuInfo2="APSD Capabilities: Enabled"
			fi
		else # server enabled
			MenuItemCtr=8
			MenuItem1="1) Change AP/Station Aifsn"
			MenuItem2="2) Change AP/Station CW-Min"
			MenuItem3="3) Change AP/Station CW-Max"
			MenuItem4="4) Change AP/Station TxOp"
			MenuItem5="5) Change AP/Station ACM"
			MenuItem6="6) Change AP Ack Policy"
			MenuItem7="7) Disable WMM Capabilities"

			if [ "$APSD_EN" = "0" ] ## APSD disabled
			then
				MenuItem8="8) Enable APSD Capabilities"
				MenuInfo2="APSD Capabilities: Disabled"
			else
				MenuItem8="8) Disable APSD Capabilities"
				MenuInfo2="APSD Capabilities: Enabled"
			fi

			MenuInfoCtr=15

			APAifsn=$(NVG APAifsn)
			APCwmin=$(NVG APCwmin)
			APCwmax=$(NVG APCwmax)
			APTxop=$(NVG APTxop)
			APACM=$(NVG APACM)
			AckPolicy=$(NVG AckPolicy)

			BSSAifsn=$(NVG BSSAifsn)
			BSSCwmin=$(NVG BSSCwmin)
			BSSCwmax=$(NVG BSSCwmax)
			BSSTxop=$(NVG BSSTxop)
			BSSACM=$(NVG BSSACM)

			MenuInfo1="WMM Capabilities:Enabled"
			MenuInfo3=""
			PS_PAR="(AC_BE ; AC_BK ; AC_VI ; AC_VO)"
			MenuInfo4="AP Aifsn $PS_PAR: $APAifsn"
			MenuInfo5="AP CW-Min $PS_PAR: $APCwmin"
			MenuInfo6="AP CW-Max $PS_PAR: $APCwmax"
			MenuInfo7="AP TxOp $PS_PAR: $APTxop"
			MenuInfo8="AP ACM $PS_PAR: $APACM"
 			MenuInfo9="AP AckPolicy $PS_PAR: $AckPolicy"
			MenuInfo10=""
			MenuInfo11="Station Aifsn $PS_PAR: $BSSAifsn"
			MenuInfo12="Station CW-Min $PS_PAR: $BSSCwmin"
			MenuInfo13="Station CW-Max $PS_PAR: $BSSCwmax"
			MenuInfo14="Station TxOp $PS_PAR: $BSSTxop"
			MenuInfo15="Station ACM $PS_PAR: $BSSACM"
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
		if [ "$WMM_EN" = "0" ] ## wmm disabled
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
			elif [ "$MenuOpt" = "2" ]
			then
	 			if [ "$APSD_EN" = "0" ]
				then
					echo "Are you sure (Enable APSD Capabilities) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS APSDCapable 1
					fi
				else
					echo "Are you sure (Disable APSD Capabilities) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS APSDCapable 0
					fi
				fi
			fi
		else # wmm enabled
			if [ "$MenuOpt" = "1" ] || [ "$MenuOpt" = "4" ] ## ifsn / Txop (ap and sta)
			then
				if [ "$MenuOpt" = "1" ]
				then
					echo "Change Aifsn for AP or Station (0 - AP, 1 - Station , 2 - Return to the menu) ?"
				else
					echo "Change TxOp for AP or Station (0 - AP, 1 - Station , 2 - Return to the menu) ?"
				fi

				read APSTA

				if [ "$APSTA" = "0" ] || [ "$APSTA" = "1" ]
				then
					if [ "$MenuOpt" = "1" ]
					then
						VAL_MIN=1
						VAL_MAX=15
					else
						VAL_MIN=0
						VAL_MAX=9999
					fi

					VAL_MIN_M1=$(DEC $VAL_MIN 1)
					VAL_MAX_P1=$(INC $VAL_MAX 1)

					#AC_BE
					echo "Enter new AC_BE value (range: $VAL_MIN-$VAL_MAX) "
					read AC_BE

					while (!([ "$AC_BE" -gt "$VAL_MIN_M1" ] && [ "$AC_BE" -lt "$VAL_MAX_P1" ]))
					do
						$ERR1
						echo "Enter new AC_BE value (range: $VAL_MIN-$VAL_MAX) "
						read AC_BE
					done

					#AC_BK
					echo "Enter new AC_BK value $VAL_MIN-$VAL_MAX)"
					read AC_BK
					while (!([ "$AC_BK" -gt "$VAL_MIN_M1" ] && [ "$AC_BK" -lt "$VAL_MAX_P1" ]))
					do
						$ERR1
						echo "Enter new AC_BK value (range: $VAL_MIN-$VAL_MAX) "
						read AC_BK
					done

					#AC_VI
					echo "Enter new AC_VI value (range: $VAL_MIN-$VAL_MAX)"
					read AC_VI
					while (!([ "$AC_VI" -gt "$VAL_MIN_M1" ] && [ "$AC_VI" -lt "$VAL_MAX_P1" ]))
					do
						$ERR1
						echo "Enter new AC_VI value (range: $VAL_MIN-$VAL_MAX) "
						read AC_VI
					done

					#AC_VO
					echo "Enter new AC_VO value $VAL_MIN-$VAL_MAX) "
					read AC_VO
					while (!([ "$AC_VO" -gt "$VAL_MIN_M1" ] && [ "$AC_VO" -lt "$VAL_MAX_P1" ]))
					do
						$ERR1
						echo "Enter new AC_VO value (range: $VAL_MIN-$VAL_MAX) "
						read AC_VO
					done

					if [ "$MenuOpt" = "1" ]
					then
						if [ "$APSTA" = "0" ]
						then
							NVS APAifsn $AC_BE\;$AC_BK\;$AC_VI\;$AC_VO
						else
							NVS BSSAifsn $AC_BE\;$AC_BK\;$AC_VI\;$AC_VO
						fi
					elif [ "$MenuOpt" = "4" ]
					then
						if [ "$APSTA" = "0" ]
						then
							NVS APTxop $AC_BE\;$AC_BK\;$AC_VI\;$AC_VO
						else
							NVS BSSTxop $AC_BE\;$AC_BK\;$AC_VI\;$AC_VO
						fi
					fi
				fi
			elif [ "$MenuOpt" = "2" ] || [ "$MenuOpt" = "3" ] ## Cwmin and Cwmax (ap/sta)
			then
				if [ "$MenuOpt" = "2" ]
				then
					echo "Change CW-Min for AP or Station (0 - AP, 1 - Station , 2 - Return to the menu) ?"
				else
					echo "Change CW-Max for AP or Station (0 - AP, 1 - Station , 2 - Return to the menu) ?"
				fi

				read APSTA

				if [ "$APSTA" = "0" ] || [ "$APSTA" = "1" ]
				then
					VAL_MIN=1

					if [ "$MenuOpt" = "2" ]
					then
						VAL_MAX=7
					else
						VAL_MAX=15
					fi

					VAL_MIN_M1=$(DEC $VAL_MIN 1)
					VAL_MAX_P1=$(INC $VAL_MAX 1)

					# AC_BE
					echo "Enter new AC_BE value (range: $VAL_MIN-$VAL_MAX, valid values are 2^n - 1) "
					read AC_BE
					while (!([ "$AC_BE" -gt "$VAL_MIN_M1" ] && [ "$AC_BE" -lt "$VAL_MAX_P1" ]))
					do
						$ERR1
						echo "Enter new AC_BE value (range: $VAL_MIN-$VAL_MAX, valid values are 2^n - 1) "
						read AC_BE
					done

					if [ "$MenuOpt" = "2" ]
					then
						VAL_MAX=15
					else
						VAL_MAX=1023
					fi

					echo "Enter new AC_BK value $VAL_MIN-$VAL_MAX , valid values are 2^n - 1)"
					read AC_BK
					while (!([ "$AC_BK" -gt "$VAL_MIN_M1" ] && [ "$AC_BK" -lt "$VAL_MAX_P1" ]))
					do
						$ERR1
						echo "Enter new AC_BK value (range: $VAL_MIN-$VAL_MAX, valid values are 2^n - 1) "
						read AC_BK
					done

					# AC_VI
					if [ "$MenuOpt" = "2" ]
					then
						VAL_MAX=7
					else
						VAL_MAX=15
					fi

					echo "Enter new AC_VI value (range: $VAL_MIN-$VAL_MAX, valid values are 2^n - 1)"
					read AC_VI
					while (!([ "$AC_VI" -gt "$VAL_MIN_M1" ] && [ "$AC_VI" -lt "$VAL_MAX_P1" ]))
					do
						$ERR1
						echo "Enter new AC_VI value (range: $VAL_MIN-$VAL_MAX, valid values are 2^n - 1) "
						read AC_VI
					done

					# AC_VO
					if [ "$MenuOpt" = "2" ]
					then
						VAL_MAX=3
					else
						VAL_MAX=7
					fi

					echo "Enter new AC_VO value (range: $VAL_MIN-$VAL_MAX, valid values are 2^n - 1 ) "
					read AC_VO
					while (!([ "$AC_VO" -gt "$VAL_MIN_M1" ] && [ "$AC_VO" -lt "$VAL_MAX_P1" ]))
					do
						$ERR1
						echo "Enter new AC_VO value (range: $VAL_MIN-$VAL_MAX, valid values are 2^n - 1) "
						read AC_VO
					done

					if [ "$MenuOpt" = "2" ]
					then
						if [ "$APSTA" = "0" ]
						then
							NVS APCwmin $AC_BE\;$AC_BK\;$AC_VI\;$AC_VO
						else
							NVS BSSCwmin $AC_BE\;$AC_BK\;$AC_VI\;$AC_VO
						fi
					elif [ "$MenuOpt" = "3" ]
					then
						if [ "$APSTA" = "0" ]
						then
							NVS APCwmax $AC_BE\;$AC_BK\;$AC_VI\;$AC_VO
						else
							NVS BSSCwmax $AC_BE\;$AC_BK\;$AC_VI\;$AC_VO
						fi
					fi
				fi
			elif [ "$MenuOpt" = "5" ] || [ "$MenuOpt" = "6" ] ## ACM / ACK Policy
			then
				if [ "$MenuOpt" = "5" ]
				then
					echo "Change ACM for AP or Station (0 - AP, 1 - Station , 2 - Return to the menu) ?"
					read APSTA
				else
					APSTA=0
				fi

				if [ "$APSTA" = "0" ] || [ "$APSTA" = "1" ]
				then
					VAL_MIN=1

					#AC_BE
					echo "Enter new AC_BE value (0 - Disable, 1 - Enable) "
					read AC_BE
					while [ "$AC_BE" != "0" ] && [ "$AC_BE" != "1" ]
					do
						$ERR1
						echo "Enter new AC_BE value (0 - Disable, 1 - Enable) "
						read AC_BE
					done

					#AC_BK
					echo "Enter new AC_BK value (0 - Disable, 1 - Enable) "

					read AC_BK
					while [ "$AC_BK" != "0" ] && [ "$AC_BK" != "1" ]
					do
						$ERR1
						echo "Enter new AC_BK value (0 - Disable, 1 - Enable) "
						read AC_BK
					done

					#AC_VI
					echo "Enter new AC_VI value (0 - Disable, 1 - Enable) "

					read AC_VI

					while [ "$AC_BK" != "0" ] && [ "$AC_BK" != "1" ]
					do
						$ERR1
						echo "Enter new AC_VI value (0 - Disable, 1 - Enable) "
						read AC_VI
					done

					#AC_VO
					echo "Enter new AC_VO value (0 - Disable, 1 - Enable) "

					read AC_VO

					while [ "$AC_VO" != "0" ] && [ "$AC_VO" != "1" ]
					do
						$ERR1
						echo "Enter new AC_VO value (0 - Disable, 1 - Enable) "
						read AC_VO
					done

					if [ "$MenuOpt" = "5" ]
					then
						if [ "$APSTA" = "0" ]
						then
							NVS APACM $AC_BE\;$AC_BK\;$AC_VI\;$AC_VO
						else
							NVS BSSACM $AC_BE\;$AC_BK\;$AC_VI\;$AC_VO
						fi
					elif [ "$MenuOpt" = "6" ]
					then
						NVS AckPolicy $AC_BE\;$AC_BK\;$AC_VI\;$AC_VO
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
			elif [ "$MenuOpt" = "8" ]
			then
	 			if [ "$APSD_EN" = "0" ]
				then
					echo "Are you sure (Enable APSD Capabilities) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS APSDCapable 1
					fi
				else
					echo "Are you sure (Disable APSD Capabilities) [y/n] ?"
					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						NVS APSDCapable 0
					fi
				fi
			fi
		fi
	done
}

