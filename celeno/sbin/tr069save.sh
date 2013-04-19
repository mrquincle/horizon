#!/bin/sh

# usage: tr069save.sh [-f]

# __assumption__: $config is valid at invocation mode,
# because in usual workflow tr069restore.sh is called at startup,
# and will revert to factory default TR-069 configuration
# if current configuration is invalid.

config=""
is_mtd_part=""

write_config()
{
    tar -cz -C /etc tr069 > /tmp/TR069.tar.gz

    if [ "$is_mtd_part" == "1" ]; then
        mtd_write write /tmp/TR069.tar.gz $config > /dev/null 2> /dev/null
    else
        cp /tmp/TR069.tar.gz  $config
    fi

    rm -f /tmp/TR069.tar.gz
}

if [ ! -e /bin/tr069 ]; then exit 1; fi

rm -f /etc/tr069/*pwd* >/dev/null 2>/dev/null

if [ -e /mnt/jffs ]; then
    config="/mnt/jffs/TR069.tar.gz"
    is_mtd_part=0
elif [ -e /dev/mtdpart/TR069 ]; then
    config="/dev/mtdpart/TR069"
    is_mtd_part=1
else
    echo "warning: can't store TR-069 configuration" > /dev/console
    exit 1
fi

if [ "x"$1 == "x-f" ]; then
    echo "forcing config save ..."
    write_config
    exit 0
fi

start_credits=50
min_save_interval=3600
rm -rf /tmp/tr069 >/dev/null 2>/dev/null
mkdir /tmp/tr069
tar -xzf $config -C /tmp >/dev/null 2>/dev/null
ret=`diff -qr /tmp/tr069 /etc/tr069`
if [ x"$ret" != "x" ]; then
    # Credits check algorithm
    credits=`cat /tmp/tr069cr 2>/dev/null`
    if [ x"$credits" == "x" ]; then credits=$start_credits; fi
    timestamp=`cat /tmp/tr069ts 2>/dev/null`
    if [ x"$timestamp" == "x" ]; then timestamp=`date +%s` ; fi
    current=`date +%s`
    if [ $(( $current - $timestamp )) -gt $min_save_interval ]; then
        credits=$(( $credits + 1 ))
        timestamp=$current
    fi
    if [ $credits -gt 0 ]; then
        write_config
        credits=$(( $credits - 1 ))
    fi
    echo -n $credits >/tmp/tr069cr
    echo -n $timestamp >/tmp/tr069ts
fi
rm -rf /tmp/tr069 >/dev/null 2>/dev/null
exit 0
