#!/bin/sh

if [ ! -e /bin/tr069 ]; then exit 1; fi
config=""


if [ -e /mnt/jffs ]; then
    config="/mnt/jffs/TR069.tar.gz"
elif [ -e /dev/mtdpart/TR069 ]; then
    config="/dev/mtdpart/TR069"
else
    echo "warning: can't load TR-069 configuration" > /dev/console
    exit 1
fi
tr069_writeconfig() {
    TR069DM=`nvram_get $PLATFORM TR069DM`
    if [ "$TR069DM" == "TR098" ] ; then
        cp -f /etc_ro/tr069/tr.xml /etc_ro/tr069/tr.conf /etc/tr069
    else
        cp -f /etc_ro/tr069/tr106.xml /etc/tr069/tr.xml
        cp -f /etc_ro/tr069/tr106.conf /etc/tr069/tr.conf
    fi
    TR069OUI=`nvram_get $PLATFORM TR069OUI`
    if [ -n "$TR069OUI" ]; then
        sed -i "s/001C51/$TR069OUI/g" /etc/tr069/tr.conf
    fi
    TR069VA=`nvram_get $PLATFORM TR069VA`
    if [ -n "$TR069VA" ]; then
        sed -i "s/001C51/$TR069VA/g" /etc/tr069/tr.xml
    fi
}
# Do not overwrite active config if credits==0
credits=`cat /tmp/tr069cr 2>/dev/null`
if [ x"$credits" == "x" ]; then credits=1; fi
if [ "$credits" == "0" ]; then exit 0; fi
tar -xzf $config -C /etc > /dev/null 2> /dev/null
if [ $? -ne 0 ]; then
    echo "TR-069: applying factory default configuration" > /dev/console
    echo "reason: current configuration is broken" > /dev/console
    cp -r /etc_ro/tr069/ /etc/
    rm -f /etc/tr069/libdev.so /etc/tr069/client.key /etc/tr069/client.crt /etc/tr069/ca.pem /etc/tr069/tr106.xml /etc/tr069/tr106.conf
    rm -f /etc/tr069/*pwd* >/dev/null 2>/dev/null
    tr069_writeconfig
    tr069save.sh -f
fi
rm -f /etc/tr069/*pwd* >/dev/null 2>/dev/null

exit 0
