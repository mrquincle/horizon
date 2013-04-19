#!/bin/sh

POWER_DOWN_MASK=0x0800
POWER_UP_MASK=0xf7ff
PROC_PHYADDR=/sys/module/raeth/parameters/g_cPhyAddr

phy1_addr=`cat $PROC_PHYADDR | awk -F',' '{print $1}'`
phy2_addr=`cat $PROC_PHYADDR | awk -F',' '{print $2}'`

is_debug_mode=$( nvram_get uboot dmode 2> /dev/null )
if [ "$is_debug_mode" = "1" ]; then
    output_dev="/dev/console"
else
    output_dev="/dev/null"
fi

echo "disabling PHY1 ..." > /dev/console
cntrl_reg=`mii_mgr -g -p $phy1_addr -r 0 | awk '{printf("0x%s", $4)'}`
let "cntrl_reg = ($cntrl_reg | $POWER_DOWN_MASK)"
mii_mgr -s -p $phy1_addr -r 0 -v `echo $cntrl_reg | awk '{printf("0x%x",$1)}'`  > $output_dev

echo "disabling PHY2 ..." > /dev/console
cntrl_reg=`mii_mgr -g -p $phy2_addr -r 0 | awk '{printf("0x%s", $4)'}`
let "cntrl_reg = ($cntrl_reg | $POWER_DOWN_MASK)"
mii_mgr -s -p $phy2_addr -r 0 -v `echo $cntrl_reg | awk '{printf("0x%x",$1)}'`  > $output_dev


if [ -n "$1" ] ; then
    sleep $1
fi

echo "enabling PHY1 ..." > /dev/console
cntrl_reg=`mii_mgr -g -p $phy1_addr -r 0 | awk '{printf("0x%s", $4)'}`
let "cntrl_reg = ($cntrl_reg & $POWER_UP_MASK)"
mii_mgr -s -p $phy1_addr -r 0 -v `echo $cntrl_reg | awk '{printf("0x%x",$1)}'`  > $output_dev

echo "enabling PHY2 ..." > /dev/console
cntrl_reg=`mii_mgr -g -p $phy2_addr -r 0 | awk '{printf("0x%s", $4)'}`
let "cntrl_reg = ($cntrl_reg & $POWER_UP_MASK)"
mii_mgr -s -p $phy2_addr -r 0 -v `echo $cntrl_reg | awk '{printf("0x%x",$1)}'`  > $output_dev
