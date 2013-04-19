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
       <link rel="stylesheet" type="text/css" href="../css/style.parental.css">
    	<link rel="stylesheet" type="text/css" href="../css/lang/style.en.css">
    	<link rel="stylesheet" type="text/css" href="../css/countries/style.default.css">

	<script type="text/javascript" src="../js/jquery.js"></script>
	<script type="text/javascript" src="../js/upcapp.general.js"></script>
	<script type="text/javascript" src="../js/upcapp.parental.js"></script>
	<script type="text/javascript" src="../js/lang/en.js"></script>	
	<title>UPC WebApp - Parental Control</title>
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
			<li class="selected"><a href="parental.cgi">PARENTAL CONTROL</a></li>
			<li><a href="wireless.cgi">WIRELESS</a></li>
			<li><a href="system.cgi">SYSTEM</a></li>
		</ul>
	</div>
<div id="main_container">
		<div id="left_menu">
			<ul>
				<li class="selected"><a href="parental.cgi?section=devicerules">Device Rules</a></li>
				<li><a href="parental.cgi?section=basicsetup">Basic Setup</a></li>
				<li><a href="parental.cgi?section=websitefilters">Web Site Filters</a></li>
				<li><a href="parental.cgi?section=tod">Time Filters</a></li>
			</ul>
		</div>
<div id="content_box">
<h1>Device Rules
</h1>
<h3>This page allows to configure device rules
</h3>

<form method="post" id="mainForm" action="sendResult.cgi?section=devicerules">
<input type="hidden" name="page" value="parental" />
<input type="hidden" name="token_csrf" value="e929068515100abe6137a96817c7d66a" />
<table style="width:95%" id="deviceRulesTab">
	<tr class="head">
		<td>Device Name
</td>
		<td>MAC Address
</td>
		<td>Web Site Filters
</td>
		<td>ToD Filters
</td>
                <td>Delete
</td>
	</tr>

<tr>

<td><input name="devname0" type="text" value=" "/></td>
<td><input name="mac0" type="text" value=" "/></td>
	<td>		<select name="contentRule0" class="webPolicyMenu">
				<option value="default" selected>default</option>
 	 </select>
	</td>
	<td>
			<select name="todRule0" class="todPolicyMenu">
				<option value="default" selected>default</option>
		</select>
	</td>
	<td><input type="checkbox" name="deldevice00d"/></td> 
		</tr>


</table>

</form>
<div style="float:right">

	<div class="buttons_container leftButtons">
		<div id="addNewWebPolicyButton" class="button">Add new Web policy
</div>
	</div>

	<div class="buttons_container leftButtons">
		<div id="addNewToDPolicyButton" class="button">Add new Time policy
</div>
	</div>

	<div class="buttons_container leftButtons">
		<div id="saveButton" class="button">Save</div>
	</div>

</div>

<script type="text/javascript">
		upcApp.specificPageBehaviour = upcApp.parental.deviceRules.pageBehaviour;
</script>
</div>
	</div>
</body>
</html>
