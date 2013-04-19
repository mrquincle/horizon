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
       <link rel="stylesheet" type="text/css" href="../css/style.status.css">
    	<link rel="stylesheet" type="text/css" href="../css/lang/style.en.css">
    	<link rel="stylesheet" type="text/css" href="../css/countries/style.default.css">

	<script type="text/javascript" src="../js/jquery.js"></script>
	<script type="text/javascript" src="../js/upcapp.general.js"></script>
	<script type="text/javascript" src="../js/upcapp.status.js"></script>
	<script type="text/javascript" src="../js/lang/en.js"></script>	
	<title>UPC WebApp - Status</title>
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
			<li class="selected"><a href="status.cgi">STATUS</a></li>
			<li><a href="basic.cgi">BASIC</a></li>
			<li><a href="advanced.cgi">ADVANCED</a></li>
			<li><a href="parental.cgi">PARENTAL CONTROL</a></li>
			<li><a href="wireless.cgi">WIRELESS</a></li>
			<li><a href="system.cgi">SYSTEM</a></li>
		</ul>
	</div>
<div id="main_container">
		<div id="left_menu">
			<ul>
				<li class="selected"><a href="status.cgi?section=system">System</a></li>
			</ul>
				<div>Connection</div>
			<ul class="subMenu">
				<li><a href="status.cgi?section=connection&subsection=basic">Basic</a></li>
				<li><a href="status.cgi?section=connection&subsection=upstream">Upstream</a></li>
				<li><a href="status.cgi?section=connection&subsection=downstream">Downstream</a></li>
			</ul>
				<div>MTA</div>
			<ul>
			<ul class="subMenu">
				<li><a href="status.cgi?section=mta&subsection=status">Status</a></li>
			</ul>
				<div>Diagnostic</div>
			<ul class="subMenu">
				<li><a href="status.cgi?section=diagnostic&subsection=ping">Ping</a></li>
				<li><a href="status.cgi?section=diagnostic&subsection=trace">Trace Route</a></li>
			</ul>
		</div>
<div id="content_box">
<h1>System
</h1>
<h3 class="description">This page display cable modem system infomation.
</h3>

<table>
	<tr class="head">
		<td colspan="2">CM Software Infomation
</td>
	</tr>
	<tr class="odd">
		<td>Standards Compliancy
</td>
		<td>DOCSIS 3.0</td>
	</tr>
	<tr>
		<td>Software Version
</td>
		<td>0.68</td>
	</tr>
	<tr>
		<td>Hardware Version
</td>
		<td>7</td>
	</tr>
	<tr>
		<td>HFC MAC Address
</td>
		<td>3C:62:00:6E:6F:B8</td>
	</tr>
	<tr>
		<td>Gateway Serial Number
</td>
		<td>S7UCA14611K</td>
	</tr>
	<tr>
		<td>Installed Cetification
</td>
		<td>
			EuroDOCSIS: installed<br> DOCSIS: installed<br> EuroPacketCable: installed
		</td>
	</tr>
	<tr>
		<td>System Uptime
</td>
		<td>3 days 22h:14m:51s</td>
	</tr>
	<tr>
		<td>Network Access
</td>
		<td>Enabled</td>
	</tr>
	<tr>
		<td>CM IP Address
</td>
		<td>10.21.71.23</td>
	</tr>
</table>

<script type="text/javascript">
		upcApp.specificPageBehaviour = upcApp.status.system.pageBehaviour;
</script>

</div>
	</div>
</body>
</html>
