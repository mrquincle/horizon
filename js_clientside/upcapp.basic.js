/*jslint devel: true, sloppy: true, nomen: true, maxerr: 100, indent: 4*/
/*global jQuery*/
/*global $*/
/*global setTimeout*/
/*global window*/
/*global location*/

/**
 * UPCWebApp - Basic Section related functions
 * @name upcapp.js
 * @version 1.0
 */


var upcApp = upcApp || {};
upcApp.basic = upcApp.basic || {};


upcApp.basic.network = (function () { // objects and functions related to page "Basic->Home Network"
		var userInterrupted = false,
		originSetting = null,
		initdone = false,
		cannotSaveConfiguration = null;


		function searchTimeout() {
			cannotSaveConfiguration({status : upcApp.messages.saveTimeout});
		}

		/**
		 * Handle change of the state of the main RadioButtons (Home network setting)
		 */
		function HomeNetworkChange() {
			if ($(this).val() === 'yes') {
				$('table#connTypeTable').fadeIn('slow');
				$('select[name=connType]').change();
			} else {
				$('table#connTypeTable').fadeOut('slow');
			}
		} //HomeNetworkChange

		/**
		 * Hide/Show dom elements
		 * @param {Object} map A map of DOM element's id and number (0 means that is should be hidden, 1 - shown)
		 */
		function showHideSections(map) {
			var i;
			for (i in map) {
				if (map.hasOwnProperty(i)) {
					if (map[i] === 1) {
						$('#' + i).show();
					} else if (map[i] === 0) {
						$('#' + i).hide();
					}
				}
			}
		} //showHideSections


		function securityModeChange() {
			var secModeMap = {
/*
            none : {ssidRow : null, secModeRow : null, secKeyRow : 0, authRowOpen : 0, authRowWpa : 0, encRow : 0, channelRow : null},
            wep  : {ssidRow : null, secModeRow : null, secKeyRow : 1, authRowOpen : 1, authRowWpa : 0, encRow : 0, channelRow : null},
            wpap : {ssidRow : null, secModeRow : null, secKeyRow : 1, authRowOpen : 0, authRowWpa : 1, encRow : 1, channelRow : null},
            wpae : {ssidRow : null, secModeRow : null, secKeyRow : 1, authRowOpen : 0, authRowWpa : 1, encRow : 1, channelRow : null}
*/
            none : {ssidRow : null, secModeRow : null, secKeyRow : 0, secKeyRow2 : 0, authRowOpen : 0, authRowWpa : 0, encRow : 0, channelRow : null},
            wep  : {ssidRow : null, secModeRow : null, secKeyRow : 1, secKeyRow2 : 1, authRowOpen : 1, authRowWpa : 0, encRow : 0, channelRow : null},
            wpap : {ssidRow : null, secModeRow : null, secKeyRow : 1, secKeyRow2 : 1, authRowOpen : 0, authRowWpa : 1, encRow : 1, channelRow : null},
            wpae : {ssidRow : null, secModeRow : null, secKeyRow : 1, secKeyRow2 : 1, authRowOpen : 0, authRowWpa : 1, encRow : 1, channelRow : null}
        };
			switch ($('select[name=connType]').val()) {
			case 'eth':
			case 'wifiscan':
			case 'wifipbc':
				//noop
				break;
			case 'wifiman':
				showHideSections(secModeMap[$(this).find(':selected').val()]);
				break;
			}

		} //securityModeChange


		function connectionTypeChange() {
			var cType = $(this).find(':selected').val(),
			sectionMap = {
				eth     :   {ssidRow : 0, secModeRow : 0, secKeyRow : 0, authRowOpen : 0, authRowWpa : 0, encRow : 0, channelRow : 0 },
				wifiman :   {ssidRow : 1, secModeRow : 1, secKeyRow : 1, authRowOpen : 0, authRowWpa : 0, encRow : 1, channelRow : 1 },
				wifiscan:   {ssidRow : 0, secModeRow : 0, secKeyRow : 0, authRowOpen : 0, authRowWpa : 0, encRow : 0, channelRow : 0 },
				wifipbc :   {ssidRow : 0, secModeRow : 0, secKeyRow : 0, authRowOpen : 0, authRowWpa : 0, encRow : 0, channelRow : 0 }
			};
			$('#connTypeTable tr.uncommon').hide();
			if (initdone) {
				$('td#status').text('?');
			}
			showHideSections(sectionMap[cType]);
			$('select[name=secMode]').change();
		} //connectionTypeChange


		/*
		 * Send the Abort command to the device and close any displayed info window
		 */
		function abortSaveAction() {
			userInterrupted = true;
			upcApp.stopTicking();
			upcApp.talk2device(
				null,
				$("form#mainForm").serialize() + '&' + $.param({action : 'stopSave'}),
				function () {
					userInterrupted = false;
					upcApp.killFancyWindow()();
				},
				null
			);
		} //abortSaveAction

		/*
		 * Run when device said that it can't save the configuration
		 */
		cannotSaveConfiguration = function (data) {
			upcApp.killFancyWindow()();
			$('td#status').text(upcApp.messages.errorLabel + ': ' + data.status);
		}; //cannotSaveConfiguration


		/*
		 * Run when the configuration was send to the device for saving and we need to ask if it was stored successfully
		 */
		function configurationAlmostSaved(data) {
			var alreadyAsked = 0,
			payload;
			if (data.finished === true) {
				upcApp.stopTicking();

				if (data.restartNeeded === true) {
					upcApp.fancyMessage(
						upcApp.messages.restartConfirmationWindowLabel,
						false,
						null,
						upcApp.confirmRestart('basic', upcApp.Wait4restart, {connType: $('select[name=connType]').val(), homeNet: $('input[name=homeNet]:checked').val()}),
						null
					);
				} else {
					upcApp.fancyMessage(upcApp.messages.newConfSaved, false, data.status);
					setTimeout(
						upcApp.killFancyWindow(),
						upcApp.infoWindowTimeout * 1000
					);
				}
			} else { // not saved yet, we'll wait a second and ask again
				if (userInterrupted || upcApp.timeOut) { //user clicked Cancel ?
					return;// finish
				} else {
					if (typeof data.status !== 'undefined') { // any message for the user?
						upcApp.infoWindow.clearContent().addContent(data.status);
					}

					function checkTheSaveStatus() {
						if (userInterrupted || upcApp.timeOut) { //user clicked Cancel ?
							return;// finish
						}
						upcApp.talk2device(
							null,
							$("form#mainForm").serialize() + '&' + $.param({action : 'saveStatus'}),
							configurationAlmostSaved,
							cannotSaveConfiguration,
							null
						);
					}
					setTimeout(checkTheSaveStatus, 1000);
				}
			}
		} //configurationAlmostSaved


		/*
		 * General save procedure.
		 */
						function generalSaveAction(performSearch) {
							var tmp, data2send = {action : 'saveNetworkConfig'};

							userInterrupted = false;
							upcApp.timeOut = false;
							if ($('input[name=homeNet]:checked').val() === 'yes') {
								data2send = $.param(data2send) + '&' + $("form#mainForm").serialize();
							} else {
								data2send.homeNet = false;
								data2send.page = 'basic';
							}

							upcApp.fancyMessage(upcApp.messages.waitForSave, true, null, undefined, abortSaveAction);

							upcApp.talk2device(
								null,
								data2send,
								configurationAlmostSaved,
								cannotSaveConfiguration,
								null // general Ajax Error handler
							);

						} // generalSaveAction



						function FinalSaveForExtendedScenario() {
							$('input[name=seckey]').val($('input[name=apscan_seckey]').val());
							upcApp.fancyMessage(upcApp.messages.waitForSave, true, null, undefined, abortSaveAction);
							generalSaveAction();
						} //FinalSaveForExtendedScenario



						function selectAP(apItem) {
							var tab, f, fields = [ ['SSID', 'ssid'], ['MAC', 'mac'], ['Channel', 'channel'] ];

							userInterrupted = true;
							window.clearInterval(upcApp.t2);
							upcApp.infoWindow.indicator(0).setTitle(upcApp.messages.apConnConfigWindow).clearContent().clearButtons();
							upcApp.infoWindow.addButton(upcApp.messages.saveLabel, FinalSaveForExtendedScenario);
							upcApp.infoWindow.addButton(upcApp.messages.cancelLabel, abortSaveAction);

							$('input[name=ssid]').val(apItem.ssid);
							$('input[name=auth]').val(apItem.auth);
							$('input[name=mac]').val(apItem.mac);
							$('input[name=channel]').val(apItem.channel);
		$('input[name=enc]').val(apItem.enc);
		//$('select[name=enc]').val(apItem.enc);

							//these field are hidden, so clear their values to simplify the message
							$('select[name=authOpen]').val(' ');
							$('select[name=authWpa]').val(' ');

							tab = $('<table class="APlist"></table>');
							for (f in fields) {
								if (fields.hasOwnProperty(f)) {
									tab.append($('<tr class="aprow"></tr>').append('<td><b>' + fields[f][0] + ':</b></td>').append($('<td>' + apItem[fields[f][1]] + '</td>')));
								}
							}

							if (apItem.secure) {
								tab.append($('<tr class="aprow"></tr>').append('<td><b>' + upcApp.messages.securityKeyLabel + ':</b></td>').append($('<td><input type="password" name="apscan_seckey"/></td>')));
								upcApp.makePassBoxFancy(tab.find('input[name=apscan_seckey]'), null, 'seckeyfieldExtraStyle');
							}
							upcApp.infoWindow.addContent(tab);

						} //selectAP



						/*
						 * Renders received list of APs as a content of currently displayed overlay window
						 */
						function renderAPlist(jsonAPlist) {
							var i, tab, tr, td, info, item;

							function alreadyPresent() {
								//noop
							}

							upcApp.fancyMessage(upcApp.messages.waitForSave, false, null, undefined, abortSaveAction);

							upcApp.infoWindow.clearContent();
							tab = $('<table class="APlist"></table>');
							//tab.append($('<tr class="head"><td>AP name (SSID)</td><td>Channel</td><td>Secure</td><td>WPS</td><td>Signal</td></tr>'));
							tab.append($('<tr class="head"><td>' + upcApp.messages.ApName  +'</td><td>' + upcApp.messages.Channel  +'</td><td>' + upcApp.messages.Secure+'</td><td>WPS</td><td>' + upcApp.messages.Signal +'</td></tr>'));
							for (i in jsonAPlist) {
								if (jsonAPlist.hasOwnProperty(i)) {
									item = jsonAPlist[i];
									tr = $('<tr class="aprow"></tr>');
									tr.append($('<td>' + item.ssid + '<div class="macdiv">' + item.mac + '</div></td>'));
									tr.append($('<td class="center">' + item.channel + '</td>'));
									tr.append($('<td class="center">' + (item.secure ? '<img src="../img/wifi/secure.png"/>' : '') + '</td>'));
									tr.append($('<td class="center">' + (item.wps ? '<img src="../img/wifi/wps.png"/>' : '') + '</td>'));
									tr.append($('<td class="center"><div class="signal' + item.signal + '"></div></td>'));
									tab.append(tr);
									tr.click(
										function () {
											var ap = item;
											return function () {
												upcApp.stopTicking();
												selectAP(ap);
											};
										}()
									);
									//item.auth
									//item.enc
								}
							}
							upcApp.infoWindow.addContent(tab);
						} //renderAPlist



						/*
						 * Save procedure for Connection Type == WiFi Scanning:
						 * Asks device about list of the APs. Displays the list and update the list every 5-10 seconds.
						 * Display appropriate settings for chosen AP if selected.
						 */
						function wiFiScanSaveAction() {
							var seconds = upcApp.wifiScanTimeout,
							gotListOfAPs = null,
							ask = null;

							gotListOfAPs = function (data) {
								if (userInterrupted || upcApp.timeOut) {
									return;
								}

								if (typeof data.status !== 'undefined') { // any message for the user?
									upcApp.infoWindow.clearContent().addContent(data.status);
								}

								if (typeof data.list !== 'undefined') { // have we got the list?
									// we have, so render it or update existing one
									seconds = 0;
									renderAPlist(data.list);
									// if that is not end, ask again in few seconds
									if (typeof data.finished === 'undefined' || (typeof data.finished !== 'undefined' && data.finished === false)) {
										setTimeout(ask, 3000);
									} else { //end of searching, add a "Refresh" button
										upcApp.infoWindow.indicator(0).setTitle(upcApp.messages.apListWindowTitle);
										if (!upcApp.infoWindow.buttonExists(upcApp.messages.refreshLabel)) {
											upcApp.infoWindow.addButton(
												upcApp.messages.refreshLabel,
												function () {
													upcApp.startTicking(searchTimeout);
													upcApp.infoWindow.indicator(1);
													ask();
												}
											);
										}
										upcApp.stopTicking();
										upcApp.t2 = setTimeout(upcApp.killFancyWindow(), upcApp.wifiAPlistInactivityTimeout * 1000);
									}

								} else if (seconds > 5) { // wait 5 seconds and ask again
									seconds -= 5;
									setTimeout(ask, 5000);
								} else { // timeout
									cannotSaveConfiguration({'info' : upcApp.messages.saveTimeout});
								}
							};

							ask = function () {
								if (userInterrupted || upcApp.timeOut) { // we need to check that to avoid asking after user clicked "Cancel"
									return;
								}
								upcApp.talk2device(null, {action : 'getListOfAPs', page : 'basic'}, gotListOfAPs, cannotSaveConfiguration, null);
							};

							upcApp.fancyMessage(upcApp.messages.waitWhileScanning, true, null, undefined, abortSaveAction);
							ask();
							upcApp.startTicking(searchTimeout);
						} //wiFiScanSaveAction


						function wifiPBCSaveAction() {
							var ask = null;
							//tell the device to start the searching

							function tellUserThatPcbWontWork() {
								upcApp.stopTicking();
								upcApp.fancyMessage(upcApp.messages.errorLabel, false, null, null);
							} // tellUserThatPcbWontWork

							function abortPBC() {
								userInterrupted = true;
								upcApp.stopTicking();
								upcApp.talk2device(
									null,
									{
										action : 'abortPBCSearch',
										page : 'basic',
										homeNet : $('input[name=homeNet]:checked').val()
									},
									function (data) {
										upcApp.fancyMessage(upcApp.messages.wifiWpsConfigWindowLabel, false, data.status, null);
										userInterrupted = false;
									},
									null,
									null
								);
							} // abortPBC



							function checkIfReady(data) {
								if (typeof data.status === 'string') { // display current status
									upcApp.infoWindow.clearContent().addContent(data.status);
								}

								if (data.pbcFound === true) { // it is done, so tell the user and ...
									upcApp.stopTicking();
									upcApp.infoWindow.setTitle(upcApp.messages.wifipbcConnectionFound).clearContent().addContent(data.status);
									upcApp.infoWindow.indicator(0).clearButtons();
									if (data.restartNeeded === true) {
										upcApp.infoWindow.addContent('<br/>' + upcApp.messages.restartConfirmationWindowLabel);
										upcApp.infoWindow.addButton(
											upcApp.messages.okLabel,
											upcApp.confirmRestart(
												'basic',
												function () {
													upcApp.killFancyWindow()();
													upcApp.Wait4restart();
												},
												{
													connType: $('select[name=connType]').val(),
													homeNet: $('input[name=homeNet]:checked').val()
												}
											)
										);
									}
									upcApp.infoWindow.addButton(upcApp.messages.cancelLabel, upcApp.killFancyWindow());
								} else { //not ready, wait a second and ask again
									setTimeout(ask, upcApp.infoWindowTimeout * 1000);
								}
							} // checkIfready

							ask = function () {
								if (userInterrupted || upcApp.timeOut) { // we need to check that to avoid asking after user clicked "Cancel"
									return;
								}
								upcApp.talk2device(
									null,
									{
										action : 'pbcStatus',
										page : 'basic',
										homeNet : $('input[name=homeNet]:checked').val()
									},
									checkIfReady,
									cannotSaveConfiguration,
									null
								);
							};

							upcApp.fancyMessage(upcApp.messages.pres3pGW, true, null, undefined, abortPBC);

							upcApp.talk2device(
								null,
								{
									action : 'startPBCSearch',
									page : 'basic',
									homeNet : $('input[name=homeNet]:checked').val()
								},
								checkIfReady,
								tellUserThatPcbWontWork,
								null
							);
							upcApp.startTicking(searchTimeout);

						} //wifiPBCSaveAction


						function saveButtonClick() {
							var conType = $('select[name=connType] :selected').val(),
							currentSetting = $('input[name=homeNet]:checked').val() === 'yes',
							sm;

							userInterrupted = false;
							$('td#status').text('?');
							upcApp.startTicking(searchTimeout);

							if (originSetting === false && currentSetting === false) { //no change, no action
								upcApp.fancyMessage(upcApp.messages.homeNetConfigWindowLabel, false, upcApp.messages.alreadySaved, null);
							} else {
								switch (conType) {
								case 'wifiscan':
									wiFiScanSaveAction();
									break;
								case 'wifipbc':
									wifiPBCSaveAction();
									break;
								case 'eth':
									generalSaveAction(conType);
									break;
								case 'wifiman':
									sm = $('select[name=secMode]').val();
									if (currentSetting && (sm === 'wpap' || sm === 'wpae')) {
										if (!upcApp.validateWiFiPassword($('input[name=seckey]').val(), 'wpap')) {
											alert(upcApp.messages.wrongKey);
											$('input[name=seckey]').focus();
											return;
										}
									}
									generalSaveAction(conType);
									break;
								}
							}
						} //saveButtonClick

						return {
							/** 
							 * Assign style and event's actions to elements on "Basic->Home Network" page 
							 */
						pageBehaviour : function () {
							var netSet = $('div#content_box table tbody tr td');

							originSetting = $('input[name=homeNet]:checked').val() === 'yes';
							// assign handlers and run default action
							$('span#optNoLabel').click(function () { $('input[name=homeNet]').first().click(); });
							$('span#optYesLabel').click(function () { $('input[name=homeNet]').last().click(); });
							$('select[name=secMode]').change(securityModeChange);
							$('select[name=connType]').change(connectionTypeChange);
							$('input[name=homeNet]').change(HomeNetworkChange);
							$('input[name=homeNet]:checked').change();
							upcApp.makePassBoxFancy($('input[name=seckey]'), null, 'seckeyfieldExtraStyle');
							$('div.buttons_container div#submitButton').click(saveButtonClick);
							initdone = true;
						} //pageBehaviour

					};

				}()); // upcApp.basic.network

