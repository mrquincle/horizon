/*jslint devel: true, sloppy: true, nomen: true, maxerr: 100, indent: 4*/
/*global jQuery*/
/*global $*/

/**
 * UPCWebApp - System Section related functions
 * @name upcapp.system.js
 */

var upcApp = upcApp || {};
upcApp.system = upcApp.system || {
	password : {},
	backup : {
		factory : {},
		bkpRestore : {}
	},
	log : {
		config : {},
		display : {}
	}
};



upcApp.system.password = (function () {

    /**
     * Checks that password length is correct
     * @name validatePass
     * @function
     * @param {String} pass
     * @return {Boolean} is valid?
     */
    function validatePass(pass) {
        return (pass.length <= 64 && pass.length > 0);
    }

    return {
        /**
         * Assign style and event's actions to elements on "Basic->Home Network" page
         */
        pageBehaviour : function () {
            var saveButton = $(upcApp.saveButton);

            //upcApp.makePassBoxFancy($('input#oldpassword'));
            //upcApp.makePassBoxFancy($('input#newpassword'));
            $('input#newpassword2').keypress(
                function (event) {
                    if (event.which === 13) {
                        saveButton.click();
                        event.preventDefault();
                    }
                });

            saveButton.click(

                function () {
                    var passOld  = $('input#oldpassword').val(),
                        passNew1 = $('input#newpassword1').val(),
                        passNew2 = $('input#newpassword2').val(),
                        sendData = true,
                        showInfoMsg = function (selector, show, msg) {
                            if (show) {
                                $(selector).after('<p class="error_info">' + msg + '</p>');
                                sendData = false;
                            }
                        };

                    $('.error_info').remove();
                    showInfoMsg('input#newpassword2', (passNew1 !== passNew2), upcApp.messages.PasswordConfirmError);
                    showInfoMsg('input#newpassword1', (!validatePass(passNew1)), upcApp.messages.newPassNotValid);
                    showInfoMsg('input#oldpassword', (!validatePass(passOld)), upcApp.messages.newPassNotValid);

                    if (sendData) {
                        var payload = '',
                            addPayload = {
                                oldpassword: passOld,
                                newpassword: passNew1
                            },
                            onSaveIsNotPossible = function (data) {
                                showInfoMsg('input#oldpassword', (data.result === "fail"), data.status);
                            };

                        payload = '&' + $.param(addPayload);
                        upcApp.killFancyWindow(upcApp.infoWindow)();

                        upcApp.talk2device(
                            null, $("form#mainForm").serialize() + payload, upcApp.defaultOnSuccessfulSave, onSaveIsNotPossible, null);
                    }

                });
        } //pageBehaviour
    };
}());



/**
 * Object and functions related to section "System"
 * @name system.backup.factory
 * @function
 */
upcApp.system.backup.factory = (function () {

	/**
	 * Display warning and send restart command to the device if user
		 * clicked "OK", then wait 
	 * @name askAndRestart
	 * @function
		 */
		function askAndRestart() {
			upcApp.fancyMessage(
		upcApp.messages.sysRestart, false, null, function () {
			upcApp.talk2device('sendResult.cgi?section=backup&subsection=defaults', {
				page: 'system',
				action: 'restart'
			}, // the message
						function (data) {
							var status = data.status;
							upcApp.killFancyWindow()();
				upcApp.Wait4restart({
									newUrl: (typeof data.newUrl === 'string' && data.newUrl) || 'http://gwlogin',
									status: status
				});
			}, function (data) {
				upcApp.fancyMessage(upcApp.messages.cannotRestart, false, data.status, null);
			}, null);
		}, null);
								}


		return {
			/** Assign style and event's actions to elements on "Basic->Home Network" page */
			pageBehaviour : function () {
				$('div.buttons_container div#restore').click(askAndRestart);
			} //pageBehaviour
		}; // upcApp.system.backup.factory 
	}()); // system

