/*jslint devel: true, sloppy: true, nomen: true, maxerr: 100, indent: 4*/
/*global jQuery*/
/*global $*/
/*global setTimeout*/
/*global window*/
/*global clearInterval*/
/*global setInterval*/

/**
 * UPCWebApp
 * @name upcapp.general.js
 */

/**
 * Creates JS object according to data returned by jQuery function - serializeArray
 * @see http://api.jquery.com/serializeArray/
 * @name serialize2Object
 * @function
 */
$.fn.serialize2Object = function () {
	var obj = {},
	array = this.serializeArray();

	$.each(
	array, function () {
			if (obj[this.name] !== undefined) {
				if (!obj[this.name].push) {
					obj[this.name] = [obj[this.name]];
				}
				obj[this.name].push(this.value || '');
			} else {
				obj[this.name] = this.value || '';
			}
	});
	return obj;
};

$.extend({
	GET: function () {
		// Parse GET arguments and return a dictionary
		var dict = [], 
			elem;
			hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

		for(var i = 0; i < hashes.length; i++)
		{
			elem = hashes[i].split('=');
			dict.push(elem[0]);
			dict[elem[0]] = elem[1];
		}
		return dict;
	}
});

/**
 * That function blocks HTML form submition on enter keystroke.
 */
$(document).ready(function() {
	$('form').bind("keypress", function(e) {
	  var code = e.keyCode || e.which; 
	  if (code  == 13) {               
		e.preventDefault();
		return false;
	  }
	});
});

/**
 * Capitalize string
 * @name capitalize
 * @function
 * @return capitalized copy
 */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 * UpcWebApp main object
 * @class
 */
