# Info on the chips

## Intel DNCE2510GU
From the pictures you can see that there is an Intel DNCE2510GU chip on board, a rebranded TNETC4800 chip from Texas Instruments. This chip belongs to the Puma5 family which implements DOCSIS 3. 

On Defcon 18 there is a nice talk from Blake Self on DOCSIS 3:

[![Defcon 18](http://img.youtube.com/vi/L-5B_vs0i3E/0.jpg)](http://www.youtube.com/watch?v=L-5B_vs0i3E)

## Marvell 88E6175R

The 88E6175R is just an ethernet switch, not so much to say on that.

## Samsung K4T1G164QF

K4T1G164QF is DDR2 SDRAM. It's 1 GB and it's the 8Mbit x 16 I/Os x 8 banks device. I am no expert in reading memory chips...

## Seagate ST3500414CS

A harddrive of 500 GB with SATA interface.

## Miscellaneous

There are several JTAG, UART ports, plenty of opportunities to play with.

## People

People that worked on the Horizon box:

* Herminarto Nugroho at Samsung Electronics Indonesia, R&D department, on the SMT-G7400 itself.
* Young ? on the Perl(?) CGI executables on the box itself.
* Christopher Hunter worked on CQ5 on the online portal (JCR).

## PS3

Configuration for PS3 to stream to UPnP port: [Samsung-SMT-G7400.conf](http://tv.luxin.net/ums-2.4.2/renderers/Samsung-SMT-G7400.conf).

## Terminology

The terminology can be confusing, so for your convenience:

* EMTA: Embedded Multimedia Terminal Adapter [Wikipedia](http://en.wikipedia.org/wiki/Embedded_Multimedia_Terminal_Adapter#MTA) combines a cable modem and a VoIP adapter
* DOCSIS: Data Over Cable Service Interface Specification [Wikipedia](http://en.wikipedia.org/wiki/DOCSIS), basically internet over cable.
* JTAG: Joint Test Action Group [Wikipedia](http://en.wikipedia.org/wiki/Joint_Test_Action_Group), one of the most used and known debugging interfaces.
