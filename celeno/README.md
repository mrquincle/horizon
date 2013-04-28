# Celeno 

Celeno has a nice interface on its chip:

![Celeno GUI](https://raw.github.com/mrquincle/horizon/master/pictures/celeno.png)

All commands are accessible on the command-line too of course.

    $> cemgr.sh eeprom_show
    
    EEPROM Magic   : 0xCECE
    EEPROM Version : 4
    Board PN       : 59
    Board Revision : 0
    Load Mode      : 1 - Operational
    Serial Number  : Not Set
    Wireless PIN   : Not Set
    Active Ants    : 0x01
    Max BSSID Num  : 0x04, 0x04 (5G, 2.4G)
    Eth Phy1 Addr  : 255
    Eth Phy1 Mode  : 0xB1 - interface=rgmii speed=1G duplex=full pause=none
    Eth Phy2 Addr  : 255
    Eth Phy2 Mode  : 0xFF - interface=N/A speed=N/A duplex=N/A pause=N/A
    Eth Phy Master : 1 - PHY1
    PHY1 MDIO conf : 0x05 (using default)
    Flash Size     : 0 MB
    JFFS Size      : 0 sectors (0 KB)
    Image Mode     : Single

In the scripts in sbin you see a lot of references to "nvram_get" and "nvram_set". You can indeed use these commands such as "nvram_get 2860 WdogEnable" to check if the watchdog timer is enabled, etc. One example:
    
    $> nvram_get VlanId0Members
    "eth2 eth3 ra0 rai0"

There are several interfaces defined, but there seems nothing I can connect to further down into the box. Pity! Most likely the chips communicate over something else with each other.

    $> ifconfig
    br0       Link encap:Ethernet  HWaddr DC:71:44:D5:A4:70  
              inet addr:10.0.0.2  Bcast:10.255.255.255  Mask:255.0.0.0
              UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
              RX packets:1238 errors:0 dropped:0 overruns:0 frame:0
              TX packets:263 errors:0 dropped:0 overruns:0 carrier:0
              collisions:0 txqueuelen:0 
              RX bytes:245853 (240.0 KiB)  TX bytes:35055 (34.2 KiB)
    
    eth2      Link encap:Ethernet  HWaddr DC:71:44:D5:A4:74  
              UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
              RX packets:887 errors:0 dropped:0 overruns:0 frame:0
              TX packets:588 errors:0 dropped:0 overruns:0 carrier:0
              collisions:0 txqueuelen:1000 
              RX bytes:246526 (240.7 KiB)  TX bytes:64557 (63.0 KiB)
              Interrupt:3 
    
    lo        Link encap:Local Loopback  
              inet addr:127.0.0.1  Mask:255.0.0.0
              UP LOOPBACK RUNNING  MTU:16436  Metric:1
              RX packets:2 errors:0 dropped:0 overruns:0 frame:0
              TX packets:2 errors:0 dropped:0 overruns:0 carrier:0
              collisions:0 txqueuelen:0 
              RX bytes:160 (160.0 B)  TX bytes:160 (160.0 B)
    
    rai0      Link encap:Ethernet  HWaddr DC:71:44:D5:A4:78  
              UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
              RX packets:477 errors:0 dropped:851 overruns:0 frame:0
              TX packets:408 errors:0 dropped:0 overruns:0 carrier:0
              collisions:0 txqueuelen:1000 
              RX bytes:73121 (71.4 KiB)  TX bytes:51536 (50.3 KiB)
              Interrupt:16 

There is another interface that can be put up: ifconfig ra0 up.

    $> cat /proc/interrupts 
               CPU0       
      3:      96189       Surfboard  eth2
      4:   80650018       Surfboard  ra0
      5:   86389727       Surfboard  timer
      6:          0       Surfboard  ralink_gpio
     12:       2145       Surfboard  serial
     16:    1972808       Surfboard  rai0
     33:          0       Surfboard  rt2880_timer0
    
    ERR:          0

Then the Celeno specific binaries. They didn't always respond, sometimes I had to restart the box to get them responding properly, but yeah, we all know that about the Horizon box. :-)

    $> cecli
    ce0       Available private ioctls :
              cli              (8BE1) : set 256 char  & get   0      
              get              (8BE2) : set 256 char  & get 2047 char 
              set              (8BE3) : set 256 char  & get 2047 char 
              show             (8BE4) : set   0       & get 2047 char 
              version          (8BE5) : set   0       & get 2047 char 

    $> clihelp
    02:13:14 [KERNEL] 
    02:13:14 [KERNEL] General:        
    02:13:14 [KERNEL]       echo             Print string to local terminal
    02:13:14 [KERNEL]       eprom            Eprom print.
    02:13:14 [KERNEL]       gpio_print       Gpio print
    02:13:14 [KERNEL]       help             Display command set
    02:13:14 [KERNEL]       set              Shell variable operations
    02:13:14 [KERNEL]       version          Version
    02:13:14 [KERNEL] 
    02:13:14 [KERNEL] Scheduler:      
    02:13:14 [KERNEL]       antsel           Antenna Select
    02:13:14 [KERNEL]       ba               Block Ack mechanism
    02:13:14 [KERNEL]       chsel            Channel select
    02:13:14 [KERNEL]       interf           Interference Avoidance
    02:13:14 [KERNEL]       learn             
    02:13:14 [KERNEL]       power             
    02:13:14 [KERNEL]       radar             
    02:13:14 [KERNEL]       rateadp           
    02:13:14 [KERNEL]       ratestd           
    02:13:14 [KERNEL]       sched            access to the scheduler
    02:13:14 [KERNEL]       sm               access to the scheduler SM
    02:13:14 [KERNEL]       sta              Station actions
    02:13:14 [KERNEL]       hwq              Shows Hardware Queues configuration
    02:13:14 [KERNEL]       dbg              Shows Debug information
    02:13:14 [KERNEL] 
    02:13:14 [KERNEL] Gateway:        
    02:13:14 [KERNEL]       gtw              Gateway
    02:13:14 [KERNEL]       cb               Cyclic Buffer
    02:13:14 [KERNEL] 
    02:13:14 [KERNEL] Platform:       
    02:13:14 [KERNEL]       attr_debug       Attribute table
    02:13:14 [KERNEL]       plt              Platform
    02:13:14 [KERNEL] 
    02:13:14 [KERNEL] Memory:         
    02:13:14 [KERNEL]       dm               Display Memory
    02:13:14 [KERNEL]       pm               Put to Memory
    
This general help file can subsequently help you in using the "other" applications. They are actually build up similar to busybox, that depending on how you call "cecli", it has different behaviour. 

    $> ls -l | grep cecli
    lrwxrwxrwx    1 0        0               5 gpio_print -> cecli
    lrwxrwxrwx    1 0        0               5 clihelp -> cecli
    lrwxrwxrwx    1 0        0               5 radar -> cecli
    lrwxrwxrwx    1 0        0               5 ba -> cecli
    lrwxrwxrwx    1 0        0               5 plt -> cecli
    lrwxrwxrwx    1 0        0               5 sm -> cecli
    lrwxrwxrwx    1 0        0               5 rateadp -> cecli
    lrwxrwxrwx    1 0        0               5 gtw -> cecli
    lrwxrwxrwx    1 0        0               5 power -> cecli
    lrwxrwxrwx    1 0        0               5 dm -> cecli
    lrwxrwxrwx    1 0        0               5 version -> cecli
    lrwxrwxrwx    1 0        0               5 sta -> cecli
    lrwxrwxrwx    1 0        0               5 ratestd -> cecli
    lrwxrwxrwx    1 0        0               5 chsel -> cecli
    lrwxrwxrwx    1 0        0               5 pm -> cecli
    lrwxrwxrwx    1 0        0               5 learn -> cecli
    lrwxrwxrwx    1 0        0               5 eprom -> cecli
    lrwxrwxrwx    1 0        0               5 interf -> cecli
    lrwxrwxrwx    1 0        0               5 sdebug -> cecli
    -rwxr-xr-x    1 0        0           33503 cecli
    lrwxrwxrwx    1 0        0               5 sched -> cecli
    lrwxrwxrwx    1 0        0               5 cb -> cecli
    lrwxrwxrwx    1 0        0               5 antsel -> cecli

So, to get info on a command, type "clihelp gtw" and subsequently you can run it as for example:
    
    $> gtw -d
    02:16:46 [CEDRV] ------------------------------------------------
    02:16:46 [CEDRV] Gateway DB:
    02:16:46 [CEDRV] GtwIntervalInTicks       = 2
    02:16:46 [CEDRV] u32CbLimitMng            = 5
    02:16:46 [CEDRV] u32CbLimitBcast          = 5
    02:16:46 [CEDRV] u32CbLimitUcast          = 32
    02:16:46 [CEDRV] u32CbLimitRx             = 5
    02:16:46 [CEDRV] u32DismissLimit          = 100
    02:16:46 [CEDRV] ------------------------------------------------
    02:16:46 [CEDRV] Errors:
    02:16:46 [CEDRV] u32ErrorNoFrameInfo      = 0
    02:16:46 [CEDRV] u32ErrorStationState     = 0
    02:16:46 [CEDRV] u32ErrorRxData           = 0
    02:16:46 [CEDRV] ------------------------------------------------
    02:16:46 [CEDRV] Counters:
    02:16:46 [CEDRV] u32CounterTimer          = 3251569
    02:16:46 [CEDRV] u32CounterTasklet        = 3251361
    02:16:46 [CEDRV] u32CounterFrameInfoGet   = 213
    02:16:46 [CEDRV] u32CounterFrameInfoFree  = 213
    02:16:46 [CEDRV] u32CounterCbReadMaxMng   = 0
    02:16:46 [CEDRV] u32CounterCbReadMaxBcast = 0
    02:16:46 [CEDRV] u32CounterCbReadMaxUcast = 0
    02:16:46 [CEDRV] u32CounterCbReadMaxRx    = 0
    02:16:46 [CEDRV] u32CounterDismissMax     = 6
    02:16:46 [CEDRV] u32CounterStaUnmapped    = 0
    02:16:46 [CEDRV] Gateway timer:
    02:16:46 [CEDRV] Timer name               = Gateway Periodic
    02:16:46 [CEDRV] Timer status             = ADDED
    02:16:46 [CEDRV] Timer expiers            = 7905849
    02:16:46 [CEDRV] ------------------------------------------------
    02:16:46 [CEDRV] Statistics:
    02:16:46 [CEDRV] Duration [us]               AVG         MAX
    02:16:46 [CEDRV]   State NOT_RUNNING:       2009       22088
    02:16:46 [CEDRV]   State REPLENISH :          1         219
    02:16:46 [CEDRV]   State READ_UCAST:          0           1
    02:16:46 [CEDRV]   State READ_OTHER:          0           1
    02:16:46 [CEDRV] Total CPU Usage:
    02:16:46 [CEDRV]   Running:   429496538.3%
    02:16:46 [CEDRV]   State REPLENISH :    0.1%  ( 99.9%)
    02:16:46 [CEDRV]   State READ_UCAST:    0.0%  (  0.0%)
    02:16:46 [CEDRV]   State READ_OTHER:    0.0%  (  0.0%)
    02:16:46 [CEDRV] Last CPU Usage:
    02:16:46 [CEDRV]   Running:     0.4%
    02:16:46 [CEDRV]   State REPLENISH :    0.2%  ( 66.6%)
    02:16:46 [CEDRV]   State READ_UCAST:    0.0%  ( 16.6%)
    02:16:46 [CEDRV]   State READ_OTHER:    0.0%  ( 16.6%)
    02:16:46 [CEDRV] ------------------------------------------------

