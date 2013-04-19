#! /bin/sh

insmod ip_tables.ko
insmod iptable_mangle.ko
insmod iptable_raw.ko
insmod nf_conntrack.ko
insmod nf_conntrack_ipv4.ko
insmod nf_conntrack_sip.ko sip_timeout=180
insmod ipt_TOS.ko
insmod xt_helper.ko
insmod xt_physdev.ko
insmod xt_conntrack.ko
insmod xt_DSCP.ko
insmod xt_NOTRACK.ko
# set timeouts
echo "30" > /proc/sys/net/netfilter/nf_conntrack_generic_timeout
echo "10" > /proc/sys/net/netfilter/nf_conntrack_icmp_timeout
echo "10" > /proc/sys/net/netfilter/nf_conntrack_tcp_loose
echo "10" > /proc/sys/net/netfilter/nf_conntrack_tcp_max_retrans
echo "10" > /proc/sys/net/netfilter/nf_conntrack_tcp_timeout_close
echo "10" > /proc/sys/net/netfilter/nf_conntrack_tcp_timeout_close_wait
echo "10" > /proc/sys/net/netfilter/nf_conntrack_tcp_timeout_established
echo "10" > /proc/sys/net/netfilter/nf_conntrack_tcp_timeout_fin_wait
echo "10" > /proc/sys/net/netfilter/nf_conntrack_tcp_timeout_last_ack
echo "10" > /proc/sys/net/netfilter/nf_conntrack_tcp_timeout_max_retrans
echo "10" > /proc/sys/net/netfilter/nf_conntrack_tcp_timeout_syn_recv
echo "10" > /proc/sys/net/netfilter/nf_conntrack_tcp_timeout_syn_sent
echo "10" > /proc/sys/net/netfilter/nf_conntrack_tcp_timeout_time_wait
# SIP
iptables -t mangle -A POSTROUTING -m physdev --physdev-out ra0 -p udp --dport 5060 -j DSCP --set-dscp 48
# RTP
iptables -t mangle -A POSTROUTING -m physdev --physdev-out ra0 -m helper --helper sip -j DSCP --set-dscp 40
# NOTRACK for TCP
iptables -t raw -A  PREROUTING -p tcp -j NOTRACK
iptables -t raw -A OUTPUT -p tcp -j NOTRACK