var basicInternetGenerator = function (version) {
					/** Send the Renew Ip command to the device */
						function ipRenewClicked() {
							upcApp.fancyMessage(upcApp.messages.waitForSave, true, null);
							upcApp.talk2device(
								null,
								{action : 'ipRenew', page : 'basic'},
								upcApp.defaultOnSuccessfulSave,
								function () { upcApp.fancyMessage(upcApp.messages.cannotRenewIP, false, null, null); },
								null
							);
						} // ipRenewClicked


						/** Send the Release Ip command to the device */
						function ipReleaseClicked() {
							upcApp.fancyMessage(upcApp.messages.waitForSave, true, null);
							upcApp.talk2device(
								null,
								{action : 'ipRelease', page : 'basic'},
								upcApp.defaultOnSuccessfulSave,
								function () { upcApp.fancyMessage(upcApp.messages.cannotReleaseIp, false, null, null); },
								null
							);
						} // ipReleaseClicked


						return {
							/** Assign style and event's actions to elements on "Basic->Home Network" page */
						pageBehaviour : function () {
							var btns = 'div.buttons_container div#';
							$(btns + 'renewIpButton.button').click(ipRenewClicked);
							$(btns + 'releaseIpButton.button').click(ipReleaseClicked);
								$('input.ipInput').blur(upcApp.checkIpField(version));
						} //pageBehaviour
					};
}

			upcApp.basic.internet = basicInternetGenerator("ip4"); 
			upcApp.basic.internet6 = basicInternetGenerator("ip6"); 


			upcApp.basic.lan = (function () { // objects and functions related to page "Basic->LAN"


					function DeviceAskedToSearchAndSaidItsOK(data) {
						if (typeof data.restartNeeded === 'boolean' && data.restartNeeded) {
							upcApp.fancyMessage(
								upcApp.messages.restartConfirmationWindowLabel,
								false,
								data.status, //content
								upcApp.confirmRestart(
									'basic',
									function (d) {
										var dd = d;
										upcApp.killFancyWindow()();
										upcApp.Wait4restart(dd);
									},
									$('form#mainForm').serialize2Object() //we need that
								),
								null //default cancel button
							);
						} else {
							upcApp.killFancyWindow()();
						}
					} //DeviceAskedToSearchAndSaidItsOK


					/** Display warning and send restart command to the device if user 
					 * clicked "OK", then wait 
					 */
						function saveSetting() {
							upcApp.fancyMessage(upcApp.messages.waitForSave, false, null);
							upcApp.talk2device(
								null, // "sendResult.cgi?section=networklan"
								// we send everything because the device might need more data than just simple command
								$("form#mainForm").serialize() + '&' + $.param({action: 'setLAN'}),
								DeviceAskedToSearchAndSaidItsOK,
								function (data) { upcApp.fancyMessage(upcApp.messages.saveFailure, false, data.status, null); },
								null // general Ajax Error handler
							);
						} // saveSettings


						return {
							/** Assign style and event's actions to elements on "Basic->Local Area Network" page */
						pageBehaviour : function () {
							$(upcApp.saveButton).unbind('click').click(saveSetting);
							$('input.ipInput').blur(upcApp.checkIpField("ip4"));
							upcApp.makeTableExtendable('staticDHCPClientTable', upcApp.staticDHCPClientRowCountLimit);
						} //pageBehaviour
					};

				}()); // upcApp.basic.lan


			upcApp.basic.dhcp = (function () { // objects and functions related to page "Basic->LAN"

						return {
						pageBehaviour : function () {
							$('div.buttons_container div#refreshButton.button').click(function () {location.reload(); });
						} //pageBehaviour
					};

				}()); // upcApp.basic.dhcp




// vim: set ts=4 sw=4 tw=79 :
