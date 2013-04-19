#!/bin/sh

setup_sta_image()
{
    # what image we're going to send to STA ?
    if [ -e /dev/mtdpart/ClientImage ]; then
        uImage="/dev/mtdpart/ClientImage"
    else
        ActiveKernel=$( nvram_get uboot ActiveKernel )
        if [ -n "$ActiveKernel" -a -e "/dev/mtdpart/$ActiveKernel" ]; then
            uImage="/dev/mtdpart/$ActiveKernel"
        else
            uImage="/dev/mtdpart/Kernel"
        fi
    fi

    # check image integrity
    sw_update -v "$uImage" > /dev/null 2> /dev/null
    if [ $? -ne 0 ]; then
        # image is not valid---nothing to do
        return
    fi

    # check image type (should be generic on STA-only)
    image_type=$( dd if="$uImage" bs=1 skip=43 count=1 2> /dev/null )
    if [ "$image_type" != "G" -a "$image_type" != "S" ]; then
        # image is not applicable---nothing to do
        return
    fi

    echo "linking \"$uImage\" to /dev/STAImage"> /dev/console
    ln -fs "$uImage" /dev/STAImage
}

if [ -d /dev/mtdpart ]; then
    rm -f /dev/mtdpart/*
else
    mkdir /dev/mtdpart
fi

grep mtd /proc/mtd | (
    while read part size erasesize name; do
        part=`echo $part | sed 's/://'`
        name=`echo $name | sed 's/"//g'`
        if [ -e /dev/$part ]; then
            ln -s /dev/$part /dev/mtdpart/$name 
        else
            echo "mtdpart-setup.sh: can't map $name to $part" > /dev/console
        fi
    done
)

# Update U-Boot partitioning if it doesn't match Kernel partitioning
# Get U-Boot partitioning
uboot_layout=`nvram_get uboot mtdparts`
if [ -n "$uboot_layout" ]; then
    # Get Kernel partitioning
    kernel_layout=kernel_layout.txt
    echo -n "mtdparts=celeno-flash:" > "$kernel_layout"

    sed -n '2,${$d;p}' < /proc/mtd | while read -r line; do
        size=`echo $line | awk '{print "0x"$2}'`
        name=`echo $line | awk '{print $4}' | sed s/\"//g`
        size_in_kB=$((${size} / 1024))
        echo -n "${size_in_kB}k($name)," >> "$kernel_layout"
    done

    # Remove last comma
    sed -i 's/,$//' "$kernel_layout"

    if [ "`cat $kernel_layout`" != "$uboot_layout" ]; then
        echo "$0: updating U-Boot partitioning" > /dev/console
        cat "$kernel_layout" > /dev/console
        echo > /dev/console
        nvram_set uboot mtdparts "`cat $kernel_layout`"
    fi

    rm -f "$kernel_layout"
fi

setup_sta_image
