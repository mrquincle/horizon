#!/bin/sh

. /sbin/config.sh
. /sbin/eeprom_config.sh


UBOOT_CONFIG_MTD=/dev/mtd1
PARAM_RAETH_DIR=/sys/module/raeth/parameters
PARAM_PHYADDR=$PARAM_RAETH_DIR/g_cPhyAddr
PARAM_MANUAL_RESTART=$PARAM_RAETH_DIR/g_Manual_Restart
PARAM_IS_RGMII=$PARAM_RAETH_DIR/g_iIs_RGMII
PARAM_SPEED=$PARAM_RAETH_DIR/g_iLinkSpeed
PARAM_DUPLEX=$PARAM_RAETH_DIR/g_iLink_duplex
PARAM_PAUSE_RECEIVE=$PARAM_RAETH_DIR/g_iLink_pause_receive
PARAM_PAUSE_TRANSMIT=$PARAM_RAETH_DIR/g_iLink_pause_transmit
PARAM_ETHERNET_PORT=$PARAM_RAETH_DIR/g_iEthernetPort

DEFAULT_PHY_1_ADDR=7
DEFAULT_PHY_2_ADDR=15
DEFAULT_PHY_SPEED=0
DEFAULT_PHY_DUPLEX=-1
DEFAULT_PHY_PAUSE=0

phy1_addr=$DEFAULT_PHY_1_ADDR
phy2_addr=$DEFAULT_PHY_2_ADDR

#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: as is (SDK 3.5.2 merge)
# This routine returns:
# EthPhy1Addr
# EthPhy2Addr
# EthPhy1Interface
# EthPhy2Interface
# EthPhy1Speed
# EthPhy1Duplex
# EthPhy1Pause
# EthPhy2Speed
# EthPhy2Duplex
# EthPhy2Pause
detectEthParams()
{
    EEPROM_SHOW_TMP=/tmp/eeprom_params
    EthFromEeprom="n"
    EthPhy1Addr=$DEFAULT_PHY_1_ADDR
    EthPhy2Addr=$DEFAULT_PHY_2_ADDR
    EthPhy1Speed=$DEFAULT_PHY_SPEED
    EthPhy1Duplex=$DEFAULT_PHY_DUPLEX
    EthPhy1Pause=$DEFAULT_PHY_PAUSE
    EthPhy2Speed=$DEFAULT_PHY_SPEED
    EthPhy2Duplex=$DEFAULT_PHY_DUPLEX
    EthPhy2Pause=$DEFAULT_PHY_PAUSE

    eeprom_read_hex16 $EEPROM_CELENO_MAGIC_ADDR
    EpromMagic="$eeprom_val"

    eeprom_read_dec16 $EEPROM_VERSION_ADDR
    EpromVersion="$eeprom_val"

    if [ -n $EpromMagic -a "$EpromMagic" == "CECE" ]; then
        if [ "$EpromVersion" -gt "3" ]; then
            EthFromEeprom="y"

            eeprom_read_dec8 $EEPROM_ETH_PHY1_ADDR
            EthPhy1Addr="$eeprom_val"

            eeprom_read_dec8 $EEPROM_ETH_PHY2_ADDR
            EthPhy2Addr="$eeprom_val"

            eeprom_read_hex8 $EEPROM_ETH_PHY1_MODE
            phy1mode="0x$eeprom_val"
            eeprom_parse_phy_mode $phy1mode
            EthPhy1Interface=$interface
            EthPhy1Speed=$speed
            EthPhy1Duplex=$duplex
            EthPhy1Pause=$pause

            eeprom_read_hex8 $EEPROM_ETH_PHY2_MODE
            phy2mode="0x$eeprom_val"
            eeprom_parse_phy_mode $phy2mode

            EthPhy2Interface=$interface
            EthPhy2Speed=$speed
            EthPhy2Duplex=$duplex
            EthPhy2Pause=$pause
        fi
    fi
}

