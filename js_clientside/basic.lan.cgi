<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="icon" type="image/png" href="../img/favicon.png" />
	<link rel="shortcut icon" type="image/x-icon" href="../img/favicon.ico" />
	<!--
	<link rel="stylesheet" type="text/css" href="../css/style.css">
	-->
	<link rel="stylesheet" type="text/css" href="../css/style.css">
	<!--[if IE]>
	<link rel="stylesheet" type="text/css" href="../css/iestyle.css">
	<![endif]-->
       <link rel="stylesheet" type="text/css" href="../css/style.basic.css">
    	<link rel="stylesheet" type="text/css" href="../css/lang/style.en.css">
    	<link rel="stylesheet" type="text/css" href="../css/countries/style.default.css">

	<script type="text/javascript" src="../js/jquery.js"></script>
	<script type="text/javascript" src="../js/upcapp.general.js"></script>
	<script type="text/javascript" src="../js/upcapp.basic.js"></script>
	<script type="text/javascript" src="../js/lang/en.js"></script>	
	<title>UPC WebApp - Basic</title>
	<script language="javascript" type="text/javascript">
		$(document).ready(function () {
			if (typeof(upcApp.specificPageBehaviour) === 'function') {
				upcApp.specificPageBehaviour();
			};
			upcApp.generalPageBehaviour();
		});	
	</script>

	<script language="javascript" type="text/javascript">
		$(document).ready(function ()
				{$('option[value="en"]').attr("selected",true);});
	</script>
</head>
<body>

<div id="top_panel">
	<div id="login_area">
		<div id="label">
          <a href="sendResult.cgi?action=logout"><img src="../img/button/safelock.png"/>admin&nbsp&nbsp&nbsp</a>
   
   	   <div id="site_lang">   
                
                Language
                <select name="site_lang">
                   	<option selected  value="en">English</option>
	<option   value="nl">Nederlands</option>
	<option   value="fr">Français</option>
	<option   value="de">Deutsch</option>
	<option   value="it">Italiano</option>


                </select>
            </div> 
        </div>
	</div>		
</div>

	<div id="main_menu_container">
		<ul id="main_menu">
			<li><a href="status.cgi">STATUS</a></li>
			<li class="selected"><a href="basic.cgi">BASIC</a></li>
			<li><a href="advanced.cgi">ADVANCED</a></li>
			<li><a href="parental.cgi">PARENTAL CONTROL</a></li>
			<li><a href="wireless.cgi">WIRELESS</a></li>
			<li><a href="system.cgi">SYSTEM</a></li>
		</ul>
	</div>
<div id="main_container">
		<div id="left_menu">
			<ul>
				<li><a href="basic.cgi?section=internet">Internet</a></li>
				<li><a href="basic.cgi?section=network">Home Network</a></li>
				<li class="selected"><a href="basic.cgi?section=lan">Local Area Network</a></li>
				<li><a href="basic.cgi?section=dhcp">DHCP Client Devices</a></li>
			</ul>
		</div>
<div id="content_box">
<h1>Local Area Network
</h1>
<h3>This page allows to configure Local Area Network & DHCP Server
</h3>

<form id="mainForm" method="post" action="sendResult.cgi?section=lan">
<input type="hidden" name="page" value="basic" />
<input type="hidden" name="token_csrf" value="e929068515100abe6137a96817c7d66a" />
<table>
	<tr class="head">
		<td colspan="2">
			
			This page is not editable because the configuration should follow the one of primary home network gateway.

		</td>
	</tr>
	<tr>
		<td>IP Address
</td>
		<td>
192.168.0.32
		</td>
	</tr>
	<tr>
		<td>Subnet Mask
</td>
		<td>
255.255.255.0
		</td>
	</tr>
	<tr>
		<td>MAC Address
</td>
		<td>
			3C:62:00:6E:6F:B9 

		</td>
	</tr>
	<tr>
		<td>DHCP Server
</td>
		<td>
Enabled
		</td>
	</tr>
	<tr>
		<td>Starting Local Address
</td>
		<td>
192.168.0.33
		</td>
	</tr>
	<tr>
		<td>DHCP Pool Size
</td>
		<td>
			19
		</td>
	</tr>
	<tr>
		<td>Lease Time
</td>
		<td>
            <table id="leaseTimeTab">
                <tr>
<!--
		<td><input type="text" name="dhcpLeaseTime"  value="180 &nbsp&nbsp Seconds"/>&nbsp&nbsp Seconds
</td>
-->
		<td>180 &nbsp&nbsp Seconds</td>
                </tr>
            </table>
		</td>
	</tr>
	
	<tr>
		<td>System Time
</td>
		<td>
						<class="fixwid"> 2013-04-17 19:59:58

		</td>
	</tr>
	<tr>
		<td>DNS Server1
</td>
		<td>
192.168.0.32
		</td>
	</tr>
	<tr>
		<td>DNS Server2
</td>
		<td>
0.0.0.0
		</td>
	</tr>
        <tr>
                <td>Domain Name
</td>
                <td>

                </td>
        </tr>


	<tr>
		<td>

DHCP Pool list

</td>
		<td><select name="poolList" multiple size="5" style="width:160px;">

				<option> 192.168.0.33 
				<option> 192.168.0.34 
				<option> 192.168.0.35 
				<option> 192.168.0.36 
				<option> 192.168.0.37 
				<option> 192.168.0.38 
				<option> 192.168.0.39 
				<option> 192.168.0.40 
				<option> 192.168.0.41 
				<option> 192.168.0.42 
				<option> 192.168.0.43 
				<option> 192.168.0.44 
				<option> 192.168.0.45 
				<option> 192.168.0.46 
				<option> 192.168.0.47 
				<option> 192.168.0.51 
				<option> 192.168.0.53 
				<option> 192.168.0.55 
				<option> 192.168.0.56 

			</select></td></tr>

</table>

</form>

<script type="text/javascript">
        upcApp.specificPageBehaviour = upcApp.basic.lan.pageBehaviour;
</script>
</div>
	</div>
</body>
</html>
