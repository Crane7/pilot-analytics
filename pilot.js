/**!
 * Pilot.js
 * Version: 0.01
 * Super-simple analytics component for the Pilot Wordpress management platform
 */

(function() {

	init();

	function init() {

		var basic_data = {};

		// collect basic data about the client
		var basic_data = collect_basic_data();

		// calculate the page load time AND submit everything
		calculate_load_time(function(duration) {
			basic_data['load_time'] = duration;
			submit_data(basic_data);
		});

	}

	/**
	 * Figure out the load time of the page and call the callback provided
	 * with the time in milliseconds
	 */
	function calculate_load_time(callback) {

		// if the performance api isn't available, fall back to javascript date
		var use_date_timing = (typeof window.performance == 'object') ? false : true;
		var time_start = undefined;
		var time_end   = undefined;

		do_start_calc();

		if(window.attachEvent) {
			window.attachEvent('onload', do_end_calc);
		} else {
				if(window.onload) {
						var curronload = window.onload;
						var newonload = function() {
								curronload();
								do_end_calc();
						};
						window.onload = newonload;
				} else {
						window.onload = do_end_calc;
				}
		}

		function do_start_calc() {

			if(use_date_timing) {
				time_start = Date.now();
			} else {
				time_start = performance.timing.navigationStart;
			}

		}

		function do_end_calc() {

			var delay = 0;

			if(!use_date_timing) {
				delay = 500; // delay so load end even can fire
			}

			setTimeout(calculate_and_return, delay);

			function calculate_and_return() {

				if(use_date_timing) {
					time_end = Date.now();
					difference = time_end - time_start;
				} else {
					difference = performance.timing.loadEventEnd - performance.timing.navigationStart;
				}

				callback.call(this, difference);
			}
		}
	}

	/**
	 * Grab some basic information about the client and return an object
	 */
	function collect_basic_data() {
		return {
			client_w: screen.width,
			client_h: screen.height
		}
	}

	/**
	 * Submit the analytics data to the server
	 * @param Array - data to submit
	 */
	function submit_data( payload ) {

		var payload_parts = [];
		var formatted_payload;

		for(key in payload) {
			if(payload.hasOwnProperty(key)) {
				payload_parts.push(key + '=' + payload[key]);
			}
		}

		formatted_payload = '?' + payload_parts.join('&');

		var img = document.createElement('img');
		img.src = 'http://example.com/submit.php' + encodeURI(formatted_payload);
		img.setAttribute('style', 'display:none;');

		var target = document.getElementsByTagName('body')[0];
		target.appendChild(img);
	}

})();
