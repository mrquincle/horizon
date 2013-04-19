#!/bin/sh

draw_menu_full()
{
echo -en "\033[1;1H"

if [ "$1" != "R" ]
then ### Draw Logo##

echo -en "\033[2J"
echo "                    [0m
                    [1;34m
                               .ssSss.
                           .sS**^   ^*S.
                        .sS*^          Ss             l
                       .s[36mS[34m^                 .s[36mSS[34m.     lS      .sSS.     .sSSs.          .sSSSs.
                      .[36msS[34mS                .*^   [37mS[34mS    l[36mS[34m   .*^   S[36mS[34m   .s*^ ^*S[36mS[34ms.      s*^   ^*Ss
                     .[36mss[34mJ                 s[36mS[34ml  .s[36mS[34mS   l[36mS[34m   s[36mS[34ml  .s[37mSS[34m  l[36mS[34m      ^[36mSS[34m.   .S^[4C   S[36mS[34ml[0m
                    [1;34m s[36ms[37mS[34ml                 l[37mS[34ml.ssS*^   l[37mS[34ml  l[36mSl[34m.[0;34ms[1;36msS[34m*^  l[37mS[34m       s[36ms[37mS[34m.  S[36ml[34m[5C   l[37mS[34ml[0m
                    [1;34m s[36ms[37mS[34ml                 S[36mS[34m*^        l[37mS[34ml  S[36mS[34m*^       l[36mS[34m        S[36mS[37mS[34m. S[36ml[34m[5C   l[36mS[34mS[0m
                    [1;34m.s[36mSS[34ml                 *SS         l[36mS[34ml  *SS        l[36mS[34m         S[36mS[34ms S[36ml[34m [4C   l[36mS[34ml[0m
                    [1;34m .s[36mS[34mS.                 ^*sss*^    l[36mS[34ms.  ^*sss*^   Sl        .s[36mS[34mS SS  [4C  [36ml[34mS^[0m
                    [1;34m  .s[36mS[34ml.                           *l[36mS[34m.                     .s[36mS[34m*^ ^S,  [4C[36m.[34mS
                       ^s[36mS[34mS.                           SSl                    .sS^    ^Ss[4CsS
                        ^S[36mS[34mS.                 SSs       ^*s.                            ^*SS&^     [0m
                    [1;34m      ^SSS.            .ss*^
                             ^SSs.     .sSS*^
                                ^*SssS**^         [37mWireless[34m [37mCommunications[34m
                    [0m"

echo "[1;37m .========================================================================================================================."
echo " ||                                                                                                                       ||"
echo " ||                                                                                                                       ||"
echo -en "\033[1A"
echo " ||                                       $MenuName"
echo " ||                                       =========================                                                       ||"
echo " ||                                                                                                                       ||"

else ### Dont Draw Logo - draw spaces instead ##
	i=0
	echo "[1;37m"
	while [ $i -lt 23 ]
	do
		echo ""
		i=$(INC $i 1)
	done
fi

i=1
MenuItemCtrP1=$(INC $MenuItemCtr 1)

while [ $i -lt $MenuItemCtrP1 ]
do
	if [ "$1" != "R" ]
	then
		eval "Item=\$MenuItem${i}"
		echo " ||                                                                                                                       ||"
		echo -en "\033[1A"
		echo " ||                                       $Item"
		echo " ||                                                                                                                       ||"
	else
		echo ""
		echo ""
	fi
	i=$(INC $i 1)
done
echo " ||                                                                                                                       ||"
# display menu info

i=1
MenuInfoCtrP1=$(INC $MenuInfoCtr 1)

while [ $i -lt $MenuInfoCtrP1 ]
do
	eval "Item=\$MenuInfo${i}"

	if [ "$SpaceInfo" = "1" ]
	then
		echo " ||                                                                                                                       ||"
	fi

	if [ "$LongInfoTable" = "0" ]
	then
		echo " ||                                                                                                                       ||"
		echo -en "\033[1A"

		echo " ||                                       $Item"
	else
		echo " ||                                                                                                                       ||"
		echo -en "\033[1A"

		echo " ||                             $Item"
	fi

	i=$(INC $i 1)
done


echo " ||                                                                                                                       ||"
echo " ||                                                                                                                       ||"
echo " ||                                       B) Go Back                                                                      ||"
echo " ||                                                                                                                       ||"
echo " ||                                       Q) Quit to shell                                                                ||"
echo " ||                                                                                                                       ||"
echo " ||                                                                                                                       ||"
echo "  \=====================================  Enter Your Selection:  ==========================================================/ "
echo -en "\033[0;37m"
}

draw_menu_small()
{
echo -en "\033[1;1H"
if [ "$1" != "R" ]
then
	echo -en "\033[2J"
	echo "                                                                               "

	echo "[1;37m .============================================================================."
	echo " ||                                                                          ||"
	echo " ||                                                                          ||"
	echo -en "\033[1A"
	echo " ||         $MenuName"
	echo " ||         =========================                                        ||"
	echo " ||                                                                          ||"
else
	echo "[1;37m"
	echo ""
	echo ""
	echo ""
	echo ""
	echo ""
fi

i=1
MenuItemCtrP1=$(INC $MenuItemCtr 1)
while [ $i -lt $MenuItemCtrP1 ]
do
	if [ "$1" != "R" ]
	then
		eval "Item=\$MenuItem${i}"

		echo " ||                                                                          ||"
		echo -en "\033[1A"
		echo " ||          $Item"
	else
		echo ""
	fi

	i=$(INC $i 1)
done

# display menu info
echo " ||                                                                          ||"
i=1

MenuInfoCtrP1=$(INC $MenuInfoCtr 1)
while [ $i -lt $MenuInfoCtrP1 ]
do
	eval "Item=\$MenuInfo${i}"

#	if [ "$SpaceInfo" = "1" ]
#	then
#		echo " ||                                                                          ||"
#	fi

	if [ "$LongInfoTable" = "0" ]
	then
		echo " ||                                                                          ||"
		echo -en "\033[1A"
		echo " ||          $Item"
	else
		echo " ||                                                                          ||"
		echo -en "\033[1A"
		echo " ||  $Item"
	fi

	i=$(INC $i 1)
done

echo " ||                                                                          ||"
echo " ||                                                                          ||"
echo " ||          B) Go Back                                                      ||"
echo " ||                                                                          ||"
echo " ||          Q) Quit to shell                                                ||"
echo " ||                                                                          ||"
echo " ||                                                                          ||"
echo "  \======    Enter Your Selection:  ==========================================/ "
echo -en "\033[0;37m"
}

ReadInput()
{
	done=0

	while [ "$done" != "1" ]
	do
		if [ "$1" != "R" ]
		then
			if [ "$MENUSIZE" = "Small" ]
			then
				draw_menu_small
			else
				draw_menu_full
			fi
		else
			if [ "$Refresh" = "0" ]
			then
				if [ "$MENUSIZE" = "Small" ]
				then
					draw_menu_small
				else
					draw_menu_full
				fi
			else
				if [ "$MENUSIZE" = "Small" ]
				then
					draw_menu_small R
				else
					draw_menu_full R
				fi
			fi
		fi

		if [ "$1" != "R" ]
		then
			read Val
		else
			read -t $2 Val
			Ret=$?
			if [ "$Ret" != "0" ] #Timeout
			then
				done=1
				Val=100  # dummy value
				Refresh=1
			else
				Refresh=0 # Full Redraw
			fi
		fi

		if [ $Val -eq $Val 2> /dev/null ] && [ "$done" != "1" ]
		then
			done=1
		else

			if [ "$Val" = "Q" ] || [ "$Val" = "q" ]
			then
				if [ "$COMPRESSED_MODE" = "1" ]
				then	
					$SUDOCMD rm -f $(pwd)/inic_cmdr_*.sh
				fi
				if [ "$CHANGES_MADE" = "1" ]
				then
					echo ""
					echo "Parameter changes have been made,some settings will only take place after reboot"
					echo "Reboot Now ? [y/n]"

					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						REBOOTSYSTEM
					fi
				fi

				exit
			fi

			if [ "$Val" = "B" ] || [ "$Val" = "b" ]
			then
				if [ "$CHANGES_MADE" = "1" ]
				then
					echo ""
					echo "Parameter changes have been made,some settings will only take place after reboot"
					echo "Reboot Now ? [y/n]"

					read YN
					if [ $YN = "Y" ] || [ $YN = "y" ]
					then
						REBOOTSYSTEM
						$SUDOCMD ifconfig $WIRELESSIF up
					fi
				fi

				CHANGES_MADE=0
				Val=0
				done=1
			fi
		fi
	done
	if [ "$Val" = "" ]; then Val=100; fi # dummy value	

	return $Val
}

REBOOTSYSTEM()
{
	if [ "$PLATFORM" = "Target" ]
	then
		reboot
	else
		$BUILD_DIR/./ce_host.sh restart all
	fi
	CHANGES_MADE=0
}

NVS() #NVRAM SET
{
	# $1 - Parameter
	# $2 - New Value

	if [ "$PLATFORM" = "Target" ] # Target
	then
		if [ "$WIRELESSIF" = "$PRI_WIF" ] || [ "$WIRELESSIF" = "$PRI_APCLI_WIF" ]
		then
			#2860
			nvram_set 2860 $1 $2
		else
			#RTDEV
			nvram_set rtdev $1 $2
		fi
	else # iNIC HOST
		$SUDOCMD iwpriv $WIRELESSIF set nvram_set:$1=$2

		if [ $? -eq 0 ]
		then
			echo "Change Completed Sucessfully!!"
		else
			echo "Communication with iNIC is down..only local changes will take place"
		fi

		sleep 1

		# Local changes
		if [ "$WIRELESSIF" = "$PRI_WIF" ] || [ "$WIRELESSIF" = "$PRI_APCLI_WIF" ]
		then
			$SUDOCMD $BUILD_DIR/./nvram_set 2860 $1 $2
		else
			$SUDOCMD $BUILD_DIR/./nvram_set rtdev $1 $2
		fi

		sleep 1
	fi

	CHANGES_MADE=1
}

NVG() #NVRAM GET
{
	# $1 - Parameter

	if [ "$PLATFORM" = "Target" ] # Target
	then
		if [ "$WIRELESSIF" = "$PRI_WIF" ] || [ "$WIRELESSIF" = "$PRI_APCLI_WIF" ]
		then
			# 2860
			nvram_get 2860 $1
		else
			# RTDEV
			nvram_get rtdev $1
		fi
	else # iNIC HOST
		if [ "$WIRELESSIF" = "$PRI_WIF" ] || [ "$WIRELESSIF" = "$PRI_APCLI_WIF" ]
		then
			#2860
			$BUILD_DIR/./nvram_get 2860 $1
		else
			#RTDEV
			$BUILD_DIR/./nvram_get rtdev $1
		fi
	fi
}

IWP() #IWPRIV
{
	$SUDOCMD iwpriv $WIRELESSIF set $1=$2
	sleep 1
}

INC() # Increment
{
	# $1 - Variable
	# $2 - Increment Value
	Var=$1
	IncVal=$2

	## Uncomment the appropriate one
	# Arithmetics using shell (GOOD For about everything other than PUMA5 - default)
	echo $(($Var + $IncVal))
	# Arithmetics using awk (GOOD For PUMA5)
	#echo $Var $IncVal | awk '{printf($1 + $2)}'
}

DEC() # Decrement
{
	# $1 - Variable
	# $2 - Increment Value
	Var=$1
	IncVal=$2

	## Uncomment the appropriate one
	# Arithmetics using shell (GOOD For about everything other than PUMA5 - default)
	echo $(($Var - $IncVal))
	# Arithmetics using awk (GOOD For PUMA5)
	#echo $Var $IncVal | awk '{printf($1 - $2)}'
}




##################################### Station List #################################
StationListMenu_RefreshData()
{
	MenuInfoCtr=10
	i=1
	j=7
	Item=" "
	if [ -n "$SUDOCMD" ]
	then
		$SUDOCMD sh -c "iwpriv $WIRELESSIF show stainfo | cut -c1-18,80-94 > $(pwd)/stalist.txt"
	else
		iwpriv $WIRELESSIF show stainfo | cut -c1-18,80-94 > $(pwd)/stalist.txt
	fi

	while [ $i -lt 11 ]
	do
		eval "MenuInfo${i}=\$( cat \$(pwd)/stalist.txt |sed -n '${j}p' )"
		eval "Item=\$MenuInfo${i}"
		if [ "$i" = "1" ]
		then
			j=$(INC $j 1)
		else
			j=$(INC $j 2)
		fi
		i=$(INC $i 1)
	done

	if [ -n "$SUDOCMD" ]
	then
		$SUDOCMD sh -c "rm -r -f $(pwd)/stalist.txt"
	else
		rm -r -f $(pwd)/stalist.txt
	fi
}

StationListMenu()
{
	while [ 1 = 1 ]
	do
		Menu=1

		SpaceInfo=1
		LongInfoTable=0
		MenuItemCtr=0

		MenuName=" Station List: (AP,$WIFNAME) "
 
		StationListMenu_RefreshData

		Refresh=0
		ReadInput $LONG_REFRESH
		MenuOpt=$?

		if [ "$MenuOpt" = "0" ]
		then
			return
		fi

		while [ $MenuOpt -lt 1 ] || [ $MenuOpt -gt $MenuItemCtr ]
		do
			StationListMenu_RefreshData
			ReadInput $LONG_REFRESH
			MenuOpt=$?
			if [ "$MenuOpt" = "0" ]
			then
				return
			fi
		done
	done
}

##################################### Station List - End of section #################################

#### Site Survey ##### NOTE: NEEDS TO ADD SUPPORT FOR MORE SECURITY MODES #########################

SiteSurveyMenu()
{
	while [ 1 = 1 ]
	do
		Menu=1

		# Init Nvram/Iwpriv Variable Names
		if [ "$WIRELESSIF" = "$PRI_WIF" ] || [ "$WIRELESSIF" = "$SEC_WIF" ] ####  Regular Station ##
		then
		# Nvram Variables
								
			EncrypType_NVR="EncrypType"
			AuthMode_NVR="AuthMode"
			WPAPSK_NVR="WPAPSK1"

			if [ "$WIRELESSIF" = "$PRI_WIF" ];then SSID_NVR="SSID1"; else SSID_NVR="SSID1"; fi

			DefaultKeyID_NVR="staKeyDefaultId"
			Key1_NVR="staKey1"
			Key2_NVR="staKey2"
			Key3_NVR="staKey3"
			Key4_NVR="staKey4"

		# Iwpriv Variables
								
			EncrypType_IWP="EncrypType"
			AuthMode_IWP="AuthMode"
			WPAPSK_IWP="WPAPSK"

			SSID_IWP="SSID"

			DefaultKeyID_IWP="DefaultKeyID"
			Key1_IWP="Key1"
			Key2_IWP="Key2"
			Key3_IWP="Key3"
			Key4_IWP="Key4"

		else ######  AP Client ######

			# Nvram Variables
								
			EncrypType_NVR="ApCliEncrypType"
			AuthMode_NVR="ApCliAuthMode"
			WPAPSK_NVR="ApCliWPAPSK"

			SSID_NVR="ApCliSsid"

			DefaultKeyID_NVR="ApCliDefaultKeyID"
			Key1_NVR="ApCliKey1Str"
			Key2_NVR="ApCliKey2Str"
			Key3_NVR="ApCliKey3Str"
			Key4_NVR="ApCliKey4Str"

		# Iwpriv Variables
								
			EncrypType_IWP="ApCliEncrypType"
			AuthMode_IWP="ApCliAuthMode"
			WPAPSK_IWP="ApCliWPAPSK"

			SSID_IWP="ApCliSsid"

			DefaultKeyID_IWP="ApCliDefaultKeyID"
			Key1_IWP="ApCliKey1"
			Key2_IWP="ApCliKey2"
			Key3_IWP="ApCliKey3"
			Key4_IWP="ApCliKey4"


		fi		
		#####
		
		CUR_SSID=$(iwconfig $WIRELESSIF | sed 's/ /\n/g' | grep ESSID | sed 's/:/\n/g' | sed -n '2p' )
		if [ "$CUR_SSID" = "\"\"" ]
		then
			MenuName=" Site Survey (Station,$WIFNAME): (Currently Disconnected) "
		else
			MenuName=" Site Survey (Station,$WIFNAME): (Current SSID: $CUR_SSID) "
		fi

		CHANGES_MADE=0 # No Reboot Required

		MenuItemCtr=0
		MenuInfoCtr=1

		SpaceInfo=0
		LongInfoTable=1

		MenuInfo1=""

		Item=" "

		i=2

		IWP SiteSurvey 1 # Trigger Site Survey

		if [ -n "$SUDOCMD" ] # Generate AP List file
		then

			$SUDOCMD sh -c "iwpriv $WIRELESSIF get_site_survey > $(pwd)/aplist.txt"
		else
			iwpriv $WIRELESSIF get_site_survey > $(pwd)/aplist.txt
		fi

		while [ -n "$Item" ]
		do
			if [ "$MENUSIZE" = "Large" ]
			then
				#eval "MenuInfo${i}=\$(iwpriv $WIRELESSIF get_site_survey | cut -c1-30,35-89 | sed -n '${i}p')"
				eval "MenuInfo${i}=\$( cat \$(pwd)/aplist.txt | cut -c1-30,35-89 | sed -n '${i}p')"
			else
				#eval "MenuInfo${i}=\$(iwpriv $WIRELESSIF get_site_survey | cut -c1-30,35-71 | sed -n '${i}p')"
				eval "MenuInfo${i}=\$( cat \$(pwd)/aplist.txt | cut -c1-30,35-71 | sed -n '${i}p')"
			fi

			eval "Item=\$MenuInfo${i}"
			if [ -n "$Item" ] && [ "$i" != "2" ]
			then
				iM2=$(DEC $i 2)
				if [ $iM2 -lt 10 ]
				then
					eval "MenuInfo${i}=\"$iM2)  \$MenuInfo${i}\""
				else
					eval "MenuInfo${i}=\"$iM2) \$MenuInfo${i}\""
				fi
			else
				if [ "$i" = "2" ]
				then
					eval "MenuInfo${i}=\"    \$MenuInfo${i}\""
				fi
			fi

			i=$(INC $i 1)
			MenuInfoCtr=$(INC $MenuInfoCtr 1)
		done

		if [ -n "$SUDOCMD" ] # Delete AP List file
		then
			$SUDOCMD sh -c "rm -r -f $(pwd)/stalist.txt"
		else
			rm -r -f $(pwd)/stalist.txt
		fi

		sleep 1


		ReadInput
		MenuOpt=$?

		if [ "$MenuOpt" = "0" ]
		then
			return
		fi

		MenuInfoCtrM3=$(DEC $MenuInfoCtr 3)

		while [ $MenuOpt -lt 1 ] || [ $MenuOpt -gt $MenuInfoCtrM3 ] ## < - MenuInfoCtr in this function
		do

			ReadInput
			MenuOpt=$?

			if [ "$MenuOpt" = "0" ]
			then
				return
			fi
		done

		i=$(INC $MenuOpt 2)
		eval "Item=\$MenuInfo${i}"

		SSID=$(echo "$Item" | cut -c8-37 | sed 's/ //g')
		SEC=$(echo "$Item" | cut -c55-80 | sed 's/ //g')

		AUTH=$(echo $SEC | sed 's/\//\n/g' | sed -n '1p')
		ENC=$(echo $SEC | sed 's/\//\n/g' | sed -n '2p')

		if [ "$SEC" = "WEP" ]
		then
			AUTH="UNKNOWN"
			ENC="WEP"
		fi
		if [ "$SEC" = "NONE" ]
		then
			AUTH="OPEN"
			ENC="NONE"
		fi

		echo ""
		echo ""
		echo "Wireless Network Information:"
		echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
		echo ""
		echo "SSID:             $SSID"
		echo "Encryption:       $ENC"
		echo "Authentication:   $AUTH"
		echo ""
		echo "Connect to this network? [Y/N]"
		echo ""

		read YN

		if [ "$YN" = "Y" ] || [ "$YN" = "y" ]
		then
			if [ "$AUTH" = "WPAPSK" ] || [ "$AUTH" = "WPA2PSK" ] || [ "$AUTH" = "WPA1PSKWPA2PSK" ] # WPA or WPA2 PSK
			then
				if [ "$AUTH" = "WPA1PSKWPA2PSK" ] # Multi Mode Psk
				then
					echo "Choose an authentication mode:"
					echo " ------------------------------"
					echo "1) WPA-PSK"
					echo "2) WPA2-PSK"

					read NEW_AUTH

					while (!([ "$NEW_AUTH" != "1" ] || [ "$NEW_AUTH" != "2" ]))
					do
						$ERR1
						echo "Choose an authentication mode ( 1- WPA-PSK  2- WPA2-PSK )"
						read NEW_AUTH
					done

					if [ "$NEW_AUTH" = "1" ]
					then
						AUTH="WPAPSK"
					else
						AUTH="WPA2PSK"
					fi

				fi

				if [ "$ENC" = "TKIPAES" ] || ([ "$ENC" != "TKIP" ] && [ "$ENC" != "AES" ])
				then
					echo "Choose an encryption algorithm:"
					echo " ------------------------------"
					echo "1) AES"
					echo "2) TKIP"

					read NEW_ENC

					while (!([ "$NEW_ENC" != "1" ] || [ "$NEW_ENC" != "2" ]))
					do
						$ERR1
						echo "Choose an encryption algorithm ( 1-AES   2-TKIP )"
						read NEW_ENC
					done
					if [ "$NEW_ENC" = "1" ]
					then
						ENC="AES"
					else
						ENC="TKIP"
					fi
				fi

				echo ""
				echo "Please enter pass-phrase for this network:"
				read PASSPHRASE
				echo "You Entered: $PASSPHRASE , is this correct? [Y/N]"
				read YN
				if [ "$YN" = "Y" ] || [ "$YN" = "y" ]
				then
					NVS $WPAPSK_NVR $PASSPHRASE
					NVS $SSID_NVR $SSID

					NVS $EncrypType_NVR $ENC
					NVS $AuthMode_NVR $AUTH

					echo "Joining network... "
					
					if [ "$WIRELESSIF" = "$PRI_APCLI_WIF" ] || [ "$WIRELESSIF" = "$SEC_APCLI_WIF" ]; then IWP ApCliEnable 0; fi

					IWP $AuthMode_IWP $AUTH
					IWP $EncrypType_IWP $ENC

					if [ "$WIRELESSIF" = "$PRI_WIF" ] || [ "$WIRELESSIF" = "$SEC_WIF" ]; then IWP IEEE8021X 0; fi

					IWP $SSID_IWP $SSID
					IWP $WPAPSK_IWP $PASSPHRASE
					IWP $SSID_IWP $SSID

					if [ "$WIRELESSIF" = "$PRI_APCLI_WIF" ] || [ "$WIRELESSIF" = "$SEC_APCLI_WIF" ]; then IWP ApCliEnable 1; fi

					sleep 1
				fi
			fi

			if [ "$SEC" = "WEP" ] # WEP
			then
				echo ""
				echo "Please enter the security mode for this network ( 1 - Open WEP , 2 - Shared WEP) :"
				read AUTH

				while [ "$AUTH" != "1" ] && [ "$AUTH" != "2" ]
				do
					echo "Invalid Choice!"
					echo ""
					echo "Please enter the security mode for this network ( 1 - Open WEP , 2 - Shared WEP) :"
					read $AUTH
				done

				if [ "$AUTH" = "1" ]
				then
					AUTH=OPEN
				else
					AUTH=SHARED
				fi

				for i in 1 2 3 4
				do
					echo "Please enter Key #$i of 4 for this network (5/13 ascii characters / 10/26 hexadecimal ):"

					case "$i" in
						1) read KEY1; PASSPHRASE=$KEY1;;
						2) read KEY2; PASSPHRASE=$KEY2;;
						3) read KEY3; PASSPHRASE=$KEY3;;
						4) read KEY4; PASSPHRASE=$KEY4;;
					esac

					while [ "${#PASSPHRASE}" != "5" ] && [ "${#PASSPHRASE}" != "13" ] \
						&& [ "${#PASSPHRASE}" != "10" ] && [ "${#PASSPHRASE}" != "26" ] && [ "${#PASSPHRASE}" != "" ]
					do
						echo "Invalid key length!"
						echo ""
						echo "Please enter Key #$i of 4 for this network (5/13 ascii characters / 10/26 hexadecimal ):"

						case "$i" in
							1) read KEY1; PASSPHRASE=$KEY1;;
							2) read KEY2; PASSPHRASE=$KEY2;;
							3) read KEY3; PASSPHRASE=$KEY3;;
							4) read KEY4; PASSPHRASE=$KEY4;;
						esac
					done
				done

				echo "Enter the default key for this network ( 1 - 4 )"
				read DEF_KEY

				while (!([ "$DEF_KEY" -gt "0" ] && [ "$DEF_KEY" -lt "5" ]))
				do
					$ERR1
					echo "Enter the default key for this network ( 1 - 4 )"
					read DEF_KEY
				done

				echo "Summary:"
				echo "-----------------"
				echo "Key #1:      $KEY1"
				echo "Key #2:      $KEY2"
				echo "Key #3:      $KEY3"
				echo "Key #4:      $KEY4"
				echo ""
				echo "Default Key: $DEF_KEY"
				echo ""
				echo "is this correct? [Y/N]"
				read YN

				if [ "$YN" = "Y" ] || [ "$YN" = "y" ]
				then
					NVS $DefaultKeyID_NVR $DEF_KEY
					NVS $Key1_NVR $KEY1
					NVS $Key2_NVR $KEY2
					NVS $Key3_NVR $KEY3
					NVS $Key4_NVR $KEY4

					NVS $SSID_NVR $SSID

					NVS $EncrypType_NVR $ENC
					NVS $AuthMode_NVR $AUTH

					echo "Joining network..."

					if [ "$WIRELESSIF" = "$PRI_APCLI_WIF" ] || [ "$WIRELESSIF" = "$SEC_APCLI_WIF" ]; then IWP ApCliEnable 0; fi

					IWP $AuthMode_IWP $AUTH
					IWP $EncrypType_IWP $ENC
					IWP $DefaultKeyID_IWP $DEF_KEY
					IWP $Key1_IWP $KEY1
					IWP $Key2_IWP $KEY2
					IWP $Key3_IWP $KEY3
					IWP $Key4_IWP $KEY4
					IWP $SSID_IWP $SSID

					if [ "$WIRELESSIF" = "$PRI_APCLI_WIF" ] || [ "$WIRELESSIF" = "$SEC_APCLI_WIF" ]; then IWP ApCliEnable1; fi

					sleep 1
				fi
			fi

			if [ "$ENC" = "NONE" ] # no encryption/auth scheme
			then

				NVS $SSID_NVR $SSID

				NVS $EncrypType_NVR $ENC
				NVS $AuthMode_NVR $AUTH

				echo "Joining network..."

				IWP $EncrypType_IWP $ENC
				IWP $AuthMode_IWP $AUTH
				IWP $SSID_IWP $SSID

				sleep 1
			fi
		fi
	done
}

##################################### Site Survey - End of section #################################

### Administration Menu ###
###########################

AdministrationMenu()
{
	while [ 1 = 1 ]
	do
		Menu=1
		MenuName=" Administration: "

		SpaceInfo=1
		LongInfoTable=0

		MenuItemCtr=3
		MenuInfoCtr=2

		ADM_LOGIN=$(NVG Login)
		ADM_PW=$(NVG Password)

		MenuItem1="1) Change Administrator Account"
		MenuItem2="2) Change Administrator Password"
		MenuItem3="3) Reboot System"

		MenuInfo1="Administrator Account: $ADM_LOGIN"
		MenuInfo2="Administrator Password: $ADM_PW"

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
			echo ""
			echo "Please enter a new administrator account:"
			read NEW_ADM_LOGIN
			echo "You Entered: $NEW_ADM_LOGIN , is this correct? [Y/N]"
			read YN
			if [ "$YN" = "Y" ] || [ "$YN" = "y" ]
			then
				NVS Login $NEW_ADM_LOGIN
			fi
		elif [ "$MenuOpt" = "2" ]
		then
			echo ""
			echo "Please enter a new administrator password:"
			read NEW_ADM_PW
			echo "You Entered: $NEW_ADM_PW , is this correct? [Y/N]"
			read YN
			if [ "$YN" = "Y" ] || [ "$YN" = "y" ]
			then
				NVS Password $NEW_ADM_PW
			fi
		elif [ "$MenuOpt" = "3" ]
		then
			echo "Reboot Now ? [y/n]"

			read YN
			if [ $YN = "Y" ] || [ $YN = "y" ]
			then
				REBOOTSYSTEM
			fi
		fi
	done
}

############# Administration - End of section #########

### System info menu (Automatically Refreshed )###
###########################

SystemInfoMenu_RefreshData()
{
	OpMode=$(NVG ethConvert)
	
	SSID_5G=$(iwconfig $PRI_WIF | sed 's/ /\n/g' | grep ESSID | sed 's/:/\n/g' | sed -n '2p' )
	BSSID_5G=$(iwconfig $PRI_WIF | sed 's/ /\n/g'| sed -n "/^\([0-9A-Z][0-9A-Z]:\)\{5\}[0-9A-Z][0-9A-Z]$/p")

	SSID_2_4G="Interface N/A"	
	BSSID_2_4G="Interface N/A"	

	SSID_APCLI_5G="Interface N/A"	
	BSSID_APCLI_5G="Interface N/A"	

	SSID_APCLI_2_4G="Interface N/A"	
	BSSID_APCLI_2_4G="Interface N/A"	

	if [ "$EN_DUALCONCURRENT" = "1" ]
	then
		$SUDOCMD ifconfig $SEC_WIF up

		SSID_2_4G=$(iwconfig $SEC_WIF | sed 's/ /\n/g' | grep ESSID | sed 's/:/\n/g' | sed -n '2p' )
		BSSID_2_4G=$(iwconfig $SEC_WIF | sed 's/ /\n/g'| sed -n "/^\([0-9A-Z][0-9A-Z]:\)\{5\}[0-9A-Z][0-9A-Z]$/p")
	fi

	#APCLI INFO

	if [ "$EN_APCLI_5" = "1" ]
	then
		SSID_APCLI_5G=$(iwconfig $PRI_APCLI_WIF | sed 's/ /\n/g' | grep ESSID | sed 's/:/\n/g' | sed -n '2p' )
		BSSID_APCLI_5G=$(iwconfig $PRI_APCLI_WIF | sed 's/ /\n/g'| sed -n "/^\([0-9A-Z][0-9A-Z]:\)\{5\}[0-9A-Z][0-9A-Z]$/p")
	fi

	if [ "$EN_APCLI_2_4" = "1" ]
	then
		SSID_APCLI_2_4G=$(iwconfig $SEC_APCLI_WIF | sed 's/ /\n/g' | grep ESSID | sed 's/:/\n/g' | sed -n '2p' )
		BSSID_APCLI_2_4G=$(iwconfig $SEC_APCLI_WIF | sed 's/ /\n/g'| sed -n "/^\([0-9A-Z][0-9A-Z]:\)\{5\}[0-9A-Z][0-9A-Z]$/p")
	fi
	

	if [ "$PLATFORM" = "Target" ]
	then
		MAC=$(ifconfig br0 | sed 's/ /\n/g'| sed -n "/^\([0-9A-Z][0-9A-Z]:\)\{5\}[0-9A-Z][0-9A-Z]$/p")
	fi

	VER=$(iwpriv $WIRELESSIF version | sed 's/ /\n/g'| grep version | sed 's/:/\n/g' | sed -n '2p')

	if [ "$CONFIG_SINGLE_WIF" = "0" ] || [ "$CONFIG_SINGLE_WIF" = "1" ] ## 5 Ghz Only
	then
		if [ "$OpMode" = "0" ]
		then
			MenuInfo1="Operation Mode: Access Point"
		else
			MenuInfo1="Operation Mode: Station"
		fi
	else	# 2.4 Ghz Only (Certification )
		if [ "$STA_2_4" = "0" ]
		then
			MenuInfo1="Operation Mode: Access Point"
		else
			MenuInfo1="Operation Mode: Station"
		fi
	fi

		MenuInfoCtr=18
		MenuInfo2=""
		MenuInfo3="5 Ghz Band: "
		MenuInfo4="	SSID: $SSID_5G"
		MenuInfo5="	BSSID:  $BSSID_5G"
		MenuInfo6=""
		MenuInfo7="	AP-Client SSID : $SSID_APCLI_5G"
		MenuInfo8="	AP-Client BSSID:  $BSSID_APCLI_5G"
		MenuInfo9=""
		MenuInfo10="2.4 Ghz Band:"
		MenuInfo11="	SSID : $SSID_2_4G"
		MenuInfo12="	BSSID:  $BSSID_2_4G"
		MenuInfo13=""
		MenuInfo14="	AP-Client SSID : $SSID_APCLI_2_4G"
		MenuInfo15="	AP-Client BSSID :  $BSSID_APCLI2_4G"


		MenuInfo16=""
		MenuInfo17="ETH MAC: $MAC"
		MenuInfo18="VERSION: $VER"
}

SystemInfoMenu()
{
	while [ 1 = 1 ]
	do
		Menu=1
		MenuName=" System Information: "

		SpaceInfo=1
		LongInfoTable=0

		SystemInfoMenu_RefreshData

		MenuItemCtr=0

		Refresh=0

		ReadInput $LONG_REFRESH
		MenuOpt=$?

		if [ "$MenuOpt" = "0" ]
		then
			return
		fi

		while [ $MenuOpt -lt 1 ] || [ $MenuOpt -gt $MenuItemCtr ]
		do
			SystemInfoMenu_RefreshData

			ReadInput $LONG_REFRESH
			MenuOpt=$?
			if [ "$MenuOpt" = "0" ]
			then
				return
			fi
		done
	done
}

############# System info - End of section #########

##################################### Operation Mode (AP/STA) #######################################

OpModeMenu()
{
	while [ 1 = 1 ]
	do
		Menu=1
		MenuName=" Set Operation Mode: "
		MenuItemCtr=2

		SpaceInfo=1
		LongInfoTable=0

		MenuItem1="1) Access Point"
		MenuItem2="2) Station"
		MenuInfoCtr=1
		OpMode=$(NVG ethConvert)

		if [ "$OpMode" = "0" ]
		then
			MenuInfo1="Current Mode: Access Point"
		else
			MenuInfo1="Current Mode: Station"
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
			echo "Are you sure (Operation Mode -> Access Point , Operation requires reboot) [y/n] ?"
			read YN
			if [ $YN = "Y" ] || [ $YN = "y" ]; then
				NVS OperationMode 0
				NVS ethConvert 0
				if [ "$PLATFORM" = "Target" ]
				then
					restore_defaults.sh 2860 ap
				else
					$BUILD_DIR/./ce_host.sh restore_defaults
				fi
				REBOOTSYSTEM
			fi
		elif [ "$MenuOpt" = "2" ]
		then
			echo "Are you sure (Operation Mode -> Station , Operation requires reboot) [y/n] ?"
			read YN
			if [ $YN = "Y" ] || [ $YN = "y" ]; then
				NVS OperationMode 0
				NVS ethConvert 1
				if [ "$PLATFORM" = "Target" ]
				then
					restore_defaults.sh 2860 sta
				else
					$BUILD_DIR/./ce_host.sh restore_defaults
				fi
				REBOOTSYSTEM
			fi
		fi
	done
}

########################################### Operation Mode - End Of Section ###########################################

########################################### Wireless Interface Select ###########################################
AP_or_STA_Menu()
{
	if [ "$1" = "0" ] # AP
	then
		if [ "$COMPRESSED_MODE" = "1" ]
		then
			$SUDOCMD rm -f $(pwd)/inic_cmdr_main.sh
			$SUDOCMD tar -zxvf inic_cmdr.tar.gz inic_cmdr_ap_wireless.sh
		fi

		. $(pwd)/inic_cmdr_ap_wireless.sh
		AP_WirelessSettingsMenu

		if [ "$COMPRESSED_MODE" = "1" ]
		then
			$SUDOCMD rm -f $(pwd)/inic_cmdr_ap_wireless.sh
		fi
	else	#STA
		if [ "$COMPRESSED_MODE" = "1" ]
		then
			$SUDOCMD rm -f $(pwd)/inic_cmdr_main.sh
			$SUDOCMD tar -zxvf inic_cmdr.tar.gz inic_cmdr_sta_wireless.sh
		fi

		. $(pwd)/inic_cmdr_sta_wireless.sh
		STA_WirelessSettingsMenu

		if [ "$COMPRESSED_MODE" = "1" ]
		then
			$SUDOCMD rm -f $(pwd)/inic_cmdr_sta_wireless.sh
		fi
	fi
}

WirelessIFSelectMenu()
{
	while [ 1 = 1 ]
	do
		WIRELESSIF=$PRI_WIF
		WIFNAME="5Ghz"

		OpMode=$(NVG ethConvert)

		if [ "$EN_DUALCONCURRENT" = "1" ] # rai0/ce01_0 exists -> dual band board
		then
			if [ "$CONFIG_SINGLE_WIF" = "0" ]
			then
				Menu=2

				SpaceInfo=1
				LongInfoTable=0

				MenuName=" Wireless Settings"
				MenuItemCtr=2

				MenuItem1="1) Primary Interface Settings (5 Ghz)"
				MenuItem2="2) Secondary Interface Settings (2.4 Ghz)"

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
			else
				MenuOpt=$CONFIG_SINGLE_WIF;
			fi

			# valid input here

			if [ "$MenuOpt" = "1" ] # Primary Interface Selected
			then
				WIRELESSIF=$PRI_WIF
				WIFNAME="5Ghz"

				AP_or_STA_Menu $OpMode
			elif [ "$MenuOpt" = "2" ] #Secondary Interface Selected
			then
				WIRELESSIF=$SEC_WIF
				WIFNAME="2.4Ghz"

				$SUDOCMD ifconfig $WIRELESSIF up
				Ret=$?
				if [ "$Ret" = "0" ]
				then
					if [ "$STA_2_4" = "0" ] ## Only for certification
					then
						AP_or_STA_Menu $OpMode
					else	# 2.4 Sta Mode
						AP_or_STA_Menu 1
					fi
				else
					echo "Communication with secondary wireless interface is unavailable.."
					echo ""
					sleep 1
				fi
			fi

			if [ "$CONFIG_SINGLE_WIF" != "0" ]
			then
				return
			fi
		else # not a dual band board
			WIRELESSIF=$PRI_WIF
			WIFNAME="5Ghz"

			AP_or_STA_Menu $OpMode

			return
		fi
	done
}

MainMenu()
{
	## Main (Changable Operation Mode) ###
	if [ "$OPMODE_CHANGABLE" = "1" ]
	then
		while [ 1 = 1 ]
		do
			WIRELESSIF=$PRI_WIF

			Menu=0

			SpaceInfo=1
			LongInfoTable=0

			MenuName=" Main Menu"
			MenuItemCtr=5

			MenuItem1="1) Operation Mode "
			MenuItem2="2) LAN Settings"
			MenuItem3="3) Wireless Settings"

			OpMode=$(NVG ethConvert)

			MenuItem4="4) Administration"
			MenuItem5="5) System Information"
			MenuInfoCtr=0

			ReadInput # reads the keyboard + draws the menu

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
				OpModeMenu
			elif [ "$MenuOpt" = "2" ]
			then
				if [ "$COMPRESSED_MODE" = "1" ]
				then
					$SUDOCMD rm -f $(pwd)/inic_cmdr_main.sh
					$SUDOCMD tar -zxvf inic_cmdr.tar.gz inic_cmdr_lan.sh
				fi

				. $(pwd)/inic_cmdr_lan.sh

				LANSettingsMenu

				if [ "$COMPRESSED_MODE" = "1" ]
				then
					$SUDOCMD rm -f $(pwd)/inic_cmdr_lan.sh
				fi
			elif [ "$MenuOpt" = "3" ]
			then
				WirelessIFSelectMenu
			elif [ "$MenuOpt" = "4" ]
			then
				AdministrationMenu
			elif [ "$MenuOpt" = "5" ]
			then
				SystemInfoMenu
			fi
		done
	else # Main (Fixed Operation Mode)
		while [ 1 = 1 ]
		do
			WIRELESSIF=$PRI_WIF

			Menu=0

			SpaceInfo=1
			LongInfoTable=0

			OpMode=$(NVG ethConvert)

			MenuName=" Main Menu "
			MenuItemCtr=4

			MenuItem1="1) LAN Settings"
			MenuItem2="2) Wireless Settings"

			MenuItem3="3) Administration"
			MenuItem4="4) System Information"

			MenuInfoCtr=1

			if [ "$CONFIG_SINGLE_WIF" = "0" ] || [ "$CONFIG_SINGLE_WIF" = "1" ] ## 5 Ghz Only
			then
				if [ "$OpMode" = "0" ]
				then
					MenuInfo1="Operation Mode: Access Point"
				else
					MenuInfo1="Operation Mode: Station"
				fi
			else	# 2.4 Ghz Only (Certification )
				if [ "$STA_2_4" = "0" ]
				then
					MenuInfo1="Operation Mode: Access Point"
				else MenuInfo1="Operation Mode: Station"
				fi
			fi

			ReadInput # reads the keyboard + draws the menu

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
				if [ "$COMPRESSED_MODE" = "1" ]
				then
					$SUDOCMD rm -f $(pwd)/inic_cmdr_main.sh
					$SUDOCMD tar -zxvf inic_cmdr.tar.gz inic_cmdr_lan.sh
				fi

				. $(pwd)/inic_cmdr_lan.sh

				LANSettingsMenu

				if [ "$COMPRESSED_MODE" = "1" ]
				then
					$SUDOCMD rm -f $(pwd)/inic_cmdr_lan.sh
				fi
			elif [ "$MenuOpt" = "2" ]
			then
				WirelessIFSelectMenu
			elif [ "$MenuOpt" = "3" ]
			then
				AdministrationMenu
			elif [ "$MenuOpt" = "4" ]
			then
				SystemInfoMenu
			fi
		done
	fi
}

### WPS Strings ####
######################

WPSStatusString()
{
	case $1 in
		"0") Ret="Not used";;
		"1") Ret="Idle";;
		"2") Ret="WPS Fail(Ignore this if Intel/Marvell registrar used)";;
		"3") Ret="Start WPS Process";;
		"4") Ret="Received EAPOL-Start";;
		"5") Ret="Sending EAP-Req(ID)";;
		"6") Ret="Receive EAP-Rsp(ID)";;
		"7") Ret="Receive EAP-Req with wrong WPS SMI Vendor Id";;
		"8") Ret="Receive EAPReq with wrong WPS Vendor Type";;
		"9") Ret="Sending EAP-Req(WPS_START)";;
		"10") Ret="Send M1";;
		"11") Ret="Received M1";;
		"12") Ret="Send M2";;
		"13") Ret="Received M2";;
		"14") Ret="Received M2D";;
		"15") Ret="Send M3";;
		"16") Ret="Received M3";;
		"17") Ret="Send M4";;
		"18") Ret="Received M4";;
		"19") Ret="Send M5";;
		"20") Ret="Received M5";;
		"21") Ret="Send M6";;
		"22") Ret="Received M6";;
		"23") Ret="Send M7";;
		"24") Ret="Received M7";;
		"25") Ret="Send M8";;
		"26") Ret="Received M8";;
		"27") Ret="Processing EAP Response (ACK)";;
		"28") Ret="Processing EAP Request (Done)";;
		"29") Ret="Processing EAP Response (Done)";;
		"30") Ret="Sending EAP-Fail";;
		"31") Ret="WSC_ERROR_HASH_FAIL";;
		"32") Ret="WSC_ERROR_HMAC_FAIL";;
		"33") Ret="WSC_ERROR_DEV_PWD_AUTH_FAIL";;
		"34") Ret="Configured";;
		"35") Ret="SCAN AP";;
		"36") Ret="EAPOL START SENT";;
		"37") Ret="WSC_EAP_RSP_DONE_SENT";;
		"38") Ret="WAIT PINCODE";;
		"39") Ret="WSC_START_ASSOC";;
		"257") Ret="PBC:TOO MANY AP";;
		"258") Ret="PBC:NO AP";;
		"259") Ret="EAP_FAIL_RECEIVED";;
		"260") Ret="EAP_NONCE_MISMATCH";;
		"261") Ret="EAP_INVALID_DATA";;
		"262") Ret="PASSWORD_MISMATCH";;
		"263") Ret="EAP_REQ_WRONG_SMI";;
		"264") Ret="EAP_REQ_WRONG_VENDOR_TYPE";;
		"265") Ret="PBC_SESSION_OVERLAP";;


	esac
	echo $Ret
}

