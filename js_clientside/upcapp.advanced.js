/*jslint devel: true, sloppy: true, nomen: true, maxerr: 100, indent: 4*/
/*global jQuery*/
/*global $*/

/**
 * UPCWebApp - Advanced Section related functions
 * @name upcapp.advanced.js
 */


var upcApp = upcApp || {};
upcApp.advanced = upcApp.advanced || {};


/**
 * objects and function related to page "Advanced->MAC Filters"
 * @name advanced.macFilters
 */
upcApp.advanced.macFilters = (function () {
		return {
			pageBehaviour : function () {
				$('input.macInput').blur(upcApp.checkMACfield);
				upcApp.makeTableExtendable('macFiltersTab', upcApp.advancedMACFiltersRowCountLimit);
			}
		};
	}()); // upcApp.advanced.macFilters


/**
 * objects and function related to page "Advanced->Port Filters"
 * @name advanced.portTriggers
 */
upcApp.advanced.portFilters = (function () {
		return {
			pageBehaviour : function () {
				$('input.portRangeInput').blur(upcApp.checkPortRangeField);
				upcApp.makeTableExtendable('portFiltersTab', upcApp.advancedPortFiltersRowCountLimit);
			}
		};
	}()); // upcApp.advanced.portFilters



/**
 * objects and function related to page "Advanced->Port Triggers"
 * @name advanced.portTriggers
 */
upcApp.advanced.portTriggers = (function () {
		return {
			pageBehaviour : function () {
				$('input.portRangeInput').blur(upcApp.checkPortRangeField);
				upcApp.makeTableExtendable('portTriggersTable', upcApp.advancedPortTriggersRowCountLimit);
			}
		};
	}()); // upcApp.advanced.portTriggers


/**
 * objects and function related to page "Advanced->Forwarding"
 * @name advanced.forwarding
 */
upcApp.advanced.forwarding = (function () {
		return {
			pageBehaviour : function () {
				$('input.portRangeInput').blur(upcApp.checkPortRangeField);
				$('input.ipInput').blur(upcApp.checkIpField("ip4"));
				upcApp.makeTableExtendable('forwardingTable', upcApp.advancedForwardingRowCountLimit);
			}
		};
	}()); // upcApp.advanced.forwarding

/**
 * objects and function related to page "Advanced-> Forwarding:IPv6"
 * @name advanced.forwarding6
 */
upcApp.advanced.forwarding6 = (function () {
		return {
			pageBehaviour : function () {
				$('input.portRangeInput').blur(upcApp.checkPortRangeField);
				$('input.ipInput').blur(upcApp.checkIpField("ip6"));
				upcApp.makeTableExtendable('ipv6forwardingTable', upcApp.advancedForwarding6RowCountLimit);
			}
		};
	}()); // upcApp.advanced.forwarding6

/**
 * objects and function related to page "Advanced->Options"
 * @name advanced.options
 */
upcApp.advanced.options = (function () {
		return {
			pageBehaviour : function () {

			}
		};
	}()); // upcApp.advanced.options


/**
 * objects and function related to page "Advanced->Options"
 * @name advanced.ipfilters
 */
upcApp.advanced.ipfilters = (function () {
		//2012083 : Added by YOUNG to apply request from Jan UPC
		function saveConfiguration() {
			var payload = $("form#mainForm").serialize() + '&' + $.param({action : 'saveRadio'});
			upcApp.fancyMessage(upcApp.messages.waitForSave, true);
			upcApp.talk2device(null, payload, upcApp.defaultOnSuccessfulSave, upcApp.defaultOnSaveIsNotPossible, null);
		} // saveConfiguration

		return {
			pageBehaviour : function () {
				//2012083 : Added by YOUNG to apply request from Jan UPC
				$(upcApp.saveButton).unbind('click').click(saveConfiguration);
				$('input.ipInput').blur(upcApp.checkIpField("ip4"));
				upcApp.makeTableExtendable('ipFiltersTab', upcApp.advancedIPFiltersRowCountLimit);
				//$('div.buttons_container div#addRowButton').click(function() { upcApp.extendTableBy1row('ipFiltersTab'); });
			}
		};
	}()); // upcApp.advanced.ipfilters

/**
 * objects and function related to page "Advanced->Options"
 * @name advanced.ipfilters6
 */
upcApp.advanced.ipfilters6 = (function () {
		function saveConfiguration() {
			alert('save');
			//var payload = $("form#mainForm").serialize() + '&' + $.param({action : 'saveRadio'});
			//upcApp.fancyMessage(upcApp.messages.waitForSave, true);
			//upcApp.talk2device(null, payload, upcApp.defaultOnSuccessfulSave, upcApp.defaultOnSaveIsNotPossible, null);
		} // saveConfiguration

		return {
			pageBehaviour : function () {
				$(upcApp.saveButton).unbind('click').click(saveConfiguration);
				$('input.ipInput').blur(upcApp.checkIpField("ip6"));
				upcApp.makeTableExtendable('ipv6FiltersTab', upcApp.advancedIPFilters6RowCountLimit);
			}
		};
	}()); // upcApp.advanced.ipfilters6

/**
 * objects and function related to page "Advanced->Options"
 * @name advanced.dmz
 */
upcApp.advanced.dmz = (function () {
		return {
			pageBehaviour : function () {
			$('input.ipInput').blur(upcApp.checkIpField("ip4"));
			}
		};
	}()); // upcApp.advanced.dmz


/**
 * objects and function related to page "Advanced->Options"
 * @name advanced.firewall
 */
upcApp.advanced.firewall = (function () {
		return {
			pageBehaviour : function () {
			}
		};
	}()); // upcApp.advanced.firewall

