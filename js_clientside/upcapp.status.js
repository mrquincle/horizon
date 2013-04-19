/*jslint devel: true, sloppy: true, nomen: true, maxerr: 100, indent: 4*/
/*global jQuery*/
/*global $*/
/*global setTimeout*/

/**
 * UPCWebApp - Status Setcion Related Functions
 * @name upcapp.status.js
 */

var upcApp = upcApp || {};

upcApp.status = upcApp.status || {
	diagnostic : {},
	connection : {}
};


/**
 * objects and function related to page "Status-> System"
 * @name status.system
 * @function
 */
upcApp.status.system = (function () {


		return {
			/**
			 * Assign style and event's actions to elements on
			 * "Status->System" page
			 */
			pageBehaviour : function () {
			}
		};

	}()); // upcApp.status.system



/**
 * objects and function related to page "Static->Diagnostic->Ping"
 * @name
 * @function
 */
upcApp.status.diagnostic.ping = (function () {

		var pingID = null, // holder for pingID received by the device
		gotPingStatus = null,
		cannotGetPingId = null,
		pingProcessActive = false;

		/**
		 * Get the Ping current status
         * @name getPingStatus
         * @function
		 */
		function getPingStatus() {
			if (pingID === null) {
				return;
			}
			upcApp.talk2device(
				'sendResult.cgi?section=diagnostic&subsection=ping',
				{
					action : 'getPingStatus',
					page : 'status',
					pingID : pingID
				},
				gotPingStatus,
				null,
				null
			);
		}


		/**
		 * Got new status from ping, check if it is final, wait and ask again if not
         * @name gotPingStatus
         * @function
         * @param data
         */
		gotPingStatus = function (data) {
			$('textarea#pingStatus').val(data.PingStatus);
			if (data.finished === false) {
				setTimeout(function () {
						getPingStatus();
					}, 1000);
			} else {
				//$('img#loaderGif').hide();
				pingProcessActive = false;
			}
		};


		/**
		 * Got Ping Id from device, start to ask about Ping status
         * @name gotPingId
         * @function
         * @param data
         */
		function gotPingId(data) {
			var pingId = data.pingID;
			if (pingId > 0) {
				pingID = pingId;
				getPingStatus();
			}
		}


		/** 
		 * sends the pingRequest to the device, reads the pingID from response 
		 * @param {String} pingHost Host to ping address
		 * @param {String} packsize Ping packet size
		 * @param {String} packcount Ping packet count
		 */
		function sendPingRequest(pingHost, packsize, packcount) {
			upcApp.talk2device(
				'sendResult.cgi?section=diagnostic&subsection=ping',
				{
					action : 'startPing',
					page : 'status',
					pingHost : pingHost,
					pingPackSize : packsize,
					pingPackCount : packcount
				},
				gotPingId,
				cannotGetPingId,
				cannotGetPingId
			);
		}


		/**
		 * Start the Ping action
         * @name startPingClick
         * @function
         */
		function startPingClick() {
			if ( pingProcessActive===true ) {
				return false;
			}
			var pingHost = $('input[name=pingIP]').val(),
			packsize = $('input[name=packetSize]').val(),
			packcount = $('input[name=packetCount]').val(),
			log = $('table#ping tbody tr td textarea');

			//log.val('start ping' + '\n' + log.val());
			log.val(upcApp.messages.StartPing + '\n' + log.val());
			//$('img#loaderGif').show();
			pingProcessActive = true;
			sendPingRequest(pingHost, packsize, packcount);
		}


		/**
		 * Abort the Ping action
         * @name abortPingClick
         * @function
         */
		function abortPingClick() {
			if ( pingProcessActive===false ) {
				return false;
			}
			var log = $('textarea#pingStatus');
			pingID = null;
			setTimeout(
				function () {
					//$('img#loaderGif').hide();
					pingProcessActive = false;
					//log.val(log.val() + '\n' + 'Ping Aborted!');
					log.val(log.val() + '\n' + upcApp.messages.PingAborted);
				},
				1500
			);
		}

		/**
		 * Cannot get pingID, somethings wrong
         * @name cannotGetPingId
         * @function
         * @param data
         */
		cannotGetPingId = function (data) {
			//$('img#loaderGif').hide();
			pingProcessActive = false;
			alert(upcApp.messages.cantGetPingID + '\n' + data);
		};

		return {

			/**
			 * Assign style and event's actions to elements on
			 * "Status->Diagnostic->Ping" page 
			 */
			pageBehaviour : function () {
				var bSel = 'div.buttons_container div#';
				$(bSel + 'pingStart.button').click(startPingClick);
				$(bSel + 'pingAbort.button').click(abortPingClick);
				$('table#ping input[name=pingIP]').blur(upcApp.checkIpField("any"));
				$('input[name=packetSize]').blur(upcApp.validateNumber(1, 1500, 64));
				$('input[name=packetCount]').blur(upcApp.validateNumber(1, 10, 3));
			} //pageBehaviour
		};

	}()); // upcApp.status.diagnostic.ping



/**
 * objects and function related to page "Static->Diagnostic->Trace Route"
 * @name
 * @function
 */
