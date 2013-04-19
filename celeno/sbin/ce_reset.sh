#!/bin/sh

# purpose of this script is to encapsulate system reset
# handling request from UI (due to reset button or config change)
# the only (optional) argument is "reason": "UIReset" or "ConfigChangeReset"

reason=$1

is_sta_mode=`nvram_get ethConvert`

case "$reason" in
    "UIReset")
        nvram_set SystemResetInfo UIReset
        if [ "$is_sta_mode" = "0" ]; then
            celog "System reset due to UI request on AP"
        fi
    ;;

    "ConfigChangeReset")
        nvram_set SystemResetInfo ConfigChangeReset
    ;;

    "")
        nvram_set SystemResetInfo ""
    ;;

    *)
        echo "$0: unknown reason \"$reason\"" > /dev/console
        exit 1
    ;;
esac

reboot
