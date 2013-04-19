/*jslint devel: true, sloppy: true, nomen: true, maxerr: 100, indent: 4*/
/*global jQuery*/
/*global $*/
/*global setTimeout*/
/*global location*/

/**
 * UPCWebApp - "Parental Control" section related functions
 * @name upcapp.js
 * @version 1.0
 */

var upcApp = upcApp || {};


/** Object and functions related to section "Parental Controll" 
 * @class
 */
upcApp.parental = upcApp.parental || {};

upcApp = (function (upcApp) {

		// function used by tod and web site filters to remove old modal window
		// when presenting submit results
		function killModalAndThen(fun) {
			return (function (data) {
						upcApp.killFancyWindow(upcApp.infoWindow)();
						if (typeof fun === "function") {
							fun(data);
						}
					});
		}


upcApp.parental.tod = (function () { // Objects and functions related to page "Parental Control->ToD"

		var onClearButtonClick = null;

		/** Render a Rectangle symbol 
		 * @return {Object} jQuery object containing DOM element
		 */
		function Rectangle() {
			var obj = $('<div></div>').attr('class', 'rect').data('state', false);

			function toggleRectState() {
				// toggle the class responsible for color/state
				$(this).toggleClass('selected');
				$(this).data('state', $(this).data('state') === true ? false : true);
			}

			obj.click(toggleRectState);
			obj.mouseenter(
				function () {
					if (upcApp.mouseHold) {
						toggleRectState.apply($(this));
					}
				}
			);
			return obj;
		} // Rectangle


		/** 
		 * Render a label for recangles column 
		 * @return {Object} jQuery object (div) of Rectangle
		 */
		function RectLabel() {
			return $('<div></div>').attr('class', 'rectLabel');
		} // RectLabel


		/** 
		 * Render a row of rectangles for given day 
		 * @param {Number} day	Number of the day in week (0:Monday, 
		 * 1:Tuesday, ...)
		 * @return {Object} jQuery object containing hour-divs
		 */
		function DayRow(day) {
			var i,
				o,
				obj = $('<div></div>').attr('class', 'row'),
				title = $('<div></div>').css('width', '100px');

			title.append(upcApp.messages.WeekDays[day]);
			obj.append(title);
			for (i = 0; i < 24; i += 1) {
				o = new Rectangle();
				o.data('hour', i).data('day', day);
				obj.append(o);
			}
			return obj;
		} // DayRow


		/**
		 * Render label for DayRow
		 * @return {Object} jQuery object of DayRow label
		 */
		function LabelRow() {
			var i,
				o,
				obj = $('<div><div>Hour<div></div>').attr('class', 'row label');

			for (i = 0; i < 24; i += 1) {
				o = new RectLabel();
				o.html(i);
				obj.append(o);
			}
			return obj;
		} // LabelRow



		/**
		 * Get Policy definition. Get list of policies if there's no policy ID specified
		 * @param {Number} policyId ID of policy
		 */
		function getToDPolicy(polId, onGot, onGotNone) {
			var payload = {'page' : 'parental'};

			if (typeof polId !== 'undefined' && polId === null) { //get list
				payload.action = 'getToDPolicyList';
			} else {
				payload.action = 'getToDPolicy';
				payload.TODpolId = polId;
			}
			upcApp.talk2device('sendResult.cgi?section=tod', payload, onGot, onGotNone, null);
		} // getPolicy



		/**
		 * Get list of policies and update the content of the list
		 */
		function updatePolicyList(data) {
			var i = 0,
				m = 0,
				pol = null,
				that = $('select[name=todPolicy]'),
				newPolicies = data.data;

			that.find('option').remove(); // clean the list
			for (m = newPolicies.length; i < m; i += 1) {
				pol = newPolicies[i];
				that.append($('<option>').val(pol.id).attr('selected', pol['default']).html(pol.name));
			}
		}// updatePolicyList

		/**
		 * Forms and sends commands to the device via AJAX
		 */
		function doRemoteStuff(what) {
			var action = '',
			ifsuccess,
			iffail,
			payload =  {'page' : 'parental'},
			currentPolId = $('select[name=todPolicy]').find(':selected').val();

			if (what === 'remove') {
				payload.TODpolId = currentPolId;
				payload.action = 'removeToDPolicy';
			} else if (what === 'add') {
				payload.newTODpolName = arguments.length > 1 ? arguments[1] : null;
				payload.action = 'addToDPolicy';
				ifsuccess = arguments.length > 2 ? arguments[2] : null;
				iffail = arguments.length > 3 ? arguments[3] : null;
			} else if (what === 'storeToD') {
				payload.TODpolId = arguments.length > 1 ? arguments[1] : null;
				payload.states = arguments.length > 1 ? arguments[2] : null;
				ifsuccess = arguments.length > 2 ? killModalAndThen(arguments[3]) : null;
				iffail = arguments.length > 3 ? killModalAndThen(arguments[4]) : null; 
				payload.action = 'storeToDPolicy';
			}
			
			upcApp.fancyMessage(upcApp.messages.waitForSave, true);
			upcApp.talk2device(
				'sendResult.cgi?section=tod',
				payload,
				function (data) {
					//upcApp.fancyMessage(upcApp.messages.ToDLabel, false, data.status, null);
					upcApp.killFancyWindow()();
					if (typeof ifsuccess === 'function') {
						ifsuccess(data);
					}
					location.reload();
				},
				function (data) {
					upcApp.fancyMessage(upcApp.messages.ToDLabel, false, data.status, null);
					if (typeof iffail === 'function') {
						iffail(data);
					}
				},
				null
			);

		} // doRemoteStuff


		function removeCurrentToDPolicy() {
			doRemoteStuff('remove');
			// update list
			getToDPolicy(null, updatePolicyList, function () {alert('Cannot get list of policies'); });
		} // removeCurrentToDPolicy


		function addNewToDpolicy() {
			var numberOfPolicies = $('select[name=todPolicy] option').length;
			if (numberOfPolicies >= upcApp.parentalControlToDFiltersPoliciesLimit) {
				alert(upcApp.messages.limitReached);
				return;
			}
			var newname = upcApp.secureString(prompt(upcApp.messages.newToDPolicyPrompt)) || null;
			if (newname !== null) {
				doRemoteStuff( 'add', newname);
			}
		} // addNewToDpolicy


		/** Clear or select the chart */
		onClearButtonClick = function () {
			$('div.rect').removeClass('selected').data('state', false);
		}; // onClearButtonClick


		function onInverseButtonClick() {
			var i,
			m,
			r,
			rects = $('div.rect');

			for (i = 0, m = rects.length; i < m; i += 1) {
				r = $(rects[i]);
				r.toggleClass('selected');
				r.data('state', r.data('state') === true ? false : true);
			}
		}


		/** 
		 * Sets the state of chart elements depending on given string
		 */
		function setChart(data) {
			var re = /(.*)_(.*)_(.*)_(.*)_(.*)_(.*)_(.*)/,
			state_string = data.data,
			m = state_string.match(re) || [],
			i,
			j,
			y,
			rects,
			fill,
			day,
			rows = $('#todContainer').find('div.row:not(.label)');

			onClearButtonClick();

			if (m.length === 8) {
				for (i = 0; i < rows.length; i += 1) {
					day = parseInt(m[i + 1], 16).toString(2);
					fill = 24 - day.length;
					for (y = 0; y < fill; y += 1) { day = '0' + day; } // fill preceding zeros up to 24 digits
					rects = $(rows[i]).find('div.rect');
					for (j = 0; j < rects.length; j += 1) {
						if (day.charAt(j) === '1') {
							$(rects[j]).click();
						}
					}
				}
			}
		} // setChart




		function loadPolicy() {
			var polId = $(this).find(':selected').val();
			getToDPolicy(
				polId,
				function (data) { // there's something
					setChart(data);
				},
				function (data) { // there's nothing
					alert(upcApp.messages.cantGetPolicy + $(this).find(':selected').html() + '\n' + data);
				}
			);
		} // loadPolicy


		function storePolicy() {
			var polId = $('select[name=todPolicy]').find(':selected').val(),
			i,
			j,
			rows = $('#todContainer').find('div.row:not(.label)'),
			rects,
			week = [],
			day;

			for (i = 0; i < rows.length; i += 1) {
				rects = $($(rows[i]).find('div.rect'));
				day = '';
				for (j = 0; j < rects.length; j += 1) {
					day += $(rects[j]).data('state') ? 1 : 0;
				}
				week.push(parseInt(day, 2).toString(16));
			}

			upcApp.infoWindow = upcApp.fancyModalWindow().Open(upcApp.messages.waitForSave).indicator(1);
			success = upcApp.defaultOnSuccessfulSave;
			fail = upcApp.defaultOnSaveIsNotPossible;
			doRemoteStuff('storeToD', polId, week.join('_'), success, fail);
		} // storePolicy


		/**
		 * Render chart inside of given jQuery/DOM object
		 * @param {Object} jObj jQuery object
		 */
			function putChart(jObj) {
				var i, o;

				jObj.append(new LabelRow());

				for (i = 0; i < upcApp.messages.WeekDays.length; i += 1) {
					jObj.append(new DayRow(i));
				}
			} // putChart




			return {
				/** Assign style and event's actions to elements on "Parental Control->ToD" page */
			pageBehaviour : function () {
				var updateAfterLoad = function (data) {
					updatePolicyList(data);
					$('select[name=todPolicy] option:last-child').attr('selected','selected');
					loadPolicy.call($('select[name=todPolicy]'));
				};

				putChart($('#todContainer'));
				$('div.buttons_container div#clear').click(onClearButtonClick);
				$('div.buttons_container div#inverse').click(onInverseButtonClick);
				$('div.buttons_container div#remPolicy').click(removeCurrentToDPolicy); // Remove button
				$('div.buttons_container div#addPolicy').click(addNewToDpolicy); // Add button
				$('select[name=todPolicy]').change(loadPolicy);
				$('div.buttons_container div#submit').click(storePolicy); // submit button

				getToDPolicy(null, updateAfterLoad, function () {alert('Cannot get list of policies'); });

				// maybe something sent us here to perform particular action?
				if (location.href.match(/#addNewPolicy$/)) { // yep, we should start the process of adding new policy
					$(document).ready(function() {
						window.location.hash = '';
						$('div#addPolicy.button').click(); // just click the right button
					});
				}

				$('#todContainer').mousedown(function () {upcApp.mouseHold = true; });
				$('#todContainer').mouseup(function () {upcApp.mouseHold = false; });

			} //pageBehaviour
		};
	}()); // upcApp.parental.tod




upcApp.parental.webFilters = (function () { // Objects and functions related to page "Parental Controll->Web Site Filters"

		var clearAllLists = null;

		/** Remove item along with parent */
			function removeListItem() {
				$(this).parent().remove();
			} // removeListItem


			/** Add "remove" button to items of list */
			function addRemoveButtons() {
				var dl = $(this),
				guzik = $('<div class="miniButton">remove</div>');
				// remove old buttons
				dl.remove('div.miniButton');
				guzik.css('float', 'right');
				guzik.click(removeListItem);
				dl.append(guzik);
			} // addRemoveButtons


			/** 
			 * Add items to the list
			 * @param {String} item content
			 * @param {Object} jQuery object to wich the item will be added
			 */
			function addItemToList(message, list) {
				return function () {
					//check how many items we have already. If we have more than 12(upcApp.maxItemsPerList), refuse to add new one
					if (list.find('dt').length >= upcApp.maxItemsPerList) {
						alert(upcApp.messages.toMuchMan + upcApp.maxItemsPerList);
						return;
					}
					var dt,
					res = upcApp.secureString(prompt(message, ''));
					if (res !== null && res.length > 0) {
						dt = $('<dt>' + res + '</dt>');
						list.append(dt);
						addRemoveButtons.call(dt);
					}
				};
			} // addItemToList



			function getPolicy(polId, onGot, onGotNone) {
				var payload = {'page' : 'parental'};
				if (typeof polId !== 'undefined' && polId === null) {
					payload.action = 'getWebPolicyList';
				} else {
					payload.action = 'getWebPolicyKeys';
					payload.WebPolId = polId;
				}
				upcApp.talk2device('sendResult.cgi?section=websitefilters', payload, onGot, onGotNone, null);
			} // getPolicyList


			function clearSubLists() {
				$('dl#keywordList dt').remove();
				$('dl#blockedDomainList dt').remove();
				$('dl#allowedDomainList dt').remove();
			} // clearSubLists


			function updatePolicyList(data) {
				var i = 0,
				m = 0,
				pol = null,
				that = $('select[name=policy]'),
				newPolicies = data.data;
				that.find('option').remove(); // clean the list
				clearSubLists(); // clean the sub-lists

				for (m = newPolicies.length; i < m; i += 1) {
					pol = newPolicies[i];
					that.append($('<option>').val(pol.id).attr('selected', pol['default']).html(pol.name));
				}
			} // updatePolicyList



			function doRemoteStuff(what) {
				var action = '',
				payload =  {'page' : 'parental'},
				ifsuccess,
				iffail,
				currentPolId = $('select[name=policy]').find(':selected').val();

				if (what === 'remove') {
					payload.WebPolId = currentPolId;
					payload.action = 'removeWebPolicy';
				} else if (what === 'add') {
					payload.newWebPolName = arguments.length > 1 ? arguments[1] : null;
					payload.action = 'addWebPolicy';
					ifsuccess = arguments.length > 2 ? arguments[2] : null;
					iffail = arguments.length > 3 ? arguments[3] : null;
				} else if (what === 'store') {
					payload.WebPolId = arguments.length > 1 ? arguments[1] : null;
					payload.lists = arguments.length > 1 ? arguments[2] : null;
					ifsuccess = arguments.length > 2 ? killModalAndThen(arguments[3]) : null;
					iffail = arguments.length > 3 ? killModalAndThen(arguments[4]) : null; 
					payload.action = 'storeWebPolicy';
				}

				upcApp.fancyMessage(upcApp.messages.waitForSave, true);
				upcApp.talk2device(
					'sendResult.cgi?section=websitefilters',
					payload,
					function (data) {
						//upcApp.fancyMessage(upcApp.messages.webFiltersLabel, false, data.status, null);
						if (typeof ifsuccess === 'function') {
							ifsuccess(data);
						}
						location.reload();
					},
					function (data) {
						upcApp.fancyMessage(upcApp.messages.webFiltersLabel, false, data.status, null);
						if (typeof iffail === 'function') {
							iffail(data);
						}
					},
					null
				);

			} // doRemoteStuff




			function addNewWebPolicy() {
				var numberOfPolicies = $('select[name=policy] option').length;
				if (numberOfPolicies >= upcApp.parentalControlWebSiteFiltersPoliciesLimit) {
					alert(upcApp.messages.limitReached);
					return;
				}
				var newname = upcApp.secureString(prompt(upcApp.messages.newWebPolicyPrompt)) || null;
				if (newname !== null) {
					doRemoteStuff('add', newname);
				}
			} // addNewToDpolicy



			function loadPolicy() {
				var polId = $(this).find(':selected').val();

				function addItem2Sublist(list, items) {
					var index,
					dt = null;

					for (index in items) {
						if (items.hasOwnProperty(index)) {
							dt = $('<dt>' + items[index] + '</dt>');
							list.append(dt);
							addRemoveButtons.call(dt);
						}
					}
				} // addItem2Sublist

				getPolicy(
					polId,
					function (data) { // there's something
						clearSubLists(); // clean the sub-lists

						if (typeof data.keywords !== 'undefined') {
							addItem2Sublist($('dl#keywordList'), data.keywords);
						}

						if (typeof data.blocked !== 'undefined') {
							addItem2Sublist($('dl#blockedDomainList'), data.blocked);
						}

						if (typeof data.allowed !== 'undefined') {
							addItem2Sublist($('dl#allowedDomainList'), data.allowed);
						}
					},
					function (data) { // there's nothing
						alert(upcApp.messages.cantGetPolicy + $(this).find(':selected').html() + '\n' + data);
					}
				);
			}



			/**
			 * Commands the device to remove current Web policy.
			 */
			function removeCurrentWebPolicy() {
				doRemoteStuff('remove');
				// update list
				setTimeout(
					function () {
						getPolicy( // get new list
							null,
							updatePolicyList,
							function () {
								alert('Cannot get list of policies');
							}
						);
						loadPolicy.call($('select[name=policy]')); // load the selected (first on list)
					},
					500
				);
			} // removeCurrentWebPolicy



			function storePolicy() {
				var polId = $('select[name=policy]').find(':selected').val(),
				i,
				j,
				lists = {};
				lists.keywords = [];
				lists.blocked = [];
				lists.allowed = [];
				$('dl#keywordList dt').each(function () {lists.keywords.push($($(this).contents()[0]).text()); });
				$('dl#blockedDomainList dt').each(function () {lists.blocked.push($($(this).contents()[0]).text()); });
				$('dl#allowedDomainList dt').each(function () {lists.allowed.push($($(this).contents()[0]).text()); });

				// show modal window and send request
				upcApp.infoWindow = upcApp.fancyModalWindow().Open(upcApp.messages.waitForSave).indicator(1);
				success = upcApp.defaultOnSuccessfulSave;
				fail = upcApp.defaultOnSaveIsNotPossible;
				doRemoteStuff('store', polId, JSON.stringify(lists), success, fail);
			} // storePolicy


			clearAllLists = function () {
				$('#keywordList dt').remove();
				$('#blockedDomainList dt').remove();
				$('#allowedDomainList dt').remove();
			}; // clearAllLists


			return {

				/** Assign style and event's actions to elements on 
				 * "Parental Control->Web Site Filters" page 
				 */
			pageBehaviour : function () {
				var addBtns = 'div#add';
				var policyDownloaded = function (data) {
					updatePolicyList(data);
					$('select[name=policy] option:last-child').attr('selected','selected');
					loadPolicy.call($('select[name=policy]'));
				}

				$('table#webfilters tr td dl dt').each(addRemoveButtons);
				// add actions for Add buttons
				$(addBtns + 'KeywordButton').click(addItemToList(upcApp.messages.addNewKword, $('dl#keywordList')));
				$(addBtns + 'BlockedDomainButton').click(addItemToList(upcApp.messages.addNewBlckDomain, $('dl#blockedDomainList')));
				$(addBtns + 'AllowedDomainButton').click(addItemToList(upcApp.messages.addNewAlwdDomain, $('dl#allowedDomainList')));
				$('div#remPolicyButton').click(removeCurrentWebPolicy);
				$('div#addPolicyURLButton').click(addNewWebPolicy);
				$('select[name=policy]').change(loadPolicy);
				$('div.buttons_container div#submit').click(storePolicy); // submit button
				$('div#clear.button').click(clearAllLists); // clear button
				$('select[name=policy] option:last-child').attr('selected','selected');

				getPolicy(
					null,
					policyDownloaded,
					function () {
						alert('Cannot get list of policies');
					}
				);

				// maybe something sent us here to perform particular action?
				if (location.href.match(/#addNewPolicy$/)) { // yep, we should start the process of adding new policy
					$(document).ready(function() {
						window.location.hash = '';
						$('div#addPolicyURLButton.button').click(); // just click the right button
					});
				}

			} //pageBehaviuor
		};
	}()); // upcApp.parental.webFilters





upcApp.parental.basicsetup = (function () { // Objects and functions related to page "Parental Controll->Basic Setup"
		return {
			/** Assign style and event's actions to elements on "Parental Controll->Basic Setup page */
			pageBehaviour : function () {
				// noop
				$(upcApp.saveButton).click(
					function () {
						upcApp.defaultSaveConfiguration(undefined, true);
					}
				);
			} //pageBehaviour
		};

	}()); // upcApp.parental.basicsetup


upcApp.parental.deviceRules = (function () { // Objects and functions related to page "Parental Controll->Device Rules"

		return {
			/** Assign style and event's actions to elements on "Parental Controll->Basic Setup page */
			pageBehaviour : function () {
				$('input[name^="mac"]').blur(upcApp.checkMACfield);
				upcApp.makeTableExtendable('deviceRulesTab', upcApp.parentalControlDeviceRulesRowCountLimit);
				
				$('#addNewWebPolicyButtonContainer').prependTo($('#deviceRulesTab tr:last td')[2]);
				$('#addNewToDPolicyButtonContainer').prependTo($('#deviceRulesTab tr:last td')[3]);

				$('div.buttons_container div#addNewWebPolicyButton.button').click(function () {
					location.href = 'parental.cgi?section=websitefilters#addNewPolicy'; 
				});
				$('div.buttons_container div#addNewToDPolicyButton.button').click(function () {
					location.href = 'parental.cgi?section=tod#addNewPolicy'; 
				});
				$(upcApp.saveButton).click(
					function () {
						upcApp.defaultSaveConfiguration(undefined, true);
					}
				);
			} //pageBehaviour

		};

	}()); // upcApp.parental.deviceRules

return upcApp;

}(upcApp));

// vim: set ts=4 sw=4 tw=79 :
