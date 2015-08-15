var sound = 0;
var userRegex = /^[a-zA-Z-_0-9]{1,16}$/;

document.addEventListener("DOMContentLoaded", function () {
	mute();
	if (typeof InstallTrigger !== 'undefined') {
		console.warn(getDebugMessage("Ops, there's no scrollbar for firefox"));
	}
});


function mute() {
	if (sound < 3) {
		sound ++;
	} else {
		sound = 0
	}
	var btn = document.getElementById("muteBtn");
	switch (sound) {
		case 0:
			btn.className = 'icon-volume-off';
			break;
		case 1:
			btn.className = 'icon-volume-1';
			break;
		case 2:
			btn.className = 'icon-volume-2';
			break;
		case 3:
			btn.className = 'icon-volume-3';
			break;
	}
}

function checkAndPlay(element) {
	if (!element.readyState) {
		element.load();
	}
	if (element.readyState && sound) {
		element.pause();
		element.currentTime = 0;
		if (element.currentTime === element.duration ){
			// TODO currentType is not set sometimes
			var params = {
				browser : getBrowserVersion(),
				issue : "html5 audio currentTime",
				ajax: true
			};
			doPost('/report_issue', params, null);
			console.warn(getDebugMessage("Can't set current time for audio on browser {}. Reloading it"), getBrowserVersion());
		}
		switch (sound) {
			case 1:
				element.volume = 0.15;
				break;
			case 2:
				element.volume = 0.4;
				break;
			case 3:
				element.volume = 1;
		}
		element.play();
	}
}


function getBrowserVersion() {
	var ua = navigator.userAgent, tem,
		M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return 'IE ' + (tem[1] || '');
	}
	if (M[1] === 'Chrome') {
		tem = ua.match(/\bOPR\/(\d+)/);
		if (tem != null) return 'Opera ' + tem[1];
	}
	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
	return M.join(' ');
}


function readCookie(name, c, C, i) {
	c = document.cookie.split('; ');
	var cookies = {};
	for (i = c.length - 1; i >= 0; i--) {
		C = c[i].split('=');
		cookies[C[0]] = C[1];
	}
	var cookie = cookies[name];
	if (cookie != null) {
		var length = cookie.length - 1;
		// if cookie is wrapped with quotes (for ex api)
		if (cookie[0] == '"' && cookie[length] == '"') {
			cookie = cookie.substring(1, length);
		}
	}
	return cookie;
}

/**
 * @param params : map dict of params or DOM form
 * @param callback : function calls on response
 * @param url : string url to post
 * @param image : string base64 text image
 * */
function doPost(url, params, callback, image) {
	var r = new XMLHttpRequest();
	r.onreadystatechange = function () {
		if (r.readyState == 4) {
			if (r.status == 200) {
				console.log(getDebugMessage("POST {} in: {};", url, r.response));
				if (typeof(callback) == "function") {
					callback(r.response);
				} else {
					console.warn(getDebugMessage("Skipping {} callback for POST {}", callback, url));
				}
			} else {
				console.error(getDebugMessage("POST {} in: {}, status:", url, r.response, r.status));
			}
		}
	};
	var data;
	var debugOutData;
	if ((params || {}).tagName == 'FORM') {
		data =  new FormData(params);
		debugOutData = 'FormData';
	} else {
		data = new FormData();
		for (var key in params) {
			if (params.hasOwnProperty(key)) {
				data.append(key, params[key]);
			}
		}
		debugOutData = JSON.stringify(params);
	}
	if (image) {
		data.append('base64_image', image);
	}
	r.open("POST", url, true);
	r.setRequestHeader("X-CSRFToken", readCookie("csrftoken"));
	console.log(getDebugMessage("POST {} out: {}", url, debugOutData));
	r.send(data);
}


/**
 *
 * Formats message for debug,
 * Usage getDebugMessage("{} is {}", 'war', 'bad');
 * out: war is bad
 *  */
function getDebugMessage() {
	var now = new Date();
	// first argument is format, others are params
	for (var i = 1; i < arguments.length; i++) {
		arguments[0] = arguments[0].replace('{}', arguments[i]);
	}
	var time = [now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()].join(':');
	return time + ': ' + arguments[0];
}