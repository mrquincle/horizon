#Celeno gmm bitmap mask file:
#All keys should be written in the format <key=value>, with no spaces!


# ==============================================================================
# Buttons
# ==============================================================================
reset_button_gpio=14
wps_button_gpio=26


# ==============================================================================
# LEDs
# ==============================================================================
all_leds_bitmap=0x82000A01


# ==============================================================================
# WLAN
# ==============================================================================
wps_confirm_bitmap=0x00000001
wps_search_bitmap=0x00000001
assoc_bitmap=0x02000000
low_throughput_bitmap=0x200
cac_bitmap=$assoc_bitmap


# ==============================================================================
# Ethernet
# ==============================================================================
eth2_bitmap=0x80000000
eth2_fail_bitmap=0x80000000


# ==============================================================================
# Management
# ==============================================================================
managment_bitmap=0-31-25
restore_defaults_bitmap=0x82000001
psmode_bitmap_on=0x800
psmode_bitmap_off=0

# Bitmap to turn OFF LEDs on startup
startup_off_bitmap=0xffffd7ff # everything except PWR LED

# HW switch descriptor
operation_mode_hw_switch_desc="
ap   0x00000002 0x00000002
sta  0x00000000 0x00000002
"
