if [ -f "/home/nfs.conf" ]; then
    target_nfs_path=`cat /home/nfs.conf | grep ^TARGET_NFS_PATH | cut -d= -f2 | tr -d '\r'`
fi

if [ -f "${target_nfs_path}/cedrv.ko" ]; then
    echo "Starting cedrv from nfs path: ${target_nfs_path}"
    insmod ${target_nfs_path}/cedrv.ko
else
    echo "Starting cedrv from its default location"
    insmod cedrv.ko
fi

brctl addif br0 ra0

udpsvd -vE 0.0.0.0 70 tftpd / &

# init celeno driver (AP mode)
/home/apinit.sh