var upcApp = {

	/** Time for restart in seconds */
	time4restart : 90,

	/** How long should I display the info window [s]*/
	infoWindowTimeout : 10,


	/** How long should I wait for user to click the PBC button */
	WpsPbcWaitTime: 180,
	// [s]
	pbcSearchTimeout: 180,
	//[s]
	EthSearchTimeout: 180,
	//[s]
	wifiScanTimeout: 30,
	//[s]
	wifiAPlistInactivityTimeout: 30,
	//[s]
	connectionSearchTimeout: 180,
	//[s]
	maxItemsPerList : 12,

	/** limits for row counts in flexible tables */
	defaultTableRowCountLimit : 15,
	advancedIPFiltersRowCountLimit : 15,
	advancedMACFiltersRowCountLimit : 15,
	advancedPortFiltersRowCountLimit : 15,
	advancedForwardingRowCountLimit : 15,
	advancedPortTriggersRowCountLimit : 15,
	wirelessAccessControlRowCountLimit : 16,
	parentalControlDeviceRulesRowCountLimit: 10,
	parentalControlWebSiteFiltersPoliciesLimit: 10,
	parentalControlToDFiltersPoliciesLimit: 10,
	advancedIPFilters6RowCountLimit : 15,
	advancedForwarding6RowCountLimit : 15,
	staticDHCPClientRowCountLimit: 10,

	/** jQuery general selector for buttons */
	buttons : 'div.buttons_container',


	/** jQuery selector fo "SAVE" button used across the app. */
	saveButton : 'div#saveButton',

	/** page_blocked settings **/
	durationMaxValue : 1440,

	timeOut : false,
	timeElapsed : 0,
	t : null,
	t2 : null,



	/** Global placeholder for DOM elements; used for hiding OPTION elements 
	 * (IE hack) 
	 */
	buffer : [],

	mouseHold : false,

	/**
	 * Default handler for successful options saving operation.
	 * It reloads webpage or just hide popup window.
	 * @name defaultOnSuccessfulSave
	 * @function
	 * @param data - JSON returned by server. It should contains following properties:
	 *					- refreshNeeded
	 *					- reloadDelay
	 */
	defaultOnSuccessfulSave : function (data) {
		var refreshNeeded = ((typeof data.refreshNeeded === 'boolean') && (data.refreshNeeded || false)),
		delay = ((typeof data.reloadDelay === 'number' && data.reloadDelay) || 1);
		setTimeout(

			function () {
				if (refreshNeeded) {
					location.reload(true);
				} else {
					upcApp.killFancyWindow(upcApp.infoWindow)();
				}
		}, delay);
			},
	//onSuccessfulSave

	/**
	 * Default handler for unsuccessful options saving operation.
	 * Shows popup with information about the problem.
	 * @name defaultOnSaveIsNotPossible
	 * @function
	 * @param data - returned by server, it should has status property (which would be shown)
	 */
	defaultOnSaveIsNotPossible : function (data) {
		if (typeof upcApp.infoWindow.isVisible !== "function") { // info window was not show during initialization, creating now for error info
			upcApp.infoWindow = upcApp.fancyModalWindow().Open();
		}

		upcApp.infoWindow.indicator(0).clearContent().setTitle(upcApp.messages.saveFailure);
		if (typeof data.status === 'string') {
			upcApp.infoWindow.addContent(data.status);
		}
		upcApp.infoWindow.addButton(upcApp.messages.okLabel, upcApp.killFancyWindow(upcApp.infoWindow));
	},
	//onSaveIsNotPossible

	/**
	 * Default handler of save operation. It send data from form 'form#mainForm' and is able to add
	 * some additional data via parameters or show popup with operation indicator.
	 * @name defaultSaveConfiguration
	 * @function
	 * @param addPayload - additional data to send
	 * @param showFancyWindow {Boolean} value
	 */
	defaultSaveConfiguration : function (addPayload, showFancyWindow) {
		var payload = '';

		// default action shows window with indication	
		if (typeof showFancyWindow === "undefined") {
			showFancyWindow = true;
		}

		if (typeof addPayload === 'object') {
			payload = '&' + $.param(addPayload);
		}

		upcApp.killFancyWindow(upcApp.infoWindow)();

		if (showFancyWindow) {
			upcApp.infoWindow = upcApp.fancyModalWindow().Open(upcApp.messages.waitForSave).indicator(1);
		}

		upcApp.talk2device(
		null, $("form#mainForm").serialize() + payload, upcApp.defaultOnSuccessfulSave, upcApp.defaultOnSaveIsNotPossible, null);
	},
	// saveConfiguration


	/**
	 * General action for 'Save' button
	 * @name submitButtonAction
	 * @function
	 */
	submitButtonAction : function () {
		// is there a submit button on this page?
		if (typeof ($(upcApp.saveButton)) !== 'undefined' && $(upcApp.saveButton).length > 0) {
			//only if there was no other click action
			if (typeof $(upcApp.saveButton).data('events') === 'undefined' || typeof $(upcApp.saveButton).data('events').click === 'undefined') {

				$(upcApp.saveButton).click(

					function () {
						upcApp.defaultSaveConfiguration();
				});
			}
			// adding tab focus ability
			$(upcApp.saveButton).keydown(upcApp.runOnEnterPressed(upcApp.defaultSaveConfiguration));
			upcApp.addUnderlineOnIEFocus(upcApp.saveButton);

		}
	},


	/**
	 * Validate given MAC address. 
	 * @return {String} Validated mac in form 00:00:00:00:00:00
	 * @param {String} mac The acceptable forms are:<ul><li>00:00:00:00:00:00
	 * </li><li>00.00.00.00.00.00</li><li>00,00,00,00,00,00</li><li>00 00 00 00 
	 * 00 00</li><li>00-00-00-00-00-00</li><li>000000000000</li></ul>
	 */
	validateMAC : function (mac) { // MAC address validation
		var re = /([0-9a-fA-F]{2})/g,
		f = null;
		if ((typeof (mac) !== 'undefined') && (mac.length > 0)) {
			f = mac.match(re);
			if (f !== null && f.length === 6) {
				return f[0] + ':' + f[1] + ':' + f[2] + ':' + f[3] + ':' + f[4] + ':' + f[5];
			} else {
				return null;
			}
		}
		return f;
	},

	/**
	 * Validate given port range or number.
	 * @return {Object} Validated portRagne: {a:number, b:number}
	 * @param {String} portNumber
	 */
	validatePortRange : function (portRange) { // Port Range validationA
		var re = /(\d+)\ *[\-\~\:\ ]+\ *(\d+)/,
		f = null,
			portMax = 65535;

		if ((typeof (portRange) !== 'undefined') && (portRange.length > 0)) {
			// input match range expresion
			f = portRange.match(re);
			if (f !== null && f.length === 3) {
				f[1] = f[1] > portMax ? portMax : parseInt(f[1], 10);
				f[2] = f[2] > portMax ? portMax : parseInt(f[2], 10);
				return { a : f[1], b : f[2] };
			} 

			// input match single number expresion
			re = /(\d+)/;
			f = portRange.match(re);
			if (f !== null && f.length === 2) {
				f[1] = f[1] > portMax ? portMax : parseInt(f[1], 10);
				return { a : f[1], b : f[1] };
			}
		}

		// in every other scenario just return null
		return null;
	},

	/**
	 * Validate IP number.
	 * @return {String} Validated IP number in form 0.0.0.0
	 * @param {String} ip  IP number string
	 */
		validateIP : function (ip) { // IP number validation
			var re = /^\b(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
			f = null,
			i;
			
			if ((typeof (ip) !== 'undefined') && (ip.length >= 7)) {
				f = ip.match(re);
				if (f !== null && f.length === 5) {
					for (i = 1; i < 5; i += 1) {
						f[i] = f[i] > 255 ? 255 : parseInt(f[i], 10);
					}
					return f[1] + '.' + f[2] + '.' + f[3] + '.' + f[4];
				}
			}
			return null;
		},

	/**
	 * Validate IP number.
	 * @return {String} Validated IP number in form 0.0.0.0
	 * @param {String} ip  IP number string
	 */
		validateIP6 : function (ip) { // IP number validation
			var re = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
			
			if (re.test(ip)) return ip;
			return null;
		},

		/**
		 * Validate content of form fields designed for MAC addresses
		 * @this input.macInput
		 * @see validateMAC
		 */
		checkMACfield : function () {
			var mac = $(this).val(),
			newmac = null,
			el = null;
			// remove old warning message if any
			$(this).parent().find('.wrongMacAddress').fadeOut('slow').delay(800).remove();
			if (mac.length > 0) {
				newmac = upcApp.validateMAC(mac);
				if (newmac === null) {
					el = $('<p class="wrongMacAddress"> <b>' + upcApp.messages.wrongMacAddress + '</b> </p>').hide();
					$(this).addClass('wrong').parent().append(el);
					$(this).parent().find('.wrongMacAddress').fadeIn('slow').focus();
				} else {
					$(this).removeClass("wrong").val(newmac);
				}
			} else {
				$(this).removeClass("wrong");
			}
		},


		/**
		 * Validate content of form fields designed for Port Range definitions
		 * @this input.portRangeInput
		 * @see validatePortRange
		 */
		checkPortRangeField : function () {
			var rangeString = $(this).val(),
			range, low, high, el;

			// remove old warning message if any
			$(this).parent().find('b').fadeOut('slow').delay(800).remove();
			if (rangeString.length > 0) {
			// changed due to UPC request to let the user enter just one port number OR range
				range = upcApp.validatePortRange(rangeString);
				if (range === null) {
					el = $('<b>' + upcApp.messages.wrongPortRange + '</b>').hide();
					$(this).addClass('wrong').parent().append(el);
					$(this).parent().find('b').fadeIn('slow').focus();
				} else {
					low = Math.min(range.a, range.b);
					high = Math.max(range.a, range.b);
					low = low < 0 ? 0 : low;
					high = high > 65535 ? 65535 : high;
				if (low == high) {
					$(this).removeClass("wrong").val(low);
				} else {
					$(this).removeClass("wrong").val(low + '-' + high);
				}
			}
			} else {
				$(this).removeClass("wrong");
			}
		},


		/**
		 * Validate content of form fields designed for IP addresses
		 * @this input.ipInput
		 * @see validateIP
		 */
		checkIpField : function (version) { 
			return function () {
			var ip  = $(this).val(),
			ipnew = null,
			el = null;

			// remove old warning message if any
			$(this).parent().find('b').fadeOut('slow').delay(800).remove();
			if (ip.length > 0) {
					if (version == "ip4") {
				ipnew = upcApp.validateIP(ip);
					} else if (version == "ip6") {
						ipnew = upcApp.validateIP6(ip);
					} else if (version == "any") {
						ipnew = upcApp.validateIP(ip);
						if (!ipnew) ipnew = upcApp.validateIP6(ip);
					} else {
						console.log("ip not recognized");
						return;
					}
				if (ipnew === null) {
					el = $('<b>' + upcApp.messages.wrongIP + '</b>').hide();
					$(this).addClass('wrong').parent().append(el);
					$(this).parent().find('b').fadeIn('slow').focus();
				} else {
					$(this).removeClass("wrong").val(ipnew);
				}
			} else {
				$(this).removeClass("wrong");
			}
			}
		},

		/**
		 * Validate content of PIN fields
	         * @name checkWPSPin
	         * @function
		 */
		checkWPSPin : function () {
			var pin  = $(this).val().match(/\d+/),
			wrong = false,
			el = null;
			// remove old warning message if any
			$(this).parent().find('b').fadeOut('slow').delay(800).remove();

			if (pin.length > 0) {
				wrong = pin[0].length !== 8;
			} else {
				wrong = true;
			}

			if (wrong) {
				el = $('<b>' + upcApp.messages.wrongPIN + '</b>').hide();
				$(this).addClass('wrong').parent().append(el);
				$(this).parent().find('b').fadeIn('slow').focus();
			} else {
				$(this).removeClass("wrong");
			}
		},


	/**
	 * Validates wifi password (with regex) according to wifi mode.
	 * @name validateWiFiPassword
	 * @function
	 * @param password
	 * @param mode
	 * @return {Boolean} is valid?
	 */
		validateWiFiPassword : function (password, mode) {
		var maxlen = {
			wep: 26,
			wpap: 64,
			wpae: 64
		},
			minlen = {
				wep: 1,
				wpap: 8,
				wpae: 1
			};
                // YOUNG : The condition (mode === 'wpap') is added to avoid error msg wpap was choosen.
		if ((typeof password === 'undefined') || (password === '')|| (mode === 'wpap')) {
			return true;
		} 
		return (password.length >= minlen[mode] && password.length <= maxlen[mode]);

	},
	//validateWiFiPassword


		/**
		 * Validate security Key
		 * @param isHex : can be any non zero value or function that returns such value
		 */
		checkWiFiSecKey : function (field, mode) {
			var result = true;

			field.parent().find('b').fadeOut('slow').delay(800).remove();
			if (!upcApp.validateWiFiPassword(field.val(), mode)) {
				field.addClass('wrong').parent().append($('<b>' + upcApp.messages.wrongKey + '</b>').hide());
				field.parent().find('b').fadeIn('slow').focus();
				result = false;
			} else {
				field.removeClass("wrong");
			}
			return result;
	},
	// checkWiFiSecKey

	/**
	 * Hack for IE to make text underline on focus.
	 * @name addUnderlineOnIEFocus
	 * @function
	 * @param btn
	 */
		addUnderlineOnIEFocus : function (btn) {
			if ($.browser.msie) {
				$(btn).focus(function () { 
						$($(btn).find("div")[2]).css("text-decoration", "underline");       
					});
				$(btn).blur(function () { 
						$($(btn).find("div")[2]).css("text-decoration", "");       
					});
			}
		},

	/**
	 * Add styles to the button.
	 * Close buttons content in div and surround it  with 2 additional divs
	 * @name styleButton
	 * @function
	 * @param btn
	 */
		styleButton : function (btn) {
		$(btn).html('<div style="background:none;">&nbsp;</div> <div class="left">&nbsp;</div><div>' + $(btn).html() + '</div><div class="right">&nbsp;</div>');

			$(btn).attr("tabindex","0");
			upcApp.addUnderlineOnIEFocus(btn);
		        $(btn).keydown(upcApp.runOnEnterPressed(function () {
			$(btn).click();
		}));

	},

	/**
	 * Modify button's div to get the UPC look&feel
	 * @name styleButtons
	 * @function
	 */
		styleButtons : function () { // Styling the button's divs
			$('div.button').each(

				function () {
					upcApp.styleButton(this);
		});
		},

	/**
	 * Validate IP address segment
	 * @name ipSegmentFieldValidate
	 * @function
	 */
		ipSegmentFieldValidate : function () {
			var x = parseInt($(this).val(), 10);
			if (x >= 0 && x <= 255) {
				$(this).removeClass('wrong').val(x);
			} else {
				$(this).val(0);
			}
		},


	/**
	 * Handler for language selectbox change.
	 * @name hookLangChooser
	 * @function
	 */
		hookLangChooser : function () {
			$('div#site_lang select[name=site_lang]').change(

				function () {
					var lang = $(this).val();
			        upcApp.talk2device('sendResult.cgi', {
				action: 'setLang',
				newlang: typeof lang === 'string' && lang.length === 2 ? lang : 'en'
			}, function () {
				window.location.reload(true);
			}, function () { /*do nothing*/
			}, null);
		});
	},

	injectTokenSubmit: function () {
		var findFormToken = function (elem) {
			var form = $(elem).closest("form"),
				token = $(form).find('input[name=token_csrf]').val();
			return token;	
		};

		$.each($("div.button"), function(i, btn) {
			var events = $(btn).data('events'),
				clicks = events.click || [{}],
				handler = clicks[0].handler || null;

			if (typeof handler === "function") {
			$(btn).unbind('click');
			$(btn).click(function () {
				if (!upcApp.authToken) {
					var token = findFormToken(btn);
					upcApp.authToken = token;
				}
				handler();
			});
			};
		});	
	},

	/**
	 * Run standard functions to style and attach handlers before showing page
	 * @name generalPageBehaviour
	 * @function
	 */
		generalPageBehaviour : function () {
			upcApp.styleButtons();
			upcApp.submitButtonAction();
			upcApp.styleIpSegmentFields();
			upcApp.hookLangChooser();
		upcApp.injectTokenSubmit();
	},


	/**
	 * Assign actions on focus/blur events for IP segment fields
	 * @name styleIpSegmentFields
	 * @function
	 */
		styleIpSegmentFields : function () {
			$('input.ip').attr('maxlength', '3');
			$('input.ip').blur(upcApp.ipSegmentFieldValidate);
			$('input.ip').focus(upcApp.ipSegmentFieldValidate);
		},


	/**
	 * General Ajax error handler
	 * @name generalAJAXError
	 * @function
	 */
		generalAJAXError : function () {
			alert(upcApp.messages.generalAjaxError);
			//  prevent blocking application by fancy window
			upcApp.killFancyWindow()();
		},


		/**
		 * Talk to Device via AJAX 
		 * @param {String} api An addres to which the request will be sent
		 * @param {Object} message Request object, for instance { action:'restart' }
		 * @param {Function} onGotAndSaidItsOK Callback function invoked when device responded with status 200
		 * @param {Function} onGotAndSaidItsNOTOK Callback function invoked when device responded with status 304
		 * @param {Function} onFailure Callback function
		 */
		talk2device : function (api, message, onGotAndSaidItsOK, onGotAndSaidItsNOTOK, onFailure) {
		if (message) {
			message.token_csrf = upcApp.authToken;
		};
			$.ajax({
					type: 'POST',
					url: api || $('#mainForm').attr('action'),
					data: message,
					dataType : 'json',
					error : onFailure || upcApp.generalAJAXError,
					success : function (data) {
						if (data.result === 'success') {
							if (typeof onGotAndSaidItsOK === 'function') {
								onGotAndSaidItsOK(data);
							}
						} else if (data.result === 'fail') {
							if (typeof onGotAndSaidItsNOTOK === 'function') {
								onGotAndSaidItsNOTOK(data);
							}
						}
					}
				});
		},



	/**
	 * Display timer and reload page when time is up
	 * @name Wait4restart
	 * @function
	 */
		Wait4restart : function () {
			var data = (typeof arguments !== undefined && arguments[0]) || {},
			infowindow = upcApp.fancyModalWindow().Open(upcApp.messages.pleaseWait4restart).indicator(1),
			countSeconds = null,
			newUrl = (typeof data.newUrl === 'string' && data.newUrl !== '') ? data.newUrl : null;

			if (typeof data.status === 'string' && data.status !== '') {
				infowindow.addContent(data.status);
			}
			infowindow.addContent('<div id="timer">' + upcApp.time4restart + '</div>');

			countSeconds = function () {
				var x = parseInt($('div#timer').html(), "10");
				setTimeout(

					function () {
						x -= 1;
						$('div#timer').html(x);
						if (x === 0) { // '==' intentionally
							if (newUrl !== null) {
								window.location.href = newUrl;
							} else {
								window.location.reload();
							}
							return;
						} else {
							countSeconds();
						}
			}, 1000);
			};

			countSeconds();
	},



	/**
	 * Validator for input text fields. Checks if number is within the given boundaries,
	 * sets the default value if needed.
	 *
	 * @name validateNumber
	 * @function
	 * @param mini
	 * @param maxi
	 * @param dflt
	 */
		validateNumber : function (mini, maxi, dflt) {
			return function () {
				var def  = dflt,
				minV = mini,
				maxV = maxi,
				val = parseInt($(this).val(), 10);
				if (isNaN(val) || val < minV || val > maxV) {
					val = def;
				}
				$(this).val(val);
			};
	},



	/**
	 * Prepare passbox to show
	 * @name makePassBoxFancy
	 * @function
	 * @param passwordfield
	 * @param extraButtonClass
	 * @param extraFieldClass
	 */
		makePassBoxFancy : function (passwordfield, extraButtonClass, extraFieldClass) {
		var i, klas, passbox, textbox, checkbox, origin = $(passwordfield),
			klassList = origin[0].classList;

			passbox = $('<input type="password"/>').attr('id', origin.attr('id')).attr('name', origin.attr('name')).val(origin.val());
			textbox = $('<input type="text"/>').attr('id', origin.attr('id')).attr('name', origin.attr('name')).val(origin.val());

			//copy classes
			for (i in klassList) {
				if (klassList.hasOwnProperty(i)) {
					passbox.addClass(klassList[i]);
					textbox.addClass(klassList[i]);
				}
			}

			if (typeof extraFieldClass === 'string') {
				passbox.addClass(extraFieldClass);
				textbox.addClass(extraFieldClass);
			}

			function checkBoxClick() {
				var that = $(this),
				f = that.parent().find('input[type!=checkbox]');
				if (f.attr('type') === 'password') { // replace with regular edit box
					f.replaceWith(textbox.val(f.val()));
					that.addClass('clicked');
				} else { // replace with password box
					f.replaceWith(passbox.val(f.val()));
					that.removeClass('clicked');
				}
			}
			checkbox = $('<div id="showLettersButton"></div>').click(checkBoxClick);
			if (typeof extraButtonClass === 'string') {
				checkbox.addClass(extraButtonClass);
			}
			origin.parent().append(checkbox);
			origin.replaceWith(passbox);
		},


	/**
	 * Modal window which is show many times in this app.
	 * @constructor
	 * @name fancyModalWindow
	 * @function
	 */
		fancyModalWindow : function () {
			var visible = false,
			obj = {
				html : $('<div></div>').addClass('modal'),

				_createBackground : function () {
					var bg = $('<div><div>').addClass('modal_bg');
					$('body').append(bg);
					bg.show();
				},

				_destroyBackground : function () {
					$('.modal_bg').remove();
				},

				setTitle : function (title) {
					this.html.find('h2#title').text(title);
					return this;
				},

				/**
				 * Basic structore of popup.
				 * @name _build
				 * @function
				 */
				_build : function () {
					var img_holder = $('<div style="float: right; margin:5px;"> </div>');
					img_holder.append($('<img src="../img/loader.gif" id="waitIndicator" style="display:none"/>'));
					this.html.append(img_holder);
					this.html.append($('<h2 id="title"></h2>').css('display', 'block'));
					this.html.append($('<div id="ovrl_content"></div>'));
					this.html.append($('<div id="ovrl_buttons" class="buttons_container"></div>'));
				},

				addButton : function (caption, action) {
					this.html.find('#ovrl_buttons').append($('<div class="button"><div class="left"></div><div>' + caption + '</div><div class="right"></div></div>').click(action));
					return this;
				},

				clearButtons : function () {
					this.html.find('#ovrl_buttons').html('');
					return this;
				},

				buttonExists : function (caption) {
					var exists = false;

					this.html.find('#ovrl_buttons').find('div').each(

						function () {
							if ($(this).text() === caption) {
								exists = true;
							}
					});
					return exists;
				},

				/**
				 * Shows or hides loading indicator.
				 * @name indicator
				 * @function
				 * @param show {Boolean} show indicator?
				 */
				indicator : function (show) {
					var indicator = this.html.find('img#waitIndicator');
					if (show) {
						indicator.show();
					} else {
						indicator.hide();
					}
					return this;
				},

				_center : function () {
					var bkg = $('.modal_bg');
					this.html.css('left', (bkg.width() - this.html.width()) / 2 + 'px');
					if (this.html.height() < bkg.height()) {
						this.html.css('top', (bkg.height() - this.html.height()) / 4 + 'px');
					} else {
						this.html.css('top', '0px');
					}
				},

				clearContent : function () {
					this.html.find('#ovrl_content').html('');
					return this;
				},

				addContent : function (content) {
					this.html.find('#ovrl_content').append(content);
					this._center();
					return content;
				},


				Open : function (title) {
					visible = true;
					this._createBackground();
					this._build();
					$('body').append(this.html);
					if (typeof title === 'string') {
						this.setTitle(title);
					} else {
						this.setTitle('Info');
					}
					this._center();
					this.html.show();
					return this;
				},

				Close : function () {
					visible = false;
					this.html.remove();
					this._destroyBackground();
				},

				isVisible : function () {
					return visible;
				}
			};

			return obj;
		},

	/**
	 * Close given popup window, when no parameter given it closes default infoWindow.
	 * @name killFancyWindow
	 * @function
	 * @param windowInstance
	 */
		killFancyWindow : function (windowInstance) {
			return function () {
				var inst = typeof windowInstance !== 'undefined' ? windowInstance : upcApp.infoWindow; //if window instance not defined, use the global one
				if (typeof inst === 'object' &&  inst !== null) {
					inst.Close();
					inst = null;
				}
			};
		},


		/* 
		 * Display fancy message window with chosen buttons.
		 * if onOK defined - okButton will be displayed (if function passed, will be executed)
		 * if onCancel defined - cancelButton will be displayed (if function passed, will be executed)
	 *
	 * @name fancyMessage
	 * @function
	 * @param title
	 * @param indicator
	 * @param message
	 * @param onOK
	 * @param onCancel
		 */
		fancyMessage : function (title, indicator, message, onOK, onCancel) {
			upcApp.killFancyWindow()();
			upcApp.infoWindow = upcApp.fancyModalWindow().Open(title);

			if (typeof indicator === 'boolean' && indicator) {
				upcApp.infoWindow.indicator(1);
			} else {
				upcApp.infoWindow.indicator(0);
			}

			if (typeof onOK === 'function') {
				upcApp.infoWindow.addButton(upcApp.messages.okLabel, onOK);
			} else if (onOK === null) {
				upcApp.infoWindow.addButton(upcApp.messages.okLabel, upcApp.killFancyWindow());
			}

			if (typeof onCancel === 'function') {
				upcApp.infoWindow.addButton(upcApp.messages.cancelLabel, onCancel);
			} else if (onCancel === null) {
				upcApp.infoWindow.addButton(upcApp.messages.cancelLabel, upcApp.killFancyWindow());
			}

			if (typeof message === 'string') {
				upcApp.infoWindow.addContent(message);
			}
		},


	/**
	 * Returns a function that can confirm restart to the server
	 * @name confirmRestart
	 * @function
	 * @param originpage
	 * @param onsuccess
	 * @param addPayload
	 */
		confirmRestart : function (originpage, onsuccess, addPayload) {
			return function () {
				var after = onsuccess,
				i, payload = {
					action: 'restartConfirmed',
					page: originpage
				};
				// copy additional data to send if any
				if (typeof addPayload === 'object' && addPayload !== null) {
					for (i in addPayload) {
						if (addPayload.hasOwnProperty(i)) {
							payload[i] = addPayload[i];
						}
					}
				}

			$.ajax({
						type: 'POST',
						url: $('#mainForm').attr('action'),
						data: payload,
						dataType : 'json',
						error : upcApp.generalAJAXError,
						success : (typeof after === 'function') ? after : null
			});
			};
		},



	/**
	 * Runs action after timeout.
	 * @name tick
	 * @function
	 * @param toAction
	 */
		tick : function (toAction) {
			var toa = toAction,
			that = this;

			return function () {
				that.timeElapsed += 1;
				that.timeOut = that.timeElapsed > that.connectionSearchTimeout;
				if (that.timeOut) {
					window.clearInterval(that.t);
					if (typeof toa === 'function') {
						toa();
					}
				}
			};
		},


	/**
	 * Stops the clock.
	 * @name stopTicking
	 * @function
	 */
		stopTicking : function () {
			this.timeElapsed = 0;
			this.timeOut = true;
			window.clearInterval(this.t);
		},


	/**
	 * Starts the clock.
	 * @name startTicking
	 * @function
	 * @param onTimeOut
	 */
		startTicking : function (onTimeOut) {
			var timeoutAction = onTimeOut;
			this.stopTicking();
			this.timeOut = false;
			this.t = window.setInterval(this.tick(timeoutAction), 1000);
		},


	/**
	 * Clicks the 'add row' button when tab key pressed.
	 * @name tabHandler
	 * @function
	 * @param event
	 */
		tabHandler : function(event) {
		if (event.keyCode === 9) { //tab
				event.preventDefault();
				$('div#addRowButton.button').click();
			}
		},

	/**
	 * Creates a function which can add one row to the table (given by id).
	 * This new row is an empty copy of last row.
	 * @name extendTableBy1row
	 * @function
	 * @param tabID {String} table id
	 */
		extendTableBy1row : function (tabID) {
			var tabId = tabID;

			return function () {
				var c, r, f, m, ch, n, nid, nr, tag, t = $('table#' + tabId),
				field, fields = ['input', 'select'],
				i = 0,
				fieldsLength = fields.length;

				if (t.find('tr').length-2 >=  t.data('UpcApp.rowLimit')) {
					alert(upcApp.messages.limitReached);
					return;
				}

				if (typeof t === 'undefined') { //tab exists?
					return;
				}

				r = t.find('tr:last-child').prev();

				nr = r.clone(true); // clone table's last row with data & handlers
				for (;i<fieldsLength;i++){
					nr.find('b').remove(); //  remove errors for new row
					nr.find(fields[i]).each(function(){  // find all form inputs
							field = $(this);
							field.removeClass('wrong');
							tag = field.attr("nodeName");
							if (typeof tag === 'string' && tag.toLowerCase() === fields[i]) {
								switch (field.attr("type")) { // clear data in newly cloned fields
								case 'text':
									field.val(''); //clear text
									break;
								case 'checkbox':
									field.attr("checked", false); //clear checkbox
									break;
								case 'select-one':
									$(field.find('option')[0]).attr('selected', true); //select first option
									break;
								}
							}
							n = field.attr('name');

							if (typeof n !== 'undefined') {
								m = n.match(/(\d+)/);
						if (m === null) {
							return;
						}
								nid = Number(m[1]) + 1;
								while (nid.toString().length < m[1].length) {
									nid = '0' + nid;
								}
								field.attr('name', n.replace(m[1], nid));
								nr.insertBefore(t.find('tr:last-child'));
							}
						});
				}

				// removing handler responsible for adding new row from the row before last one
				$($(r.find('td:last-child')[0]).find(fields.join(','))[0]).unbind("keydown");
				$(nr.find(fields.join(','))[0]).focus(); // changing focus to new row
			};
	},
	//extendTableBy1row
	/**
	 * If enter predsed it fires argument function and stops the propagation of the event.
	 * @name runOnEnterPressed
	 * @function
	 * @param f function to fire
	 */
		runOnEnterPressed : function (f) {
			return function (e) {
			if (e.keyCode === 13) {
					f();
					return false;
				} else {
					return true;
				}
			};
		},

	/**
	 * Table will extend on "add row" button click
	 * @name makeTableExtendable
	 * @function
	 * @param tabId
	 * @param row_count_limit Maximum number of rows in the table
	 */
		makeTableExtendable : function (tabId, row_count_limit) {
		var row, cols, col, tab2extend = $('table#' + tabId),
			btnCell = null,
			btn = null,
			limit = (typeof row_count_limit !== 'number') ? upcApp.defaultTableRowCountLimit : row_count_limit;
			if (tab2extend.find('tr').length-1 >= limit) { // sorry Table dude, you reached your limit
				return;
			} else {
				tab2extend.data('UpcApp.rowLimit',limit);
				row = $('<tr></tr>');
				cols = $('table#' + tabId + ' tr:last-child td').length;
				btn = $('<div class="buttons_container leftButtons"><div id="addRowButton" class="button" >' + upcApp.messages.AddRowLabel + '</div></div>');
				btnCell = $('<td></td>').append(btn);
				btn.click(upcApp.extendTableBy1row(tabId));
				
				for (col = 0; col < cols; col++) {
					if (col === 0) {
						row.append(btnCell);
					} else {
						row.append($('<td></td>'));
					}
				}
				tab2extend.append(row);
			}
	},
	//makeTableExtendable
	/**
	 * Basic security for java script string data.
	 * @name secureString
	 * @function
	 * @param str
	 * @return secured
	 */
		secureString : function (str) {
		var escaped = str.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
			return escaped;
		} // secureString
	}; // UPCApp
