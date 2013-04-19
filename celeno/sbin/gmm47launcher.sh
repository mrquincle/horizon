#!/bin/sh
sleep 1
gmm_running=`ps | grep /sbin/gmm47.sh | grep -v grep`
if [ "$gmm_running" != "" -o -e "/tmp/gmmlauncherrun" ]; then
	 echo driver requested gmm launch - gmm is already running
else
	/sbin/gmm47.sh &
fi                                        

