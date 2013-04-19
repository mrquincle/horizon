# cat rx_test.sh
#!/bin/sh
# $1-channel $2-Rate $3-ANT $4-Freq Offset $5-DriverName
#set DriverName ra0/rai0 .....
# Ver 2.3
# Add support for tr switch polrity

if [ "$5" = "" ]; then 
	DRIVER=ra0
	echo "No driver name was given. ra0 is set."
else
	DRIVER=$5
	echo "Driver name is $DRIVER"
fi

case $3 in
    "0")
	echo "Ant all, Channel $1, Rate $2, Frequency offset $4"
        ;;
    "1")
	echo "Ant 1, Channel $1, Rate $2, Frequency offset $4"
        ;;
    "2")
	echo "Ant 2, Channel $1, Rate $2, Frequency offset $4"
        ;;
    "3")
	echo "Ant 3, Channel $1, Rate $2, Frequency offset $4"
        ;;
    *)
        echo "Error in script. Ant (1-3) = $3"
        ;;
esac

iwpriv $DRIVER set ATE=ATESTOP

iwpriv $DRIVER set ATECHANNEL=$1

iwpriv $DRIVER set ResetCounter=0

iwpriv $DRIVER set ATERXANT=$3

iwpriv $DRIVER set ATETXFREQOFFSET=$4

iwpriv $DRIVER set ATETXMODE=1

iwpriv $DRIVER set ATETXMCS=$2

iwpriv $DRIVER set ATETXBW=0

iwpriv $DRIVER set ATE=RXFRAME

