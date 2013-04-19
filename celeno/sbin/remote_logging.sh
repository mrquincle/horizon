#!/bin/sh
 
# remote_logging.sh: perform backup of essential log files in FTP server


# wait for nvram_daemon to run
while [ 1 ]
do
    res=`ps | grep nvram_daemon | grep -v grep`
    if [ "$res" != "" ]; then
        break
    fi
    sleep 2
done

# check if remote logging is enabled (and mode is AP)
IsStaMode=`nvram_get ethConvert`
RemoteLogEnable=`nvram_get RemoteLogEnable`
if [ "$IsStaMode" == "1" -o "$RemoteLogEnable" == "0" ]; then
    echo "Remote logging is disabled."
    exit 0
fi

# create some varibales
MacAddr=`cemgr2 g Ra0_Mac_Addr | tail -n1 | sed -e 's/^.*\[//' -e 's/\]$//'` ## get and use 5.2 Ghz interface MAC addr even it is not enabled
FtpServer=`nvram_get RemoteLogFtpServerIp`
FtpServerFolder=`nvram_get RemoteLogFtpFolder`
FtpUsername=`nvram_get RemoteLogFtpUsername`
FtpPassword=`nvram_get RemoteLogFtpPassword`
LogIntervalMinutes=`nvram_get RemoteLogIntervalMinutes`
if [ -n "$LogIntervalMinutes" ]; then
    LogIntervalSeconds=$(($LogIntervalMinutes*60))
else
    echo "No LogIntervalSeconds"
    exit 1
fi

# print debug info
if [ 1 ]; then
    echo "Remote logging parameters:"
    echo "--------------------------"
    echo "FTP Server   : "$FtpServer
    echo "FTP Folder   : "$FtpServerFolder
    echo "FTP Username : "$FtpUsername
    echo "FTP Password : "$FtpPassword
    echo "Interval     : "$LogIntervalMinutes" Minutes"
fi

# add "/" to folder name if it is not empty
if [ "$FtpServerFolder" != "" ]; then
    FtpServerFolder=$FtpServerFolder"/"
fi

# sleep until first logging
sleep $LogIntervalSeconds

while [ 1 ]
do
    # build updated log file name 
    logTime=`date +%H-%M-%S"__"%F`;
    tarName=logs__"$MacAddr"__"$logTime".tar.gz

    # compress messages log file
    cd /etc_ro/web/cgi-bin ## change directory where important log file resides 
    tarfilelist=""
    pmLogName="$MacAddr"__"$logTime".log
    if [ -e "pmlog.txt" ]; then
        `cp pmlog.txt $pmLogName`
        tarfilelist="$pmLogName"
    fi
    if [ -e "pmlog.txt.0" ]; then
        `cp pmlog.txt.0 $pmLogName.old`
        tarfilelist="$tarfilelist $pmLogName".old
    fi
    `logread > celog.log`
    if [ -e "celog.log" ]; then
        tarfilelist="$tarfilelist celog.log"
    fi   
    `/bin/tar -czf $tarName $tarfilelist`
     
    # copy all compressed files to backup server
    `ftpput -u "$FtpUsername" -p "$FtpPassword" $FtpServer $FtpServerFolder$tarName $tarName`
    if [ "$?" == 1 ]; then
        for retry in 1 2
        do
            sleep 3
            `ftpput -u "$FtpUsername" -p "$FtpPassword" $FtpServer $FtpServerFolder$tarName $tarName`
            if [ "$?" == 0 ]; then
    	        break
            fi
        done
    fi
     
    # remove all temp files
    `rm -f $pmLogName`
    `rm -f $pmLogName.old`
    `rm -f celog.log`
    `rm -f $tarName`
    
    # sleep until next logging schedule
    sleep $LogIntervalSeconds
done

