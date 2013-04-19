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
       <link rel="stylesheet" type="text/css" href="../css/style.wireless.css">
    	<link rel="stylesheet" type="text/css" href="../css/lang/style.en.css">
    	<link rel="stylesheet" type="text/css" href="../css/countries/style.default.css">

	<script type="text/javascript" src="../js/jquery.js"></script>
	<script type="text/javascript" src="../js/upcapp.general.js"></script>
	<script type="text/javascript" src="../js/upcapp.wireless.js"></script>
	<script type="text/javascript" src="../js/lang/en.js"></script>	
	<title>UPC WebApp - Wireless</title>
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
			<li><a href="advanced.cgi">ADVANCED</a></li>
			<li><a href="parental.cgi">PARENTAL CONTROL</a></li>
			<li class="selected"><a href="wireless.cgi">WIRELESS</a></li>
			<li><a href="system.cgi">SYSTEM</a></li>
		</ul>
	</div>
<div id="main_container">
		<div id="left_menu">
				<div class="selected">2.4GHz</div>
			<ul class="subMenu">
				<li class="selected"><a href="wireless.cgi?section=2g&subsection=radio">Radio</a></li>
				<li><a href="wireless.cgi?section=2g&subsection=security">Security</a></li>
				<li><a href="wireless.cgi?section=2g&subsection=advanced">Advanced</a></li>
				<li><a href="wireless.cgi?section=2g&subsection=accesscontrol">Access Control</a></li>
				<li><a href="wireless.cgi?section=2g&subsection=wps">WPS</a></li>
			</ul>
				<div>5GHz</div>
			<ul class="subMenu">
				<li><a href="wireless.cgi?section=5g&subsection=radio">Radio</a></li>
				<li><a href="wireless.cgi?section=5g&subsection=security">Security</a></li>
				<li><a href="wireless.cgi?section=5g&subsection=advanced">Advanced</a></li>
				<li><a href="wireless.cgi?section=5g&subsection=accesscontrol">Access Control</a></li>
				<li><a href="wireless.cgi?section=5g&subsection=wps">WPS</a></li>
			</ul>
		</div>
<div id="content_box">
<h1>Basic Wireless Setting
</h1>
<h3>This page allows to configure basic wireless setting
</h3>
<form id="mainForm" method="post" action="sendResult.cgi?section=2g&subsection=radio">
<input type="hidden" name="page" value="wireless" />
<input type="hidden" name="token_csrf" value="e929068515100abe6137a96817c7d66a" />
<table style="width:80%;" id="radioSetTable">
	<tr class="head">
		<td colspan="2">Basic settings of 2.4GHz access point
</td>
	</tr>
	<tr class="odd">
		<td>Enable
</td>
		<td>
		    <select name="enable">
		        <option value="enabled"  >Enabled</option>
<option value="disabled" selected >Disabled</option>

            </select>
        </td>
	</tr>
	<tr>
		<td>SSID
</td>
                <td><input name="ssid" type="text" maxlength="32" id="ssid" value="Sweet"/>
                <input type="checkbox" name="hideSsid"  /> Hide

                </td>
	</tr>
	<tr>
		<td>802.11 Mode
</td>
		<td>
		    <select name="mode">
		        <option  value="0">802.11b only</option>
<option  value="1">802.11g only</option>
<option  value="2">802.11n only</option>
<option  value="6">Mixed (802.11b and 802.11g)</option>
<option  value="7">Mixed (802.11g and 802.11n)</option>
<option selected value="4">Mixed (802.11b, 802.11g and 802.11n)</option>

            </select>
        </td>
	</tr>
	<tr>
		<td>Channel
</td>
		<td>
		    <select name="channel">
		        <option selected value="0">Auto (Current Ch.0)</option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10">10</option>
<option value="11">11</option>
<option value="12">12</option>
<option value="13">13</option>

		    </select>
        </td>
	</tr>
	<tr>
		<td>Bandwidth
</td>
		<td>
		    <select name="bandwidth">
                <option  value="0">20 MHz only</option>
<option selected value="1">20 MHz / 40 MHz</option>

            </select>
        </td>
	</tr>
	<tr>
		<td>Power
</td>
		<td>
		    <select name="power">
		        <option  value="0">0</option>
<option  value="1">15</option>
<option  value="2">30</option>
<option  value="3">60</option>
<option  value="4">90</option>
<option selected value="5">100</option>

		    </select>
        </td>
	</tr>
</table>
</form>

<div class="buttons_container">
	<div class="button" id="saveButton" >Save
</div>
</div>

<script script type="text/javascript">
		upcApp.specificPageBehaviour = upcApp.wireless.radio.pageBehaviour;
</script>
</div>
	</div>
</body>
</html>
