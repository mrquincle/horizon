#!/bin/sh
cd /etc_ro/web/cgi-bin ## change directory where important log file resides
touch celog.txt
touch stats.txt
touch systeminfo.txt
touch rawlog.txt
touch ce_error.txt
killall logread
logread > /etc_ro/web/cgi-bin/rawlog.txt
#statistics file
echo "[CELENO DRIVER STATISTICS]" > /etc_ro/web/cgi-bin/stats.txt
#redirecting logread to stats.txt
logread -fc 1>stats.txt &
sm -d 0 
sleep 1 
sm -d 0 
plt -d 
plt -h 
plt -s 
cb -a 
gtw -d 
sched -d 0 
sta_used=`iwpriv ra0 show sta_used | sed 1d`

for i in 0 1 2 3 4 5 6 7
do
 sta_current=`echo $sta_used | cut -c1-1`
 sta_used=`echo $sta_used | cut -c3-`
 if [ "$sta_current" == 1 ]; then
    sched -k $i
    sleep 1
    rateadp -s $i 15
    sleep 1
    learn -s $i 15
    sleep 1
 fi
done
sleep 2
rateadp -d 
learn -d 
sleep 1
interf -d
chsel -d
ba -d  
ba -h  
cat /proc/cwto_stats 
sleep 5
#killing the logread -f 
killall logread
#system info file
echo "[*********************SYSTEM INFORMATION*********************]" >> systeminfo.txt
echo "[LINUX  VERSION]" >> systeminfo.txt
cat /proc/version  >> systeminfo.txt
echo "[CELENO VERSION]" >> systeminfo.txt
/etc/profile  >> systeminfo.txt
echo "[LAN CONFIGURATION]" >> systeminfo.txt
ifconfig  >> systeminfo.txt
echo "[WIRELESS CONFIGURATION]" >> systeminfo.txt
iwconfig  >> systeminfo.txt
echo "[IGMP INFO]" >> systeminfo.txt
iwpriv ra0 show igmpinfo  >> systeminfo.txt
echo "[WDS Table]" >> systeminfo.txt
iwpriv ra0 show WdsTable >> systeminfo.txt
echo "[EEPROM IMAGE]"  >> systeminfo.txt
cemgr.sh eeprom_show  >> systeminfo.txt
echo "[NVRAM IMAGE]"  >> systeminfo.txt
cemgr.sh nvram_show  >> systeminfo.txt
celeno_init show ce_error > ce_error.txt

if [ -e pmlog.txt ]; then
    tar -czv stats.txt rawlog.txt systeminfo.txt celog.txt ce_error.txt pmlog.txt
else
    tar -czv stats.txt rawlog.txt systeminfo.txt celog.txt ce_error.txt
fi

rm ce_error.txt
rm systeminfo.txt
rm stats.txt
rm rawlog.txt
logread -fc 1>/dev/ttyS1 &
# end


