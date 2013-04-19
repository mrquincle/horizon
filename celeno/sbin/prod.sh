#! /bin/sh

EEPROM_MAGIC_ADDR_0=40350
EEPROM_MAGIC_ADDR_1=40351
EEPROM_BOARD_REV_ADDR=40356
EEPROM_LOAD_MODE_ADDR=4035A

flash_val=ff

flash_read_hex ()
{
    # this function is used to read a single byte from the flash
    flash_val=`flash -r $1 -c 4 | grep $1: | cut -d' ' -f2`    
}

eeprom_magic_valid=0

check_magic ()
{
    #this function verifies celeno magic
	flash_read_hex $EEPROM_MAGIC_ADDR_0
    if [ "$flash_val" != "CE" ]; then
        echo -en "ERROR: Illegal eeprom magic [$EEPROM_MAGIC_ADDR_0:$flash_val]! setting operation mode\n\n"
        eeprom_magic_valid=0
	else
		flash_read_hex $EEPROM_MAGIC_ADDR_1
	    if [ "$flash_val" != "CE" ]; then
	        echo -en "ERROR: Illegal eeprom magic [$EEPROM_MAGIC_ADDR_1:$flash_val]! setting operation mode\n\n"
	        eeprom_magic_valid=0
		else
			eeprom_magic_valid=1
		fi
    fi
}

flash_util=0

check_flash_util()
{	
	if [ -x /bin/flash ]; then
		flash_util=1
	else
		echo -en "ERROR: flash util unavailable! setting operation mode\n\n" 
		flash_util=0
	fi
}

#-------------
# Script Main
#-------------
echo -en "\n"
IS_PRODUCTION_MODE=0
#is flash util available? - else - operation mode
check_flash_util
if [ "$flash_util" != "1" ]; then
	IS_PRODUCTION_MODE=0
	echo -en "no flash util -  operation mode\n\n" 
	exit 0
fi

#check if the eprom is valid: - else - operation mode
check_magic
if [ "$eeprom_magic_valid" != "1" ]; then
	IS_PRODUCTION_MODE=0
	echo -en "no magic -  operation mode\n\n" 
	exit 0
fi

flash_read_hex $EEPROM_LOAD_MODE_ADDR
if [ "$flash_val" != "1" ]; then
	echo -en "PRODUCTION MODE\n\n"
	IS_PRODUCTION_MODE=1
	exit 1
else
	echo -en "OPERATION MODE\n\n"
	IS_PRODUCTION_MODE=0
	exit 0
fi