/**
 * Checks if the given password has correct length
 * @name validatePass
 * @function
 * @return {Boolean} is valid?
 */
upcApp.system.backup.validatePass = function () {
	var pass = $('#passBox input').val(),
	result = true;

	if (typeof pass !== 'undefined') {
		result = (pass.length === 0) || (pass.length >= 6 && pass.length <= 12);
	}
	$('form#mainFormRestore input[name=bkpPass1]').val(pass); // by the way, rewrite the password to the second form
	return result;
};

/**
 * Checks if the given password has correct length
 * @name validatePass
 * @function
 * @return {Boolean} is valid?
 */
upcApp.system.backup.validateRestorePass = function () {
	var pass = $('form#mainFormRestore input[name=bkpPass1]').val(),
		result = true;

	if (typeof pass !== 'undefined') {
		result = (pass.length === 0) || (pass.length >= 6 && pass.length <= 12);
	}
	return result;
};


upcApp.system.backup.bkp = (function () {
		/**
		 * Submits the Backup Form
	 * @name getBackup
	 * @function
		 */
		function getBackup() {
			var pass1 = $('form#mainFormBackup input[name=bkpPass1]').val(),
				pass2 = $('form#mainFormBackup input[name=bkpPass2]').val(),
				sendData = true,
				showInfoMsg = function (selector, show, msg) {
					if (show) {
						$(selector).after('<p class="error_info">' + msg + '</p>');
						sendData = false;
			}
				};

			$('.error_info').remove();
			showInfoMsg('input[name=bkpPass2]', (pass1 !== pass2), upcApp.messages.PasswordConfirmError);
			showInfoMsg('input[name=bkpPass1]', (!upcApp.system.backup.validatePass()), upcApp.messages.wrongPassLength);

			if (sendData) {
				$('form#mainFormBackup').submit();
			}
	}

		return {
			/** Assign style and event's actions to elements on "Basic->Home Network" page */
			pageBehaviour : function () {
				var errorBox = $('div#errorBox span#errorMessage');

				if (errorBox.text().length > 5) { // for whitespaces
					errorBox.parent().show();
				} else {
					errorBox.parent().hide();
				}
				$('div#backupButton.button').unbind('click').click(getBackup);
			} //pageBehaviour
		};
	}());


upcApp.system.backup.restore = (function () {


		/**
		 * Submits the FormRestore form
	 * @name setBackupedConf
	 * @function
		 */
		function setBackupedConf() {
			if ($('#fileInputBar').val() === '') {
				upcApp.fancyMessage(upcApp.messages.restoreLabel, false, upcApp.messages.noFileSelected, undefined, null);
			} else {
			if (upcApp.system.backup.validateRestorePass()) {
				upcApp.fancyMessage(upcApp.messages.restartNeeded, false, null, function () {
					$("#hiddenSubmit").click();
				}, null);
				} else {
					alert(upcApp.messages.wrongPassLength);
				}
			}
	}


		return {
			/** Assign style and event's actions to elements on "Basic->Home Network" page */
			pageBehaviour : function () {
				var errorBox = $('div#errorBox span#errorMessage');
				if (errorBox.text().length > 5) { // for whitespaces
					errorBox.parent().show();
				} else {
					errorBox.parent().hide();
				}
            $("#fileInputBar").customFileInput();
            $("#selectFileButton").click(function () {
                $("#fileInputBar").click();
			});
            $('#restoreButton').click(setBackupedConf);
			} //pageBehaviour
		};
	}());



/**
 * Object and functions related to section "System"
 * @name
 * @function
 */
upcApp.system.log.config = (function () {
		return {
		/**
		 * Assign style and event's actions to elements on "Basic->Home Network" page
		 */
			pageBehaviour : function () {
				$('input.ipInput').blur(upcApp.checkIpField("any"));
				$(upcApp.saveButton).unbind('click').click(

					function () {
						$('form#mainForm').find('textarea').val('');
						$('form#mainForm').submit();
			});
			} //pageBehaviour
		};
	}());
