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
       <link rel="stylesheet" type="text/css" href="../css/style.system.css">
    	<link rel="stylesheet" type="text/css" href="../css/lang/style.en.css">
    	<link rel="stylesheet" type="text/css" href="../css/countries/style.default.css">

	<script type="text/javascript" src="../js/jquery.js"></script>
	<script type="text/javascript" src="../js/upcapp.general.js"></script>
	<script type="text/javascript" src="../js/upcapp.system.js"></script>
	<script type="text/javascript" src="../js/lang/en.js"></script>	
	<title>UPC WebApp - System</title>
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
			<li><a href="wireless.cgi">WIRELESS</a></li>
			<li class="selected"><a href="system.cgi">SYSTEM</a></li>
		</ul>
	</div>
<div id="main_container">
		<div id="left_menu">
			<ul>
				<li><a href="system.cgi?section=password">Password</a></li>
			</ul>
				<div>Backup and Recovery</div>
			<ul>
			<ul class="subMenu">
				<li><a href="system.cgi?section=backup&subsection=backup">Backup</a></li>
				<li><a href="system.cgi?section=backup&subsection=restore">Restore</a></li>
				<li><a href="system.cgi?section=backup&subsection=defaults">Factory Default</a></li>
			</ul>
				<div class="selected">Log</div>
			<ul class="subMenu">
				<li><a href="system.cgi?section=log&subsection=config">Remote Logging</a></li>
				<li class="selected"><a href="system.cgi?section=log&subsection=display">Local Log</a></li>
			</ul>
		</div>
<div id="content_box">
<h1>Local Log 
</h1>
<h3>This page allows to configure and view local log
</h3>

<form id="mainForm" method="post" action="sendResult.cgi?section=log&subsection=display">
    <input type="hidden" name="page" value="system" />
	<input type="hidden" name="token_csrf" value="e929068515100abe6137a96817c7d66a" />

    <table id="logDisplayTable" class="systemLogTable">
        <tr class="head">
            <td colspan="2">Filter Log
</td>
        </tr>
        <tr class="section">
            <td>
                <b>Level
</b>
            </td>
            <td colspan="2">
                <b>Module
</b>
            </td>
        </tr>
        <tr>
            <td>
                <ul class="logOptionList">
                    <li><input type="checkbox" name="logLevel_critical" checked /> Critical
</li>
                    <li>  <input type="checkbox" name="logLevel_major" checked /> Major
</li>
                    <li> <input type="checkbox" name="logLevel_minor" checked /> Minor
</li>
                    <li> <input type="checkbox" name="logLevel_warning" checked /> Warning
</li>
                    <li><input type="checkbox" name="logLevel_inform" checked /> Inform
</li>
                </ul>
            </td>
            <td>
                <ul class="logOptionList">
                    <li><input type="checkbox" name="module_system" checked /> System
</li>
                    <li> <input type="checkbox" name="module_internet" checked /> Internet
</li>
                    <li><input type="checkbox" name="module_lan" checked /> LAN
</li>
                    <li><input type="checkbox" name="module_ghn" checked /> GHN
</li>
                    <li><input type="checkbox" name="module_firewall" checked /> Firewall
</li>
                </ul>
            </td>
            <td>
                <ul class="logOptionList">
                    <li><input type="checkbox" name="module_parental_control"  /> Parental Control
</li>
                    <li><input type="checkbox" name="module_wireless" checked /> Wireless
</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td colspan="3">
                <textarea id="logText">
                    could not get log

                </textarea>
            </td>
        </tr>
    </table>
</form>

<div class="buttons_container">
    <div class="button" id="saveButton">Refresh
</div>
</div>

<script type="text/javascript">
    $(document).ready(function() {
        if (typeof(upcApp.system.log.config.pageBehaviour) === 'function') {
            upcApp.system.log.config.pageBehaviour();
        }
    });
</script>
</div>
	</div>
</body>
</html>
