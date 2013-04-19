## Horizon box "hack"

In my quest to create an Android app I got into the wireless chip on the Horizon box (from UPC, or worldwide better known as Liberty). Something sophisticated such as the UPNP exploit [rapid7 blog](https://community.rapid7.com/community/metasploit/blog/2013/01/30/weekly-update) is absolutely not necessary. 

### Running programs, architecture, shell

There are a few programs running on the box, most noticable a so-called iNIC daemon on interface eth2.

    $> ps aux
     PID USER       VSZ STAT COMMAND
       1 admin     1912 S    init  
       2 admin        0 SWN  [ksoftirqd/0]
       3 admin        0 SW<  [events/0]
       4 admin        0 SW<  [khelper]
       5 admin        0 SW<  [kthread]
       6 admin        0 SW<  [kswapd0]
       7 admin        0 SW   [pdflush]
       8 admin        0 SW   [pdflush]
      49 admin     1160 S    nvram_daemon 
     176 admin      788 S    wd_keepalive 
     181 admin     1972 S    syslogd -C64 
     185 admin     1916 S    klogd -c4 
     188 admin     1980 S    logread -fc 
     469 admin      784 S    sysevent-dispatch 
     735 admin     1292 S    /bin/iNICd -i eth2 
     940 admin     1912 R    telnetd -t 120 -f /etc_ro/telnet_msg -l /bin/sh 
     987 admin     1920 S    /bin/sh --login 
    1134 admin        0 SW   [RtmpCmdQTask]
    1135 admin        0 SW   [RtmpWscTask]
    1231 admin     1924 S    /bin/sh 
    1362 admin     1912 R    ps aux 

Architecture is MIPS.

    $> file bin/iNICd 
    bin/iNICd: ELF 32-bit LSB executable, MIPS, MIPS-II version 1 (SYSV), dynamically linked (uses shared libs), corrupted section header size

Shell is BusyBox v1.12.1 (2013-01-27 02:03:28 PST) built-in shell (ash)

    $> cat etc/fstab 
    none            /proc           proc    defaults 0 0
    none            /sys            sysfs   defaults 0 0
    none            /dev/pts        devpts  defaults 0 0

There are many references to Celeno, such as in /etc_ro/rcS

    # CELENO-FIX / Benson, 17-04-2011
    # Description: (SDK 3.5.2 merge)
    # This script was adjusted according to Celeno networking demands
    # and was heavily changed from original 3.5.2 SDK.

So, this concerns the wireless chip, build by te Israelian company [Celeno](http://www.celeno.com/). An overview of the partners contributing to the UPC Horizon box can be read at [broadbandtrends.com](http://broadbandtrends.com/blog1/2012/09/09/the-future-of-television-is-on-the-horizon/). The coax implementation for example is done by Entropic. The middleware and user interface is done by [NDS](http://www.nds.com/), streaming the stuff to your devices and some additional media services is done by [KIT digital](http://www.kitd.com/) and [thePlatform](http://theplatform.com/), the apps are written by [Metrological](http://www.metrological.com/), the browser by [Empathy Lab](http://www.epam.com/empathylab.html).
