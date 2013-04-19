#
# usage: upnpc.sh <lan_if> <ip_addr> <AP/STA>
#
# We assume that a default gw is already present (by DHCP process) - if not we must 
# add the GW lan address to our routing table (as def gw)

Status_file=/tmp/upnpc.stat
External_port_base=$3
External_port_base=$3
STA_Telnet_port_base=100
STA_TR069_port_base=200
Internal_Ip=`ifconfig $1 | grep inet | cut -d: -f2 | cut -d' ' -f 1`
TR069useUpnp="`nvram_get TR069useUpnp`"
TR069Enable="`nvram_get TR069Enable`"
upnp_web_stat=/tmp/web_upnp.stat
TR069_stat=/tmp/tr069upnp.stat
set_ext_web_port()
{
        rm -f "$upnp_web_stat"
	for port in 0 1 2 3 4 5 6 7 8 9 10 11
	do
		ext_port=$((External_port_base + ($port*10)))
		upnpc-static -a $Internal_Ip 80 $ext_port TCP > $Status_file
		success=`cat $Status_file | grep Successfuly`
		if [ "$success" = "Port Mapping process ended Successfuly" ]; then
                        echo -n $ext_port> "$upnp_web_stat"
			echo "Successfuly maped external port $ext_port for web service" > /dev/console
			break
		fi
	done
		
}

set_ext_telnet_port()
{
	for port in 0 1 2 3 4 5 6 7 8 9 10 11
	do
		ext_port=$((External_port_base + ($port*10) + $STA_Telnet_port_base))
		upnpc-static -a $Internal_Ip 23 $ext_port TCP > $Status_file
		success=`cat $Status_file | grep Successfuly`
		if [ "$success" = "Port Mapping process ended Successfuly" ]; then
			echo "Successfuly maped external port $ext_port for telnet service" > /dev/console
			break
		fi
	done
}

set_ext_tr069_port()
{
        rm -f "$TR069_stat"
	for port in 0 1 2 3 4 5 6 7 8 9 10 11
	do
		tr069_ext_port=$((External_port_base + ($port*10) + $STA_TR069_port_base))
		upnpc-static -a $Internal_Ip 7547 $tr069_ext_port TCP > $Status_file
		success=`cat $Status_file | grep Successfuly`
		if [ "$success" = "Port Mapping process ended Successfuly" ]; then
                        echo -n $tr069_ext_port > "$TR069_stat"
			echo "Successfuly maped external port $tr069_ext_port for TR-069 service" > /dev/console
			break
		fi
	done
}

# Add route for SSDP multicast discover packets
route add -net 239.0.0.0 netmask 255.0.0.0 dev $1

# run the upnpc to check status (output to a file)
upnpc-static -s > $Status_file

#test to see if we have a Upnp GW present
IGD_present=`cat $Status_file | grep IGD`
if [ "$IGD_present" = "No IGD UPnP Device found on the network !" ]; then
echo $IGD_present
exit 0
elif [ "$IGD_present" = "No valid UPNP Internet Gateway Device found." ]; then
echo $IGD_present
exit 0
fi

#test to see if we have a Upnp GW connected
IGD_status=`cat $Status_file | grep Status | cut -d, -f1`
echo "Checking IGD status..."
if [ "$IGD_status" = "Status : Connected" ]; then
echo $IGD_status
else
echo $IGD_status
exit 0
fi

set_ext_web_port
set_ext_telnet_port
if [ x"$TR069useUpnp" == "x1" ] && [ x"$TR069Enable" == "x1" ] ; then
    set_ext_tr069_port
fi

