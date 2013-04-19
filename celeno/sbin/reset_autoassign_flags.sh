#!/bin/sh

is_sta_mode="`nvram_get ethConvert`"
if [ "$is_sta_mode" = "1" ]; then
	echo "Clearing automatically assigned static IP in u-boot"
	nvram_set uboot IPAutoAssignDone 0
	nvram_set uboot IPAutoAssignAddress ""
else
	echo "Erasing IPAutoAssign table"
	rm -f /mnt/jffs/ip_autoassign_table
	rm -f /var/run/ip_autoassign_table
fi

