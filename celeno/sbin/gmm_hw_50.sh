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
all_leds_bitmap=0x02002E01


# ==============================================================================
# WLAN
# ==============================================================================
wps_confirm_bitmap=0x00000001
wps_search_bitmap=0x00000001
assoc_bitmap=0x200
low_throughput_bitmap=0x200
cac_bitmap=$assoc_bitmap


# ==============================================================================
# Ethernet
# ==============================================================================
eth2_bitmap=0
eth3_bitmap=0x400
eth2_fail_bitmap=0
eth3_fail_bitmap=0x400


# ==============================================================================
# Management
# ==============================================================================
managment_bitmap=0-10-9
restore_defaults_bitmap=0x601
psmode_bitmap_on=0x2000000
psmode_bitmap_off=0x2800

# Bitmap to turn OFF LEDs on startup
startup_off_bitmap=0xffffd7ff # everything except PWR LED
