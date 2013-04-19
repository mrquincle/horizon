#!/bin/sh

nvram_set WPAPSK1 $1
nvram_set SSID1 $2
nvram_set AuthMode $3
nvram_set EncrypType $4
touch /tmp/iniccfgupload
