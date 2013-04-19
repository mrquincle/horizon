#!/bin/sh
#
# $Id: config-igmpproxy.sh,v 1.8 2010-10-27 08:32:53 yy Exp $
#
# usage: config-igmpproxy.sh <wan_if_name> <lan_if_name>
#

. /sbin/global.sh

igmpproxy.sh $wan_ppp_if $lan_if
killall -q igmpproxy
igmpproxy

