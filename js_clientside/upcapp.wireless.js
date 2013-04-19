/*jslint devel: true, sloppy: true, nomen: true, maxerr: 100, indent: 4*/
/*global jQuery*/
/*global $*/

/**
 * UPCWebApp - Wireless section related stuff
 * @name upcapp.js
 * @version 1.0
 */


var upcApp = upcApp || {};

upcApp.wireless = upcApp.wireless || {};



/*****************************************************************************/
upcApp.wireless.wps = (function () { // Objects and functions related with page "Wireless->WPS"

		/** Display warning and send restart command to the device if user
		 * clicked "OK", then wait
		 */
		function saveConfiguration() {
			var payload = $("form#mainForm").serialize();
			upcApp.fancyMessage(upcApp.messages.waitForSave, true, null);
			upcApp.talk2device(null, payload, upcApp.defaultOnSuccessfulSave, upcApp.defaultOnSaveIsNotPossible, null);
		} // saveConfiguration



		function wpsChange() {
			switch ($(this).find(':selected').val()) {
			case 'enabled':
				$('div#pinStartButton').show();
				$('div#pbcStartButton').show();
				break;
			case 'disabled':
				$('div#pinStartButton').hide();
				$('div#pbcStartButton').hide();
				break;
			}
		}

		function wpsPinAction() {
			upcApp.fancyMessage(upcApp.messages.wifiWpsConfigWindowLabel, true, upcApp.messages.waitForSave);
			upcApp.talk2device(
				null,
				{
					action : 'wpsPin',
					page : 'wireless',
					pin : $('input[name=wpsPin]').val()
				},
				function (data) {
					upcApp.fancyMessage(upcApp.messages.saveSuccess, false, data.status, null);
				},
				function (data) {
					upcApp.fancyMessage(upcApp.messages.saveFailure, false, data.status, null);
				},
				null
			);
		}

		function wpsPbcAction() {
			upcApp.fancyMessage(upcApp.messages.wifiWpsConfigWindowLabel, true, upcApp.messages.waitForSave);
			upcApp.talk2device(
				null,
				{
					action : 'wpsPbc',
					page : 'wireless'
				},
				function (data) {
					/*120424 Modified by YOUNG by request from UPC*/
					upcApp.fancyMessage(upcApp.messages.pres3pGW, true, data.status, null);
				},
				function (data) {
					upcApp.fancyMessage(upcApp.messages.saveFailure, false, data.status, null);
				},
				null
			);
		}


		return {
			/** Assign style and event's actions to elements on "Wireless->Security"
			 *  page 
			 */
			pageBehaviour : function () {
				$('select[name=wpsEnabled]').change(wpsChange).change();
				$('input[name=wpsPin]').blur(upcApp.checkWPSPin);
				$('#pinStartButton').click(wpsPinAction);
				$('#pbcStartButton').click(wpsPbcAction);
				$(upcApp.saveButton).unbind('click').click(saveConfiguration);
			}
		};
	}()); // upcApp.wireless.wps
/*****************************************************************************/





/*****************************************************************************/
upcApp.wireless.security = (function () { // Objects and functions related with page "Wireless->Security"

		function SecModeChange() {

			function hideall() {
				var a, sections = ['wep', 'wpap', 'wpae'];
				for (a in sections) {
					if (sections.hasOwnProperty(a)) {
						$('table#wifiSecTable tr.' + sections[a]).hide();
					}
				}
			}

			hideall();
			switch ($(this).find(':selected').val()) {
			case 'none':
				break;
			case 'wep':
				$('table#wifiSecTable tr.wep').show();
				break;
			case 'wpap':
				$('table#wifiSecTable tr.wpap').show();
				break;
			case 'wpae':
				$('table#wifiSecTable tr.wpae').show();
				break;
			}
		} //SecModeChange


		function validateKeys() {
			var i, field,
			result = true,
			mode = $('select[name=wifiSecMode]').val();

			switch (mode) {
			case 'none':
				//nothing
				break;
			case 'wep':
				for (i in [0, 1, 2, 3]) {
					if (!upcApp.checkWiFiSecKey($('input[name=wepPassword' + i + ']'), mode)) {
						result = false;
					}
				}
				break;
			case 'wpap':
				result = upcApp.checkWiFiSecKey($('input[name=wpaPassword]'), mode);
				break;
			case 'wpae':
				result = upcApp.checkWiFiSecKey($('input[name=wpaEpassword]'), mode);
				break;
			}
			return result;
		}


		/**
		 * Display warning and send restart command to the device if user clicked "OK", then wait
		 */
		function saveConfiguration() {
			if (!validateKeys()) {
				return;
			}
			upcApp.fancyMessage(upcApp.messages.wifiSecConfigWindowLabel, true, upcApp.messages.waitForSave);
			upcApp.talk2device(null, $("form#mainForm").serialize(), upcApp.defaultOnSuccessfulSave, upcApp.defaultOnSaveIsNotPossible, null);
		} // saveConfiguration



		return {
			pageBehaviour : function () {
				$('input.ipInput').blur(upcApp.checkIpField("any"));
				$('select[name=wifiSecMode]').change(SecModeChange);
				$('select[name=wifiSecMode]').change();
				$(upcApp.saveButton).unbind('click').click(saveConfiguration);
			}
		};

	}()); // upcApp.wireless.security