addBr0Eth3()
{
    if [ "$CONFIG_CELENO_INIC_MODE" = "y" ]; then
        has_second_phy="n"
    else
        has_second_phy=`mii_mgr -g -p $phy2_addr -r 1 | awk '("ffff" != $4){print "y"}'`
    fi

    if [ "$has_second_phy" == "y" ] ; then
        HasOwnBridge
        if [ $? -eq 1 ]; then
            brctl addif br1 eth3
        else
            brctl addif br0 eth3
        fi
    fi
}

overridParamsFromBootstrap()
{
    local chip_mode=`cat /proc/rt3883/chip_mode`

    if [ "$chip_mode" == "iNIC-MII" -o "$chip_mode" == "iNIC-RVMII" ]; then
        EthPhy1Interface="mii"
        EthPhy1Speed="100M"
        EthPhy1Duplex="full"
        EthPhy1Pause="none"
    elif [ "$chip_mode" == "iNIC-RGMII" ]; then
        EthPhy1Interface="rgmii"
        EthPhy1Speed="1G"
        EthPhy1Duplex="full"
        EthPhy1Pause="none"
    fi
}

configEth()
{
    detectEthParams
    overridParamsFromBootstrap
    echo "configEth: EthFromEeprom=$EthFromEeprom"
    if [ "$EthFromEeprom" == "y" ]; then
        phy1_addr=$EthPhy1Addr
        phy2_addr=$EthPhy2Addr
    else
        if [ "$CONFIG_CELENO_INIC_MODE" = "y" ]; then
            echo "configEth: INIC MODE - no uboot params"
        else
            uboot_phy1=`cat $UBOOT_CONFIG_MTD | grep "PHY1ADDR" | awk -F'=' '{print $2}'`
            uboot_phy2=`cat $UBOOT_CONFIG_MTD | grep "PHY2ADDR" | awk -F'=' '{print $2}'`
        fi

        if [ -n "$uboot_phy1" ]; then
            phy1_addr=$uboot_phy1
        fi

        if [ -n "$uboot_phy2" ]; then
            phy2_addr=$uboot_phy2
        fi
    fi

    echo "PHY1=$phy1_addr PHY2=$phy2_addr"
    echo "$phy1_addr","$phy2_addr" > $PARAM_PHYADDR

    ifconfig eth2 0.0.0.0

    if [ "$EthFromEeprom" == "y" ]; then
        if [ "$EthPhy2Interface" != "$EEPROM_NOT_AVAIL_STR" ]; then
           ifconfig eth3 0.0.0.0
        fi

        if [ "$EthPhy1Interface" == "rgmii" ]; then
            isRgmii1=1
        elif [ "$EthPhy1Interface" == "mii" ]; then
            isRgmii1=0
        else
            echo "Bad PHY1 interface $EthPhy1Interface"
            isRgmii1=-1
        fi

        if [ "$EthPhy2Interface" == "rgmii" ]; then
            isRgmii2=1
        elif [ "$EthPhy2Interface" == "mii" ]; then
            isRgmii2=0
        else
            echo "Bad PHY2 interface $EthPhy2Interface"
            isRgmii2=-1
        fi

        echo "$isRgmii1,$isRgmii2" > $PARAM_IS_RGMII

        if [ "$EthPhy1Speed" != "auto"  -a "$EthPhy1Interface" != "$EEPROM_NOT_AVAIL_STR" ]; then
            Phy2Speed=`cat $PARAM_SPEED | awk -F',' '{print $2}'`
            if [ "$EthPhy1Speed" == "10M" ]; then
                Phy1Speed=10
            elif [ "$EthPhy1Speed" == "100M" ]; then
                Phy1Speed=100
            elif [ "$EthPhy1Speed" == "1G" ]; then
                Phy1Speed=1000
            else
                echo "Bad PHY1 speed $EthPhy1Speed"
                Phy1Speed=-1
            fi
            echo "$Phy1Speed,$Phy2Speed" > $PARAM_SPEED

            Phy2Duplex=`cat $PARAM_DUPLEX | awk -F',' '{print $2}'`
            if [ "$EthPhy1Duplex" == "half" ]; then
                Phy1Duplex=0
            elif [ "$EthPhy1Duplex" == "full" ]; then
                Phy1Duplex=1
            else
                echo "Bad PHY1 duplex $EthPhy1Speed"
                Phy1Duplex=-1
            fi
            echo "$Phy1Duplex,$Phy2Duplex" > $PARAM_DUPLEX

            Phy2PauseReceive=`cat $PARAM_PAUSE_RECEIVE | awk -F',' '{print $2}'`
            if [ "$EthPhy1Pause" == "r" -o "$EthPhy1Pause" == "rt" -o "$EthPhy1Pause" == "tr" ]; then
                Phy1PauseReceive=1
            elif [ "$EthPhy1Pause" == "t"  -o "$EthPhy1Pause" == "none" ]; then
                Phy1PauseReceive=0
            else
                echo "Bad PHY1 pause $EthPhy1Pause"
                Phy1PauseReceive=-1
            fi
            echo "$Phy1PauseReceive,$Phy2PauseReceive" > $PARAM_PAUSE_RECEIVE

            Phy2PauseTransmit=`cat $PARAM_PAUSE_TRANSMIT | awk -F',' '{print $2}'`
            if [ "$EthPhy1Pause" == "t" -o "$EthPhy1Pause" == "rt" -o "$EthPhy1Pause" == "tr" ]; then
                Phy1PauseTransmit=1
            elif [ "$EthPhy1Pause" == "r"  -o "$EthPhy1Pause" == "none" ]; then
                Phy1PauseTransmit=0
            else
                Phy1PauseTransmit=-1
            fi
            echo "$Phy1PauseTransmit,$Phy2PauseTransmit" > $PARAM_PAUSE_TRANSMIT

            Phy2ManRestart=`cat $PARAM_MANUAL_RESTART | awk -F',' '{print $2}'`
            echo "2, $Phy2ManRestart" > $PARAM_MANUAL_RESTART
            # TBD pause
        fi

        if [ "$EthPhy2Speed" != "auto" -a "$EthPhy2Interface" != "$EEPROM_NOT_AVAIL_STR" ]; then
            Phy1Speed=`cat $PARAM_SPEED | awk -F',' '{print $1}'`
            if [ "$EthPhy2Speed" == "10M" ]; then
                Phy2Speed=10
            elif [ "$EthPhy2Speed" == "100M" ]; then
                Phy2Speed=100
            elif [ "$EthPhy2Speed" == "1G" ]; then
                Phy2Speed=1000
            else
                echo "Bad PHY2 speed $EthPhySpeed"
                Phy2Speed=-1
            fi
            echo "$Phy1Speed,$Phy2Speed" > $PARAM_SPEED

            Phy1Duplex=`cat $PARAM_DUPLEX | awk -F',' '{print $1}'`
            if [ "$EthPhy2Duplex" == "half" ]; then
                Phy2Duplex=0
            elif [ "$EthPhy2Duplex" == "full" ]; then
                Phy2Duplex=1
            else
                echo "Bad PHY2 duplex $EthPhy2Speed"
                Phy2Duplex=-1
            fi
            echo "$Phy1Duplex,$Phy2Duplex" > $PARAM_DUPLEX

            Phy1PauseReceive=`cat $PARAM_PAUSE_RECEIVE | awk -F',' '{print $1}'`
            if [ "$EthPhy2Pause" == "r" -o "$EthPhy2Pause" == "rt" -o "$EthPhy2Pause" == "tr" ]; then
                Phy2PauseReceive=1
            elif [ "$EthPhy2Pause" == "t"  -o "$EthPhy2Pause" == "none" ]; then
                Phy2PauseReceive=0
            else
                echo "Bad PHY2 pause $EthPhy2Pause"
                Phy2PauseReceive=-1
            fi
            echo "$Phy1PauseReceive,$Phy2PauseReceive" > $PARAM_PAUSE_RECEIVE

            Phy1PauseTransmit=`cat $PARAM_PAUSE_TRANSMIT | awk -F',' '{print $1}'`
            if [ "$EthPhy2Pause" == "t" -o "$EthPhy2Pause" == "rt" -o "$EthPhy2Pause" == "tr" ]; then
                Phy2PauseTransmit=1
            elif [ "$EthPhy2Pause" == "r" -o "$EthPhy2Pause" == "none" ]; then
                Phy2PauseTransmit=0
            else
                Phy2PauseTransmit=-1
            fi
            echo "$Phy1PauseTransmit,$Phy2PauseTransmit" > $PARAM_PAUSE_TRANSMIT

            Phy1ManRestart=`cat $PARAM_MANUAL_RESTART | awk -F',' '{print $1}'`
            echo "$Phy1ManRestart,2" > $PARAM_MANUAL_RESTART
        fi
    else
        if [ "$CONFIG_CELENO_INIC_MODE" = "y" ]; then
            has_second_phy="n"
        else
            has_second_phy=`mii_mgr -g -p $phy2_addr -r 1 | awk '("ffff" != $4){print "y"}'`
        fi
        if [ "$has_second_phy" == "y" ]; then
           ifconfig eth3 0.0.0.0
        fi
    fi
}

