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
       <link rel="stylesheet" type="text/css" href="../css/style.advanced.css">
    	<link rel="stylesheet" type="text/css" href="../css/lang/style.en.css">
    	<link rel="stylesheet" type="text/css" href="../css/countries/style.default.css">

	<script type="text/javascript" src="../js/jquery.js"></script>
	<script type="text/javascript" src="../js/upcapp.general.js"></script>
	<script type="text/javascript" src="../js/upcapp.advanced.js"></script>
	<script type="text/javascript" src="../js/lang/en.js"></script>	
	<title>UPC WebApp - Advanced</title>
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
			<li><a href="basic.cgi">BASIC</a></li>
			<li class="selected"><a href="advanced.cgi">ADVANCED</a></li>
			<li><a href="parental.cgi">PARENTAL CONTROL</a></li>
			<li><a href="wireless.cgi">WIRELESS</a></li>
			<li><a href="system.cgi">SYSTEM</a></li>
		</ul>
	</div>
<div id="main_container">
		<div id="left_menu">
			<ul>
				<li class="selected"><a href="advanced.cgi?section=options">Options</a></li>
				<li><a href="advanced.cgi?section=ipfilters">IP Filters</a></li>
				<li><a href="advanced.cgi?section=macfilters">MAC Filters</a></li>
				<li><a href="advanced.cgi?section=portfilters">Port Filters</a></li>
				<li><a href="advanced.cgi?section=forwarding">Forwarding</a></li>
				<li><a href="advanced.cgi?section=porttriggers">Port Triggers</a></li>
				<li><a href="advanced.cgi?section=dmz">DMZ host</a></li>
				<li><a href="advanced.cgi?section=firewall">Firewall</a></li>
			</ul>
		</div>
<div id="content_box">
<h1>Options
</h1>
<h3>This page allows to configure router option.
</h3>

<form method="post" id="mainForm" action="sendResult.cgi?section=options">
<input type="hidden" name="page" value="advanced" />
<input type="hidden" name="token_csrf" value="e929068515100abe6137a96817c7d66a" />
<table>
	<tr class="head">
		<td>Options
</td>
		<td>Enable
</td>
	</tr>
	<tr>
		<td>WAN Blocking
</td>
		<td><input type="checkbox" name="wan_blocking" checked /></td>
	</tr>
	<tr>
		<td>IPSec pass through
</td>
		<td><input type="checkbox" name="ipsec" checked /></td>
	</tr>
	<tr>
		<td>PPTP pass through
</td>
		<td><input type="checkbox" name="pptp" checked /></td>
	</tr>
	<tr>
		<td>Multicast
</td>
		<td><input type="checkbox" name="multicast" checked /></td>
	</tr>
	<tr>
		<td>UPnP
</td>
		<td><input type="checkbox" name="upnp"  /></td>
	</tr>
</table>
</form>
<div class="buttons_container">
	<div id="saveButton" class="button">Save
</div>
</div>
<script type="text/javascript">
	upcApp.specificPageBehaviour = upcApp.advanced.options.pageBehaviour;
</script>
</div>
	</div>
</body>
</html>
