#! /bin/sh

if [ "$1" = "start" ]; then
	if [ ! -e /var/run/udpsvd-tftpd-69.pid ]; then
		echo "Starting tftpd"
		udpsvd -vE 0.0.0.0 69 tftpd /etc_ro/web/cgi-bin -c &
		echo $! > /var/run/udpsvd-tftpd-69.pid
	else
		echo "Starting tftpd---already running, nothing to do"
	fi
else
	if [ -e /var/run/udpsvd-tftpd-69.pid ]; then
		echo "Stoping tftpd"
		kill $( cat /var/run/udpsvd-tftpd-69.pid )
		rm -f /var/run/udpsvd-tftpd-69.pid
	else
		echo "Stoping tftpd---pid file is not found"
	fi
fi
