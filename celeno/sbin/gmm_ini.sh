#Celeno gmm config file:
#All keys should be written in the format <key=value>, with no spaces!


# LED state
# 0 - ON
# 1 - OFF
# 2 - BLINK - additional arguments - <time on>, <time off>
# 3 - RUN   - additional arguments - <time on>
# 4 - RUN ORDERED: cegpio led  <indexes seperated by dashes> 4 <duration> <time on>


# ==============================================================================
# WLAN
# ==============================================================================
wps_confirm_state=0
wps_confirm_duration=120000
wps_confirm_interval_on=
wps_confirm_interval_off=


wps_search_state=2
wps_search_duration=120000
wps_search_blink_interval_on=300
wps_search_blink_interval_off=300


assoc_state=0
assoc_duration=-1
assoc_blink_interval_on=
assoc_blink_interval_off=


low_throughput_state=0
low_throughput_duration=-1
low_throughput_time_on=
low_throughput_time_off=


link_quality_state=0


# CAC bitmap - The Wireless (2.4G LED on Dual Band/ 5.2G on Single Band) LED is
# flashing. All other keep normal behavior.
cac_state=2
cac_duration=-1
cac_blink_interval_on=300
cac_blink_interval_off=300


# ==============================================================================
# Ethernet
# ==============================================================================
eth2_state=0
eth2_duration=-1
eth2_blink_interval_on=
eth2_blink_interval_off=


# Ethernet LED behavior when LinkUP & traffic is running
eth2_traffic_state=$eth2_state
eth2_traffic_duration=$eth2_duration
eth2_traffic_blink_interval_on=$eth2_blink_interval_on
eth2_traffic_blink_interval_off=$eth2_blink_interval_off


eth2_fail_state=1
eth2_fail_duration=-1
eth2_fail_blink_interval_on=
eth2_fail_blink_interval_off=


eth3_state=0
eth3_duration=-1
eth3_blink_interval_on=
eth3_blink_interval_off=


eth3_traffic_state=$eth3_state
eth3_traffic_duration=$eth3_duration
eth3_traffic_blink_interval_on=$eth3_blink_interval_on
eth3_traffic_blink_interval_off=$eth3_blink_interval_off


eth3_fail_state=1
eth3_fail_duration=-1
eth3_fail_blink_interval_on=
eth3_fail_blink_interval_off=


# ==============================================================================
# Management
# ==============================================================================
managment_state=4
managment_duration=-1
managment_time_on=200


restore_defaults_state=2
restore_defaults_duration=-1
restore_defaults_blink_interval_on=300
restore_defaults_blink_interval_off=300


psmode_state=0
psmode_duration=-1
psmode_time_on=
psmode_time_off=
