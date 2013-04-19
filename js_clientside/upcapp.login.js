/*jslint devel: true, sloppy: true, nomen: true, maxerr: 100, indent: 4*/
/*global jQuery*/
/*global $*/
/*global setTimeout*/

/**
 * UPCWebApp - Status Section Related Functions
 * @name upcapp.login.js
 */

var upcApp = upcApp || {};

/**
 * objects and function related to page "Static->Diagnostic->Ping"
 * @name login
 */
upcApp.login = (function () {

		return {
			/**
			 * Assign style and event's actions to elements on Login page
             * @name pageBehaviour
             * @function
			 */
			pageBehaviour : function () {
				var action = function () {$('form#mainForm').submit(); };

				$('input[name=password]').keypress(
					function (event) {
						if (event.which === 13) {
							action();
							event.preventDefault();
						}
					}
				);

				$(upcApp.saveButton).click(action);

				// check if there's some default action to perform

				if (location.href.match(/#wait4restart/) !== null) {
					upcApp.Wait4restart({newUrl : 'login.cgi'});
				}

				$('input[name=username]').focus();

			} //pageBehaviour
		};

	}()); // upcApp.login

