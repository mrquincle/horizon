#!/bin/sh
# $1-channel $2-MCS  (0-7)  $3-ANT $4-Freq Offset $5-Power Word  $6-Mode  $7-BW $8-TX $9-CNT $10 DriverName
# File: tx_lab_tool.sh 
# Version 2.5
# Add support for tr switch polrity
# Add DriverName
#set BandWidth, 0:20MHz, 1:40MHz.
#set Mode 0:CCK, 1:OFDM, 2:HT-Mix, 3:GreenField
#set TX 0:TXFRAME, 1:TXCARR, 2:TXCONT
#set CNT 10:10 Frames,100:100 Frames,1000:1000 Frames,10000:10000 Frames,Others:10000000,
#set DriverName ra0/rai0 .....

if [ "$10" = "" ]; then 
        DRIVER=ra0
        echo "No driver name was given. ra0 is set."
else
        DRIVER=$10
        echo "Driver name is $DRIVER"
fi

iwpriv $DRIVER set ATE=ATESTOP

iwpriv $DRIVER set ATE=ATESTART

iwpriv $DRIVER set ATEDA=FF:FF:FF:FF:FF:FF

iwpriv $DRIVER set ATECHANNEL=$1

iwpriv $DRIVER set ATETXFREQOFFSET=$4

ANTSELECT1=`iwpriv ra0 e2p 358`
ANTSELECT2=${ANTSELECT1##*:}
ANTSELECT=$((ANTSELECT2))
ANTSELECT_A=$((ANTSELECT & 0x8))

case $6 in
    "3")
        echo "mode GreenField"
        iwpriv $DRIVER set ATETXMODE=3
        ;;
    "2")
        echo "mode HT-Mix"
        iwpriv $DRIVER set ATETXMODE=2
        ;;
    "0")
        echo "Mode CCK"
        iwpriv $DRIVER set ATETXMODE=0
        ;;
    *)
        echo "mode OFDM"
        iwpriv $DRIVER set ATETXMODE=1  
        ;;
esac

iwpriv $DRIVER set ATETXMCS=$2

if [ "$7" = 1 ]; then 
        echo "BW=40Mhz"
        iwpriv $DRIVER set ATETXBW=1
else
        echo "BW=20Mhz"
        iwpriv $DRIVER set ATETXBW=0
fi

iwpriv $DRIVER set ATETXGI=0

iwpriv $DRIVER set ATETXLEN=1024

iwpriv $DRIVER set ATETXANT=$3

case $3 in
    "0")
        echo "All Ant"

                iwpriv $DRIVER set ATETXPOW0=$5

                iwpriv $DRIVER set ATETXPOW1=$5

                if [ "$DRIVER" = ra0 ]; then 
                        iwpriv $DRIVER set ATETXPOW2=$5
                fi

        ;;
    "1")
        echo "Ant 1"

                iwpriv $DRIVER set ATETXPOW0=$5

                iwpriv $DRIVER set ATETXPOW1=0

                if [ "$DRIVER" = ra0 ]; then 
                        iwpriv $DRIVER set ATETXPOW2=0
                fi

        ;;
    "2")
                echo "Ant 2"

                iwpriv $DRIVER set ATETXPOW0=0

                iwpriv $DRIVER set ATETXPOW1=$5

                if [ "$DRIVER" = ra0 ]; then 
                        iwpriv $DRIVER set ATETXPOW2=0
                fi
        
        ;;
    "3")
        echo "Ant 3"

                iwpriv $DRIVER set ATETXPOW0=0

                iwpriv $DRIVER set ATETXPOW1=0

                if [ "$DRIVER" = ra0 ]; then 
                        iwpriv $DRIVER set ATETXPOW2=$5
                fi
        ;;
    *)
        echo "Error in script. Ant (0-3) = $3"
        ;;
esac

#iwpriv $DRIVER set ATETXCNT=10000000
case $9 in
    "10000")
        echo "Frame Tx count=10000"
        iwpriv $DRIVER set ATETXCNT=10000
        ;;
    "1000")
        echo "Frame Tx count=1000"
        iwpriv $DRIVER set ATETXCNT=1000
        ;;
    "100")
        echo "Frame Tx count=100"
        iwpriv $DRIVER set ATETXCNT=100
        ;;
    "10")
        echo "Frame Tx count=10"
        iwpriv $DRIVER set ATETXCNT=10
        ;;
    *)
        echo "Frame Tx count=10000000"
        iwpriv $DRIVER set ATETXCNT=10000000
        ;;
esac

case $8 in
    "2")
        echo "Tx option: Continuous TX"
        iwpriv $DRIVER set ATE=TXCONT
        ;;
    "1")
        echo "Tx option: Carrier test"
        iwpriv $DRIVER set ATE=TXCARR
        ;;
    *)
        echo "Tx option: Transmit frame, for EVM"
        iwpriv $DRIVER set ATE=TXFRAME  
        ;;
esac

case $3 in
    "0")
                 if [ "$DRIVER" = ra0 ]; then 
                 	if [ $ANTSELECT_A = "0" ]; then 
		        		iwpriv ra0 mac 1328=1050005
		        	else
		        		iwpriv ra0 mac 1328=10D0005
			fi
		fi
        ;;
    "1")
                 if [ "$DRIVER" = ra0 ]; then 
                 	if [ $ANTSELECT_A = "0" ]; then 
		        		iwpriv ra0 mac 1328=50001
		        	else
		        		iwpriv ra0 mac 1328=D0001
			fi
		fi
        ;;
    "2")
                if [ "$DRIVER" = ra0 ]; then 
                  	if [ $ANTSELECT_A = "0" ]; then 
		        		iwpriv ra0 mac 1328=50004
		        	else
		        		iwpriv ra0 mac 1328=D0004
			fi
                fi
        
        ;;
    "3")

                 if [ "$DRIVER" = ra0 ]; then 
                 	if [ $ANTSELECT_A = "0" ]; then 
		        		iwpriv ra0 mac 1328=1050000
		        	else
		        		iwpriv ra0 mac 1328=10D0000
			fi
                fi               
        ;;
    *)
        echo "Error in script. Ant (0-3) = $3"
        ;;
esac