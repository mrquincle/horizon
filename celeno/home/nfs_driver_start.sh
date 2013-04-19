if [ -f "/home/nfs.conf" ]; then
    target_nfs_path=`cat /home/nfs.conf | grep ^TARGET_NFS_PATH | cut -d= -f2 | /usr/bin/tr -d '\r'`
    echo "Taking drivers from ${target_nfs_path}"
else
    echo "Can't mount NFS - no nfs.conf file present"
    exit 1
fi


if [ ! -f "${target_nfs_path}/rt2860v2_ap.ko" ]; then
    echo "Wlan driver is missing! Aborting."
    exit 1
fi


# celeno_init make_wireless_config rt2860

insmod ${target_nfs_path}/rt2860v2_ap.ko
ifconfig ra0 up

brctl addif br0 ra0
