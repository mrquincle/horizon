#!/bin/sh

# udhcpc script edited by Tim Riker <Tim@Rikers.org>

[ -z "$1" ] && echo "Error: should be called from udhcpc" && exit 1

RESOLV_CONF="/etc/resolv.conf"
#------------------------------------------------------------------------------
# CELENO-FIX / Benson, 17-04-2011
# Description: as is (SDK 3.5.2 merge)
#
ADD_DNS="8.8.4.4 8.8.8.8"
[ -n "$broadcast" ] && BROADCAST="broadcast $broadcast"
[ -n "$subnet" ] && NETMASK="netmask $subnet"

case "$1" in
    deconfig)
        ;;

    renew|bound)
        /sbin/ifconfig $interface 0.0.0.0
        /sbin/ifconfig $interface $ip $BROADCAST $NETMASK

        if [ -n "$router" ] ; then
            echo "deleting routers"
			#------------------------------------------------------------------------------
			# CELENO-FIX / Benson, 17-04-2011
			# Description: as is (SDK 3.5.2 merge)
			#
			#while route del default gw 0.0.0.0 dev $interface ; do
            while route del default gw 0.0.0.0 dev $interface 2> /dev/null ; do
                :
            done

            metric=0
            for i in $router ; do
                metric=`expr $metric + 1`
                route add default gw $i dev $interface metric $metric
            done
        fi

        echo -n > $RESOLV_CONF
        [ -n "$domain" ] && echo search $domain >> $RESOLV_CONF
		#------------------------------------------------------------------------------
		# CELENO-FIX / Benson, 17-04-2011
		# Description: as is (SDK 3.5.2 merge)
		#		
        for i in $dns $ADD_DNS; do
            echo adding DNS $i
            echo nameserver $i >> $RESOLV_CONF
        done
		#------------------------------------------------------------------------------
		# CELENO-FIX / Benson, 17-04-2011
		# Description: as is (SDK 3.5.2 merge)
		#
		
		# notify goahead when the WAN IP has been acquired. --yy
		#killall -SIGTSTP goahead

		# restart igmpproxy daemon
		#config-igmpproxy.sh

        (
            net_mask=`echo $NETMASK | cut -d' ' -f2`
            if [ "x"$router != "x" ]; then
                echo -e "\nNetwork configuration (dynamic): Ip[$ip] Mask[$net_mask] Gw[$router] LeaseTime[$lease]"
            else
                echo -e "\nNetwork configuration (dynamic): Ip[$ip] Mask[$net_mask] LeaseTime[$lease]"
            fi
            echo
        ) > /dev/console
		#------------------------------------------------------------------------------		
        ;;
esac

exit 0

