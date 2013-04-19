#!/bin/sh
echo "ifconfig ra0 down"
ifconfig ra0 down
echo "/bin/celeno_init make_wireless_config 2860"
/bin/celeno_init make_wireless_config 2860
echo "ifconfig ra0 up"
ifconfig ra0 up