/*****************************************************************************/




/*****************************************************************************/
upcApp.wireless.accessControl = (function () { // Objects and functions related with page "Wireless->Access Control"
		/** Display warning and send restart command to the device if user
		 * clicked "OK", then wait
		 */
		function saveConfiguration() {
			var payload = $("form#mainForm").serialize();
			upcApp.fancyMessage(upcApp.messages.waitForSave, true);
			upcApp.talk2device(null, payload, upcApp.defaultOnSuccessfulSave, upcApp.defaultOnSaveIsNotPossible, null);
		} // saveConfiguration



		/** Action for WirelessSecurityPolicy Selection change */
		function onPolicyChange() {
			//show/hide table accordingly to chosen option
			switch ($(this).find(':selected').val()) {
			case 'none':
				$('table#wirelessSecMacTableWhite').fadeOut('slow');
				$('table#wirelessSecMacTableBlack').fadeOut('slow');
				break;
			case 'white':
				$('table#wirelessSecMacTableBlack').hide();
				$('table#wirelessSecMacTableWhite').hide().fadeIn('slow');
				break;
			case 'black':
				$('table#wirelessSecMacTableWhite').hide();
				$('table#wirelessSecMacTableBlack').hide().fadeIn('slow');
				break;
			}
		} // onPolicyChange



		return {
			/** Assign style and event's actions to elements on "Wireless->Security"
			 * page 
			 */
			pageBehaviour : function () {
				$('select[name=WirelessSecurityPolicy]').change(onPolicyChange);
				$('input.macInput').blur(upcApp.checkMACfield);
				$('select[name=WirelessSecurityPolicy]').change();

				upcApp.makeTableExtendable('wirelessSecMacTableWhite', upcApp.wirelessAccessControlRowCountLimit);
				upcApp.makeTableExtendable('wirelessSecMacTableBlack', upcApp.wirelessAccessControlRowCountLimit);

				$(upcApp.saveButton).unbind('click').click(saveConfiguration);
			}
		};

	}()); // upcApp.wireless.accessControl
/*****************************************************************************/






/*****************************************************************************/
upcApp.wireless.radio = (function () { // Objects and functions related with page "Wireless->Radio"


		/** Display warning and send restart command to the device if user 
		 * clicked "OK", then wait 
		 */
		function saveConfiguration() {
			var payload = $("form#mainForm").serialize() + '&' + $.param({action : 'saveRadio'});
			upcApp.fancyMessage(upcApp.messages.waitForSave, true);
			upcApp.talk2device(null, payload, upcApp.defaultOnSuccessfulSave, upcApp.defaultOnSaveIsNotPossible, null);
		} // saveConfiguration


		function EnableDisable() {
			switch ($(this).val()) {
			case 'enabled':
				$('table#radioSetTable tr').show();
				break;
			case 'disabled':
				$('table#radioSetTable tr').hide();
				$('table#radioSetTable tr.head').show();
				$('table#radioSetTable tr.odd').show();
				break;
			}
		}

		function verifyChannel() {
			var val = $('select[name=channel]').val(),
				warningValuesRange = { from: 52, to: 136 };
			if (warningValuesRange.from <= val && val <= warningValuesRange.to) {
				upcApp.fancyMessage(upcApp.messages.wirelessChannelRangeInfo);
				upcApp.infoWindow.indicator(0).clearContent().clearButtons();
				upcApp.infoWindow.addButton(upcApp.messages.okLabel, upcApp.killFancyWindow());
			}
		}

		return {
			/** Assign style and event's actions to elements on "Wireless->Radio" page */
			pageBehaviour : function () {
				$(upcApp.saveButton).unbind('click').click(saveConfiguration);
				$('select[name=enable]').change(EnableDisable);
				$('select[name=enable]').change();
				$('select[name=channel]').change(verifyChannel);
			} //pageBehaviour
		};

	}()); // upcApp.wireless.radio
/*****************************************************************************/




/*****************************************************************************/
upcApp.wireless.advanced = (function () { // Objects and functions related with page "Wireless->Advanced"

		/** Display warning and send restart command to the device if user 
		 * clicked "OK", then wait 
		 */
		function saveConfiguration() {
			upcApp.fancyMessage(upcApp.messages.wifiAdvConfigWindowLabel, true, upcApp.messages.waitForSave);
			upcApp.talk2device(null, $("form#mainForm").serialize(), upcApp.defaultOnSuccessfulSave, upcApp.defaultOnSaveIsNotPossible, null);
		} // saveConfiguration


		return {
			/** Assign style and event's actions to elements on "Wireless->Advanced" page */
			pageBehaviour : function () {
				$(upcApp.saveButton).unbind('click').click(saveConfiguration);
			} //pageBehaviour
		};

	}()); // upcApp.wireless.advanced
/*****************************************************************************/

// vim: set ts=4 sw=4 tw=79 :
