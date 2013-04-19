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
				<li class="selected"><a href="basic.cgi?section=internet">Internet</a></li>
				<li><a href="basic.cgi?section=network">Home Network</a></li>
				<li><a href="basic.cgi?section=lan">Local Area Network</a></li>
				<li><a href="basic.cgi?section=dhcp">DHCP Client Devices</a></li>
			</ul>
		</div>
<div id="content_box">
<h1>Internet
</h1>
<h3>This page allows configuration of the basic features of the broadband gateway related to your ISP's connection.
</h3>

<form id="mainForm" method="post" action="sendResult.cgi?section=internet">
<input type="hidden" name="page" value="basic" />
<input type="hidden" name="token_csrf" value="e929068515100abe6137a96817c7d66a" />
<input type="hidden" name="action" value="saveInternet" />
<table>
	<tr class="head">
		<td colspan="2">
			Internet Status

		</td>
	</tr>
	<tr>
		<td>IP Address
</td>
		<td>
			213.93.188.125
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
                <!--
                <td class="fixwid">
                -->
                <td>
			3C:62:00:6E:6F:BB
		</td>
	</tr>
	<tr>
		<td>Expires on
</td>
                <!--
                <td class="fixwid">
                -->
                <td>
			2013-04-19 21:46:19
		</td>
	</tr>
	<tr>
		<td>Host Name
</td>
		<td>
			<input type="text" name="hostname" value=""/><script>alert('H')</script>"/> (if required by ISP)

		</td>
	</tr>
	<tr>
		<td>Domain Name
</td>
		<td>
			<input type="text" name="domainname" value=""/> (if required by ISP)

		</td>
	</tr>
</table>
<div class="buttons_container">
	<div class="button" id="saveButton">Save</div>
	<div class="button" id="renewIpButton">WAN IP Renew</div>
	<div class="button" id="releaseIpButton">WAN IP Release</div>

</div>

</form>

<script type="text/javascript">
		upcApp.specificPageBehaviour = upcApp.basic.internet.pageBehaviour;
</script>
</div>
	</div>
</body>
</html>
