#!/bin/sh

. /sbin/global.sh

# check param
media_state=$1
if [ "$media_state" != "linkup" -a "$media_state" != "linkdown" ]; then
    echo -en "\nmedia_change.sh: Illegal media state [$media_state]!!!\n\n" > /dev/console
    exit
fi

# if load mode = production mode, exit
EEPROM_MAGIC_ADDR=350
EEPROM_LOAD_MODE_ADDR=35A
eeprom_magic=`iwpriv ra0 e2p $EEPROM_MAGIC_ADDR | grep ]: | cut -b12-15`
if [ "$eeprom_magic" == "CECE" ]; then
    load_mode=`iwpriv ra0 e2p $EEPROM_LOAD_MODE_ADDR | grep ]: | cut -b12-15`
    if [ "$load_mode" == "0000" ]; then
        echo "Production mode: DHCP is disabled" > /dev/console
        exit
    fi
fi

# Create new task group, if not already a group leader.
# We need it, because when started from withing kernel,
# pgid == 1, and kill -TERM $pgid will effectively kill init.
setpgrp > /dev/null
pgidfile="/var/run/media_change.pid"

# make sure that this instance is the only one.
# this implementation is subject to race conditions,
# but there is no way to implement proper locking
# from within root account.
#
# proper implementation is:
# until (umask 222; echo $pgid > $pgidfile) 2> /dev/null; do
# 	sleep 1
# done
#
# as far as this dumb device has only one user --- root --- let's live with bug ...
if [ -f $pgidfile ]; then 
	/bin/kill -TERM -`cat $pgidfile` > /dev/null 2> /dev/null
	rm -f $pgidfile
fi

# store pgid in order to give next invocation ability to kill entire process group
getpgrp > $pgidfile

# debug flag (set it to 1 for debug prints)
debug_mode=0
if [ "$debug_mode" == "1" ]; then
    output_dev="/dev/console"
    echo "Media state changed: $media_state"
else
    output_dev="/dev/null"
fi

# read params from nvram
is_sta_mode=`nvram_get 2860 ethConvert`
dhcp_enable=`nvram_get 2860 dhcpClientEnabled`
upnp_enable=`nvram_get 2860 UpnpEnable`
base_port=`nvram_get 2860 UpnpBasePort`
ddns_enabled=`nvram_get 2860 DDNSEnabled`
ddns_host=`nvram_get 2860 DDNS`
ddns_login=`nvram_get 2860 DDNSAccount`
ddns_password=`nvram_get 2860 DDNSPassword`

if [ "$is_sta_mode" == "0" ]; then
    #--------------- AP ----------------
    # Link UP   : Do DHCP , UPnP , NTP
    # Link DOWN : Do nothing
    #-----------------------------------
    if [ "$media_state" == "linkup" ]; then
        # dhcp
        if [ "$dhcp_enable" == "1" ]; then
            killall -q udhcpc
            echo "AP - Start DHCP proccess" > $output_dev
            inetDynamicConfig
            echo "AP - Finish DHCP proccess" > $output_dev
        fi
        8021x.sh

        # upnp
        if [ "$upnp_enable" == "1" ]; then
            echo "AP - Start UPnP proccess" > $output_dev
            upnpc.sh "br0" 0 $base_port
            echo "AP - Finish UPnP proccess" > $output_dev
        fi

        # ntp
        ntp.sh
    fi
else
    #--------------- STA ---------------
    # Link UP   : Do DHCP , UPnP , NTP
    # Link DOWN : Set static IP
    #-----------------------------------

    # restart ethernet phy to fix the MRDVR menus issue (linkup only)
    if [ "$media_state" = "linkup" ]; then
        if [ "$( nvram_get RestartEthOnAssocEnable )" = "1" ]; then
            /sbin/link_down.sh "$( nvram_get RestartEthOnAssocDelay )"
        fi
    fi

    # dhcp
    if [ "$dhcp_enable" == "1" ]; then
        if [ "$media_state" == "linkup" ]; then
            killall -q udhcpc
            echo "STA - Start DHCP proccess" > $output_dev
            inetDynamicConfig
            echo "STA - Finish DHCP proccess" > $output_dev
        elif [ "$media_state" == "linkdown" ]; then
            echo "STA - Set static IP" > $output_dev
            inetStaticConfig
        fi
    fi

    if [ "$media_state" == "linkup" ]; then
        # upnp
        if [ "$upnp_enable" == "1" ]; then
            echo "STA - Start UPnP proccess" > $output_dev
            upnpc.sh "br0" 1 $base_port
            echo "STA - Finish UPnP proccess" > $output_dev
        fi

        # ntp
        ntp.sh
    fi
fi

# waking-up tr069
sleep 10
killall -q -USR1 tr069

# dyndns
if [ "$ddns_enabled" == "1" ]; then
    echo "setting up DNS alias $ddns_host"
    echo \
"username $ddns_login
password $ddns_password
alias $ddns_host
background" > /etc/inadyn.conf
    inadyn
fi

# remove pgid file
rm -f $pgidfile

