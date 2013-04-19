#! /bin/sh

if [ -f "/home/nfs.conf" ]; then
target_nfs_path=`cat /home/nfs.conf | grep ^TARGET_NFS_PATH | cut -d= -f2 | /usr/bin/tr -d '\r'`
nfs_server_ip=`cat /home/nfs.conf | grep ^NFS_SERVER_IP | cut -d= -f2 | /usr/bin/tr -d '\r'`
nfs_server_path=`cat /home/nfs.conf | grep ^NFS_SERVER_PATH | cut -d= -f2 | /usr/bin/tr -d '\r'`
echo "Mounting NFS on ${target_nfs_path}"
mount -t nfs ${nfs_server_ip}:${nfs_server_path} ${target_nfs_path} -o nolock
#echo "${target_nfs_path}/cedrv.ko:" >> /lib/modules/2.6.21/modules.dep
else
echo "Can't mount NFS - no nfs.conf file present"
fi