HasOwnBridge()
{
#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: (SDK 3.5.2 merge)
# This script was adjusted according to Celeno networking demands
# and was heavily changed from original 3.5.2 SDK.
#
    if [ "$CONFIG_CONFIG_WLAN_DUAL_CONCURRENT" != "y" ]; then
        return 0
    fi

    local HasOwnBridge=`celeno_init show rtdev | awk -F= '($1 == "HasOwnBridge"){print $2; exit}' 2> /dev/null`
    if [ "$HasOwnBridge" == "1" ]; then
        return 1
    else
        return 0
    fi
}

add_interfaces_to_br()
{
    sleep 2
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
        if [ "$CONFIG_CELENO_INIC_MODE" = "y" ]; then
            has_second_phy="n"
        else
            has_second_phy=`mii_mgr -g -p $phy2_addr -r 1 | awk '("ffff" != $4){print "y"}'`
        fi

        if [ "$has_second_phy" == "y" ] ; then
            HasOwnBridge
            if [ $? -eq 1 ]; then
                brctl addif br1 eth3
            else
                brctl addif br0 eth3
            fi
        fi
    fi
    sleep 2
}
#------------------------------------------------------------------------------

if [ "$( nvram_get 2860 EthernetPortMode )" = "0" ]; then
    echo "configuring Ethernet to 1000M"
    insmod -q raeth g_iEthernetPort=0
else
    echo "configuring Ethernet to 100M"
    insmod -q raeth g_iEthernetPort=1
fi

configEth
add_interfaces_to_br

phyaddr=`cat $PARAM_PHYADDR`
manual=`cat $PARAM_MANUAL_RESTART`
iface=`cat $PARAM_IS_RGMII`
spd=`cat $PARAM_SPEED`
dpx=`cat $PARAM_DUPLEX`
pause_rx=`cat $PARAM_PAUSE_RECEIVE`
pause_tx=`cat $PARAM_PAUSE_TRANSMIT`
ethport=`cat $PARAM_ETHERNET_PORT`

echo "8888888888888888888888888888888888888888888888888888888888888888888888888"
echo "phyaddr=($phyaddr),manual=($manual),iface=($iface),spd=($spd),dpx=($dpx)"
echo "pause_rx=($pause_rx),pause_tx=($pause_tx),ethport=($ethport)"
echo "8888888888888888888888888888888888888888888888888888888888888888888888888"