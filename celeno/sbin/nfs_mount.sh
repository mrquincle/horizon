#! /bin/sh

conf="/etc/celeno.conf"

if [ -f $conf ]; then
    echo "Mounting NFS on /mnt/nfs"
    img_nfs_server_ip=`cat $conf | grep ^IMG_SERVER_IP_ADDR | cut -d= -f2 | /usr/bin/tr -d '\r'`
    img_nfs_server_path=`cat $conf | grep ^IMG_MOUNT_PATH_PREFIX | cut -d= -f2 | /usr/bin/tr -d '\r'`
    mount -t nfs ${img_nfs_server_ip}:${img_nfs_server_path} /mnt/nfs -o nolock
else
    echo "Can't mount NFS - no $conf file"
fi
