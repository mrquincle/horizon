#!/bin/sh
#
# $Id: /home/apinit.sh,v 0.01 2010-01-18 12:40:54 Raz Exp $
# Celeno driver ap init script(attrgsa calls)
# usage: apinit.sh
#
# Feel free to add your mudule's variables in a different section in here!

# Initiate variables

#
#SCHEDULER:
#example - set vscheduler example variables:

#ceattr set attrgsatest_u32 10 
#ceattr set attrgsatest_i32_array 1 2 3 4 5 6 7 8 9 0
#ceattr set SCH_INTERF_STATE 1
ceattr set COND_INTERF_MAX_RATE 1000000
ceattr set BA_AMPDU_MAX_LEN_FACTOR 2

ceattr set ANT_SEL_EN 1     
ceattr set ANT_SEL_OBSERVE 1

#
#SCH_CHSEL:
#
ceattr set SCH_CHSEL_SCAN_BW 1

#
#Dispatcher:
#

#
#PLT_CFG:
#

#
#SCH_RATE_ADAPT:
#
# 0 - Fixed mode, 1 - Periodic func, 2 - Conf level func
ceattr set TH_OFFSET 1
ceattr set TH_OFFSET_STBC 3

#SCH_LEARNING:
# Learning mode for all stations
# 1 - BF SNR mode, 4 - Periodic STBC mode, 5 - BF RSSI
ceattr set SCH_LEARNING_MODE 1

#SCH_RATE_ADAPT_NON_VIDEO:
# Enable non video stations rate selection mechanism
# 0 - Fixed mode, 1 - Auto mode
ceattr set NON_VIDEO_AUTO_EN 1

# Kick state machine
sm -t 1
