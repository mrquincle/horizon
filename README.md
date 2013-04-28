## Horizon box "hack"

In my quest to create an Android app I got into the wireless chip on the Horizon box (from UPC, or worldwide better known as Liberty). Something sophisticated such as the UPNP exploit [(rapid7 blog)](https://community.rapid7.com/community/metasploit/blog/2013/01/30/weekly-update) is absolutely not necessary. The Celeno chip is easily accessible, but how I cannot tell:

    $> cat /proc/version
    Linux version 2.6.21 (test@ubuntu) (gcc version 3.4.2) #39 Sun Feb 3 07:15:23 PST 2013

By the way, the main processor is a different one, an Intel Atom CE Media Processor.

## Picture

A picture of the mediabox, though this is definitely not necessary for the hack. :-)

![mediabox dissassembled](https://raw.github.com/mrquincle/horizon/master/pictures/snapshot.jpg)

You can see more pictures in ([horizon/pictures](https://github.com/mrquincle/horizon/pictures)), but you have to be patient (it takes a while to load) because I kept them hi-res, so you hopefully can read the text on the chips (forgive my crappy photographer skills).

### UART

The serial port, labelled UART, on the mother board spits out data in incredible fast rate. The thing I use (the Saleae) cannot keep up on 10 MHz. I am only used to slow robots apparently, because that's not something I've seen before on a UART.

![UART](https://raw.github.com/mrquincle/horizon/master/pictures/logic_analyser.png)

If you know what this is, help me please.

### Console port

There is a Samsung console port. Apparently they are used more often on Samsung devices. Please, can anyone post me information on it, if it is operational?

## Consortium

* Wi-Fi is done by the Israelian company [Celeno](http://www.celeno.com/). Information can be found in the folder [Celeno](https://github.com/mrquincle/horizon/pictures).
* MoCA (the coax implementation) is done by Entropic. 
* Conditional access is implemented by Nagravision.
* The middleware and user interface is done by [NDS](http://www.nds.com/). The NDS MediaHighway middleware is a competitor to OpenTV (the sister company of Nagravision). The NDS interface is called NDS Snowflake. It is sometimes said to be Flash-based, but might very well be HTML5. Remote management is done through [Jungo Panorama](http://www.jungo.com/products/panorama-the-connected-home-manager/). NDS has been acquired by Cisco. 
* Streaming the stuff to your devices and some additional media services is done by [KIT digital](http://www.kitd.com/) and [thePlatform](http://theplatform.com/)
* The widgets framework are written by [Metrological](http://www.metrological.com/) and is called 
* The browser is written by [Empathy Lab](http://www.epam.com/empathylab.html) and seems WebKIT based.
* The iOS applications are implemented by Intellicore Services.


[1] [broadbandtrends.com](http://broadbandtrends.com/blog1/2012/09/09/the-future-of-television-is-on-the-horizon/)


## Ethics

This is not something that exposes your box to others. It is just between you and your Horizon box. If I would have the slightest idea that it would hurt people, I would not publish this. Moreover, this is allowed in Holland (see the [iusmentis.com blog](http://blog.iusmentis.com/2008/02/07/de-legaliteit-van-reverse-engineeren-hardware-en-drivers/)) depending on the reason. 

There are two reasons for me to do this: a.) to understand the set top box, b.) to be able to create my own smartphone software to interface with it. Both are valid reasons to inspect the box. Also, note that I had to pay 50 euros for my box. I think it's quite a lot for just taking a look inside a box. :-D Also, note that I did not put source code online. I only put binaries (which you will need to reverse engineer yourself if you want to, and shell scripts online). If your most valuable business logic resides in shell scripts, there is something wrong with your company, so I cannot imagine that this would upset anyone. :-)

## What's next?

Again, the purpose of all this is to have people help me creating own software for the box, being able it to control it from an Android smartphone or a Raspberry PI, or other cool stuff. This falls in the same ballpark as being able to control the Emotiv Epoc, the Kinect, the Brookstone Rover, rooting your iPhone, or Android phone.

## Help

I definitely can use some help in getting to the rest of the box. Feel free to email me (see [my github page](https://github.com/mrquincle) for my email address).