upcApp.status.diagnostic.trace = (function () {
		var traceID = null, // holder for pingID received by the device
		getTraceStatus = null,
		cannotGetTraceId = null,
		traceProcessActive = false;

		/**
		 * Got trace status, check if it is final, aska again if not
         * @name gotTraceStatus
         * @function
         * @param data
         */
		function gotTraceStatus(data) {
			$('textarea#traceStatus').val(data.TraceStatus);
			if (data.finished === false) {
				setTimeout(
					function () {
						getTraceStatus();
					},
					1000
				);
			} else {
				//$('img#loaderGif').hide();
				traceProcessActive = false;
			}
		}


		/**
		 * Get the Ping current status
         * @name getTraceStatus
         * @function
		 */
		getTraceStatus = function () {
			if (traceID === null) {
				return;
			}
			upcApp.talk2device(
				'sendResult.cgi?section=diagnostic&subsection=trace',
				{
					action : 'getTraceStatus',
					page : 'status',
					traceID : traceID
				},
				gotTraceStatus,
				null,
				null
			);
		};


		/**
		 * Got Trace Id, start to ask about that
         * @name gotTraceId
         * @function
         * @param data
         */
		function gotTraceId(data) {
			var traceId = data.traceID;
			if (traceId > 0) {
				traceID = traceId;
				getTraceStatus();
			}
		}


		/** 
		 * sends the pingRequest to the device, reads the pingID from response 
		 * @param {String} pingHost Host to ping address
		 * @param {String} packsize Ping packet size
		 * @param {String} packcount Ping packet count
		 */
		function sendTraceRequest(traceIp, ttlFirst, ttlMax) {
			upcApp.talk2device(
				'sendResult.cgi?section=diagnostic&subsection=trace',
				{
					action : 'startTrace',
					page : 'status',
					traceIp : traceIp,
					ttlFirst : ttlFirst,
					ttlMax : ttlMax
				},
				gotTraceId,
				cannotGetTraceId,
				cannotGetTraceId
			);
		}

		/**
		 * Start the Trace action
         * @name startTraceClick
         * @function
         */
		function startTraceClick() {
			if ( traceProcessActive === true ) {
				return false;
			}
			var traceIp = $('input[name=traceIP]').val(),
			ttlFirst = $('input[name=ttlFirst]').val(),
			ttlMax = $('input[name=ttlMax]').val(),
			log = $('textarea#traceStatus');

			//log.val('start trace' + '\n' + log.val());
			log.val(upcApp.messages.StartTrace + '\n' + log.val());
			//$('img#loaderGif').show();
			traceProcessActive = true;
			sendTraceRequest(traceIp, ttlFirst, ttlMax);
		}


		/**
		 * Abort the Trace action
         * @name abortTraceClick
         * @function
         */
		function abortTraceClick() {
			if ( traceProcessActive === false ) {
				return false;
			}
			var log = $('textarea#traceStatus');
			traceID = null;
			setTimeout(
				function () {
					//$('img#loaderGif').hide();
					traceProcessActive = false;
					//log.val(log.val() + '\n' + 'Tracing Aborted!');
					log.val(log.val() + '\n' + upcApp.messages.TraceAborted);
				},
				1000
			);
		}


		/**
		 * Cannot get pingID, somethings wrong
         * @name cannotGetTraceId
         * @function
         * @param data
         */
		cannotGetTraceId = function (data) {
			//$('img#loaderGif').hide();
			traceProcessActive = false;
			alert(upcApp.messages.cantGetTraceID + '\n' + data);
		}; // cannotGetTraceId



		return {
			/** Assign style and event's actions to elements on 
			 * "Status->Diagnostic->Trace" page 
			 */
			pageBehaviour : function () {
				var bSel = 'div.buttons_container div#';
				$(bSel + 'traceStart.button').click(startTraceClick);
				$(bSel + 'traceAbort.button').click(abortTraceClick);
				$('table#trace input[name=traceIP]').blur(upcApp.checkIpField("any"));
				$('input[name=ttlFirst]').blur(upcApp.validateNumber(1, 5, 1));
				$('input[name=ttlMax]').blur(upcApp.validateNumber(1, 30, 5));
			} //pageBehaviour
		};

	}()); // upcApp.status.diagnostic.trace




/**
 * objects and function related to page "Static->Connection->Downstream"
 * @name status.connection.downstream
 * @function
 */
upcApp.status.connection.downstream = (function () {

        /**
         * Send to the server action: 'forcefreq' with given value
         * @name forceFreq
         * @function
         */
		function forceFreq() {
			var v = $('input[name=freq]').val(),
				minFreq = 112000,
				maxFreq = 1002000,
			f = parseInt(v, 10);

			if (isNaN(f) || (f < minFreq) || (f > maxFreq)) {
				alert(upcApp.messages.wrongFrequency + '(' + v + ')');
			} else {
				upcApp.talk2device(
					null,
					{page : 'status', action: 'forcefreq', freq : v},
					function () {upcApp.fancyMessage(upcApp.messages.connDownStreamLabel, false, upcApp.messages.forceFreqSuccess, null); },
					function () {upcApp.fancyMessage(upcApp.messages.connDownStreamLabel, false, upcApp.messages.forceFreqFailure, null); },
					null
				);
			}
		}


		return {
			/** 
			 * Assign style and event's actions to elements on 
			 * "Status->Connection->Downstrean" page 
			 */
			pageBehaviour : function () {
				//$('table').width('95%');
				$('div.buttons_container div#force').click(forceFreq);
				$('#mainForm').submit(function () {
					$('div.buttons_container div#force').click();
					return false;
				});
			}
		};

	}()); // upcApp.status.connection.downstream

