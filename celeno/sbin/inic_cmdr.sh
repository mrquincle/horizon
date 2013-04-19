#!/bin/sh

if [ "$1" = "-s" ] || [ "$2" = "-s" ]
then
	MENUSIZE="Small"
else
	MENUSIZE="Large"
fi

if [ "$1" = "-t" ] || [ "$2" = "-t" ]
then
	PLATFORM="Target"
else
	PLATFORM="Host"
fi

### FLAGS ####

### Generic Flags #####

## 0 - Disabled - Does Nothing,
## 1 - Allows access to configuration of the 5Ghz interface ONLY,
## 2 - Allows access to configuration of the 2.4Ghz interface ONLY.

CONFIG_SINGLE_WIF=0

## 0 - Operation Mode Change Disabled
## 1 - Operation Mode Change Enabled

OPMODE_CHANGABLE=1

## 0 - UnCompressed Mode (scripts are uncompressed)
## 1 - Compressed Mode (needs tar , uses inic_cmdr.tar.gz)
## Note: This flag's value is controlled via the pack_inic_image.sh script (y/n) and converted to 1/0

CONFIG_COMPRESSED_MODE=__INIC_CMDR_PACKED_REPLACE__
COMPRESSED_MODE=0
if [ "$CONFIG_COMPRESSED_MODE" = "y" ]
then
	COMPRESSED_MODE=1
fi

## 0 - Disabled - Static menus (automatic refresh disabled)
## 1 - Enabled - Automatically refreshable menus (requires the 'read -t' shell feature)


REFRESHABLE_MENUS=0

if [ "$REFRESHABLE_MENUS" == 1 ]
then
	SHORT_REFRESH="R 0.5"; LONG_REFRESH="R 2";
fi

##### Platform Specific Flags ###

if [ "$PLATFORM" = "Target" ]
then
	PRI_WIF="ra0"
	SEC_WIF="rai0"
	PRI_APCLI_WIF="apcli0"
	SEC_APCLI_WIF="apclii0"

	if [ "$COMPRESSED_MODE" = "1" ]
	then
		rm -f $(pwd)/inic_cmdr_*.sh
	fi

	cd /sbin

	#	cp /sbin/config.sh $(pwd)/config.sh
	TARGET_CONCURRENT=$(cat $(pwd)/config.sh | grep CONFIG_CONFIG_WLAN_DUAL_CONCURRENT=y)
	EN_DUALCONCURRENT=0
	if [ -n "$TARGET_CONCURRENT" ]
	then
		EN_DUALCONCURRENT=1
	fi
elif [ "$PLATFORM" = "Host" ]
then
	if [ -x /usr/bin/sudo ]
	then
		SUDOCMD=sudo
	fi

	if [ "$COMPRESSED_MODE" = "1" ]
	then
		$SUDOCMD rm -f $(pwd)/inic_cmdr_*.sh
	fi

	if [ ! -f $(pwd)/env.sh ]
	then
		echo "env.sh missing ..."
		exit 1
	else
		. $(pwd)/env.sh
	fi

	### Move to directory /tmp
	$SUDOCMD cp inic_cmdr* /tmp
	cd /tmp

	##################################

	if [ "$TARGET_NIC_TYPE" = "TANAMI" ]
	then

		PRI_WIF="ce00_0"
		SEC_WIF="ce01_0"
		PRI_APCLI_WIF="apcli00_0"
		SEC_APCLI_WIF="apcli01_0"
	elif [ "$TARGET_NIC_TYPE" = "GOBI" ]
	then
		PRI_WIF="ce00"
		SEC_WIF="ce01"
		PRI_APCLI_WIF="apcli00"
		SEC_APCLI_WIF="apcli01"
	fi

	$SUDOCMD ifconfig $PRI_WIF up
	$SUDOCMD iwpriv $PRI_WIF set upload_file:/sbin/config.sh,$(pwd)/config.sh

	if [ $? -ne 0 ]
	then
		echo ""
		echo "Communication with iNIC is down, please make sure of the following:"
		echo "-------------------------------------------------------------------"
		echo "1) iNIC power supply is connected"
		echo "2) 1 Gigabit Ethernet communication between host and iNIC is available"
		echo "3) run ./host_insmod.sh ethX (where X is the interface connected, ie 0,1,2..)"
		echo "4) run ./ce_host.sh"
		echo ""
		echo "Aborting.."
		exit
	fi

	BUILD_DIR=$inic_install_dir

	EN_DUALCONCURRENT=0
	if [ "$TARGET_CONCURRENT" = "y" ]
	then
		EN_DUALCONCURRENT=1
	fi
fi

############################################################
######################## COMPILATION FLAGS / MISC FLAGS #################

CHANGES_MADE=0

##### 5GHZ - ra0 ####
####################

## APCLI
TARGET_EN_APCLI_5=$(cat $(pwd)/config.sh | grep CONFIG_RT2860V2_AP_APCLI=y)
EN_APCLI_5=0
if [ -n "$TARGET_EN_APCLI_5" ]
then
	EN_APCLI_5=1
fi

### WDS
TARGET_EN_WDS_5=$(cat $(pwd)/config.sh | grep CONFIG_RT2860V2_AP_WDS=y)
EN_WDS_5=0
if [ -n "$TARGET_EN_WDS_5" ]
then
	EN_WDS_5=1
fi

####### 2.4Ghz - rai0 ###
##########################

## APCLI
TARGET_EN_APCLI_2_4=$(cat $(pwd)/config.sh | grep CONFIG_RT3090_AP_APCLI=y)
EN_APCLI_2_4=0
if [ -n "$TARGET_EN_APCLI_2_4" ]
then
	EN_APCLI_2_4=1
fi

### WDS
TARGET_EN_WDS_2_4=$(cat $(pwd)/config.sh | grep CONFIG_RT3090_AP_WDS=y)
EN_WDS_2_4=0
if [ -n "$TARGET_EN_WDS_2_4" ]
then
	EN_WDS_2_4=1
fi

## 2.4 Sta Mode ### (only for certification!!)
TARGET_STA_2_4=$(cat $(pwd)/config.sh | grep CONFIG_RT3090_STA=m)
STA_2_4=0
if [ -n "$TARGET_STA_2_4" ]
then
	STA_2_4=1
fi

#############################################################
#############################################################

if [ "$COMPRESSED_MODE" = "1" ]
then
	$SUDOCMD tar -zxvf inic_cmdr.tar.gz inic_cmdr_main.sh
fi

$SUDOCMD chmod 755 inic_cmdr_main.sh
. $(pwd)/inic_cmdr_main.sh

MainMenu

