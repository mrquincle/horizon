#!/bin/sh

CONF_FILE=/etc/watchdog.conf
#PROTOCOL_FILE=/etc/protocols

#if [ ! -n "$2" ]; then
#  echo "insufficient arguments!"
#  echo "Usage: $0 <ping ip> <out_if>"
#  echo "Example: $0 10.10.10.3 eth2.1"
#  exit 0
#fi

#PING_IP="$1"
#PING_IF="$2"

#generate /etc/protocols
#echo "icmp  1  ICMP  # internet control message protocol" >> $PROTOCOL_FILE

#echo "ping  = $PING_IP" > $CONF_FILE
#echo "interface = $PING_IF" >> $CONF_FILE
echo "file  = /var/log/messages"  >> $CONF_FILE
echo "change  = 1407"  >> $CONF_FILE

# Uncomment to enable test. Setting one of these values to '0' disables it.
# These values will hopefully never reboot your machine during normal use
# (if your machine is really hung, the loadavg will go much higher than 25)
echo "max-load-1  = 24" >>  $CONF_FILE
echo "max-load-5  = 18" >>  $CONF_FILE
echo "max-load-15 = 12" >>  $CONF_FILE

# Note that this is the number of pages!
# To get the real size, check how large the pagesize is on your machine.
echo "min-memory  = 1" >> $CONF_FILE
echo "watchdog-device = /dev/watchdog"  >> $CONF_FILE

# This greatly decreases the chance that watchdog won't be scheduled before
# your machine is really loaded
echo "realtime = yes" >>  $CONF_FILE
echo "priority = 1" >> $CONF_FILE
