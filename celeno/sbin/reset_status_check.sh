#!/bin/sh

# purpose of this script is to check what is the reason of last system reset
# (i.e. warm reset due to watchdog or due to system request, cold reset),
# log information accordingly and set SystemResetInfo NVRAM key.
# SystemResetInfo is aggregation of following messages:
#  * FactoryReset
#  * UIReset
#  * ColdStart
#  * WarmStart
#  * WatchdogStart
#

TX_SYSTEMRESETINFO="/tmp/TxSystemResetInfo"

is_sta_mode=`nvram_get ethConvert`

RSTSTAT=0xb0000038  # Reset Status Register
WDRST=0x00000002    # Watchdog reset occurred
SWSYSRST=0x00000004 # Software system reset occurred
SWCPURST=0x00000008 # Software CPU reset occurred
RSTMASK=0x0000000e  # WDRST | SWSYSRST | SWCPURST

rststat=0x`reg ra "$RSTSTAT"`

if [ $(( rststat & WDRST )) -ne 0 ]; then
    reset_status="WatchdogStart"
    cat - <<- 'EOT'
    *****************************************
    *** WARNING: watchdog reset occurred! ***
    *****************************************
EOT
elif [ $(( rststat & ( SWSYSRST | SWCPURST ) )) -ne 0 ]; then
    reset_status="WarmStart"
else
    reset_status="ColdStart"
fi

# erase RSTSTAT
reg wa "$RSTSTAT" "$RSTMASK"

SystemResetInfo=`nvram_get SystemResetInfo`

if [ "$is_sta_mode" = 1 ]; then
    # in case of STA log will be written on AP
    # AP will know status from wlan module
    # we use SystemResetInfo to pass this status to AP wlan module
    # through STA wlan module

    # Prevent message stacking.
    # Message chain should be at most "<???Reset>;<???Start>".
    # This is because we don't need excessive resource consumption
    # on sequential system rebooting without actual reporting to AP.
    # There shouldn't be "<???Start>;<???Start>" as well---
    # just report the last start status.
    SystemResetInfo=`echo "$SystemResetInfo" | sed 's/;.*$//'`
    if ! echo "$SystemResetInfo" | grep -q "Reset"; then
        SystemResetInfo=""
    fi

    if [ -n "$SystemResetInfo" ]; then
        SystemResetInfo="${SystemResetInfo};${reset_status}"
    else
        SystemResetInfo="${reset_status}"
    fi

    if [ -e "$TX_SYSTEMRESETINFO" ]; then
        echo "$1: ERROR: $TX_SYSTEMRESETINFO is present" > /dev/console
    else
        echo -n "$SystemResetInfo" > "$TX_SYSTEMRESETINFO"
    fi
else
    # special case: don't report "???Start" message
    # on UIReset request
    if ! echo "$SystemResetInfo" | grep -q "UIReset"; then
        case "$reset_status" in
            "ColdStart")
                celog "System is starting (cold reset) on AP"
            ;;

            "WarmStart")
                celog "System is starting (warm reset) on AP"
            ;;

            "WatchdogStart")
                celog "System is starting (cold reset) on AP"
            ;;

            *)
                echo "$0: unknown reset_status \"$reset_status\"" > /dev/console
            ;;
        esac
    fi

    # clean "???Reset" if any to not stack it infinitely
    nvram_set SystemResetInfo ""
fi
