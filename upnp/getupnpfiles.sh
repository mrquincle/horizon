#!/bin/sh

ip=10.0.0.38
port=49152

# Uncomment file if you want to obtain it from your box
f=gatedesc.xml
f=gateconnSCPD.xml
f=gateicfgSCPD.xml


ip=10.0.0.39
port=49153
f=description0.xml
#f=player_rui_cds.xml
#f=RemoteUI1.xml #controlURL

echo "curl $ip:$port/$f > $f"
curl $ip:$port/$f > $f

cat $f

echo "This information is all known of course"


echo "You can download something like miranda: http://www.ethicalhacker.net/content/view/220/24/"
echo "msearch"
echo "host list"
echo "host get 0" # or any index that is appropriate in your case
echo "host details 0"
echo "host info 0"
echo "host info 0 deviceList"
echo "host send 0 RemoteUIServer RemoteUI GetCompatibleUIs"
