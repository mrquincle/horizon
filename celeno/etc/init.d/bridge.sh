#!/bin/sh

start_br()
{
    brctl addbr br0

    #Remove forward delay to enable normal DHCP Client start
    echo 0 > /sys/class/net/br0/bridge/forward_delay

    ifconfig br0 0.0.0.0
}


stop_br()
{
    ifconfig br0 down
    brctl delbr br0
}
#-------------------------------------------------------------------------------

if [ "$#" = "1" ]; then
    case "$1" in
        "start")
            start_br
        ;;

        "stop")
            stop_br
        ;;

        *)
            echo "$0: unknown command \"$1\""
            exit 1
        ;;
    esac
fi

exit 0
