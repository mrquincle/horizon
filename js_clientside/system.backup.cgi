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
				<li class="selected"><a href="system.cgi?section=backup&subsection=defaults">Factory Default</a></li>
			</ul>
				<div>Log</div>
			<ul class="subMenu">
				<li><a href="system.cgi?section=log&subsection=config">Remote Logging</a></li>
				<li><a href="system.cgi?section=log&subsection=display">Local Log</a></li>
			</ul>
		</div>
<div id="content_box">
<h1>Factory Default
</h1>
<h3>This page allows to restore factory default
</h3>

<table>
	<tr>
		<td>
			All settings will be erased and the system will be restarted.

        </td>
    </tr>
</table>
<div class="buttons_container">
	<div class="button" id="restore">Restore Defaults
</div>
</div>

<script type="text/javascript">
		upcApp.specificPageBehaviour = function() {
			upcApp.authToken = "e929068515100abe6137a96817c7d66a"; /* XXX, workaround */
			upcApp.system.backup.factory.pageBehaviour();
		};
</script>
</div>
	</div>
</body>
</html>
