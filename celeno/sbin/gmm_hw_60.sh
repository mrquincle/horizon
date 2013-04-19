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
all_leds_bitmap=0x02001EC9


# ==============================================================================
# WLAN
# ==============================================================================
wps_confirm_bitmap=0x00000001
wps_search_bitmap=0x00000001
assoc_bitmap=0x200
assoc_bitmap_24=0x1000
low_throughput_bitmap=0x200
low_throughput_bitmap_24=0x1000
cac_bitmap=$assoc_bitmap_24


# ==============================================================================
# Ethernet
# ==============================================================================
eth2_bitmap=0x00000400
eth3_bitmap=0x00000080
eth2_fail_bitmap=0x00000400
eth3_fail_bitmap=0x00000080


# ==============================================================================
# Management
# ==============================================================================
managment_bitmap=10-7-0-9-12
restore_defaults_bitmap=0x1681
psmode_bitmap_on=0x2000000
psmode_bitmap_off=0x2800


# Bitmap to turn OFF LEDs on startup
startup_off_bitmap=0xffffd7ff # everything except PWR LED
