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
				<li class="selected"><a href="basic.cgi?section=network">Home Network</a></li>
				<li><a href="basic.cgi?section=lan">Local Area Network</a></li>
				<li><a href="basic.cgi?section=dhcp">DHCP Client Devices</a></li>
			</ul>
		</div>
<div id="content_box">
<h1>Home Network
</h1>
<h3>This page allows to configure home network connection
</h3>

<form id="mainForm" method="post" action="sendResult.cgi?section=network">
<input type="hidden" name="token_csrf" value="e929068515100abe6137a96817c7d66a" />
<input type="hidden" name="page" value="basic" />
<input type="hidden" name="mac" />
<input type="hidden" name="channel" />
<input type="hidden" name="auth" />
<input type="hidden" name="enc" />
<table>
	<tr class="head">
		<td>Home Network Settings
</td>
	</tr>
	<tr>
		<td>
		<input type="radio" name="homeNet" value="no" id="optNo"  /><span id="optNoLabel"> I don't have an existing home network</span><br/>
<input type="radio" name="homeNet" value="yes" id="optYes"  checked /><span id="optYesLabel"> I want to connect to an existing home network</span>

		</td>
	</tr>
	
</table>

<table id="connTypeTable">
	<tr class="head">
		<td colspan="2">Connection Settings
</td>
	</tr>
	
	<tr class="common">
		<td>Connection type
</td>
		<td>
            <select name="connType">
			<option value="eth"  selected>Ethernet</option>

            </select>
		</td>
	</tr>

	<tr class="common">
		<td>Connection Status
</td>
		<td id="status">Connected existing home network</td>
	</tr>
	<tr class="common">
		<td>Primary Home Router IP Address
</td>
		<td>192 . 168 . 0 . 1</td>
	</tr>

	<tr class="uncommon" id="ssidRow">
		<td>SSID
</td>
		<td><input type="text" name="ssid" value=""/></td>
	</tr>
	
	<tr class="uncommon" id="secModeRow">
		<td>Security Mode</td>
		<td>
            <select name="secMode">			
<option value="none" selected>NONE</option>
<option value="wep" >WEP</option>
<option value="wpap" >WPA-Personal</option>

            </select>
		</td>
	</tr>

	<tr class="uncommon" id="secKeyRow">
		<td>Security Key
</td>
		<td><input type="password" name="seckey"/></td>
	</tr>
<!--	
	<tr class="uncommon" id="secKeyRow2">
		<td>Retype Security Key
</td>
		<td><input type="password" name="seckey2"/></td>
	</tr>
-->	

	<tr class="uncommon" id="authRowOpen">
		<td>Authentication
</td>
		<td>
            <select name="authOpen">
                <option value="open" class="wep" selected>Open
</option>
                <option value="shared" class="wep" >Shared
</option>
            </select>
        </td>
    </tr>
    <tr class="uncommon" id="authRowWpa">
		<td>Authentication</td>
		<td>
            <select name="authWpa">
                <option value="wpa" class="wpap" >WPA/PSK
</option>
                <option value="wpa2" class="wpap" >WPA2/PSK
</option>
            </select>
		</td>
	</tr>

    <tr class="uncommon" id="encRow">
        <td>Encryption
</td>
        <td>
            <select name="_enc_">
                <option value="tkip" >TKIP</option>
                <option value="aes" >AES</option>
            </select>
        </td>
    </tr>
<!--
	<tr class="uncommon" id="channelRow">
		<td>Channel(optional)
</td>
		<td>
            <select name="channel">
<option value="0" selected>0</option>

            </select>
		</td>
	</tr>
-->
</table>



<div class="buttons_container">
	<div class="button" id="submitButton">Save</div>
</div>




</form>

<script type="text/javascript">
		upcApp.specificPageBehaviour = upcApp.basic.network.pageBehaviour;
</script>
</div>
	</div>
</body>
</html>
