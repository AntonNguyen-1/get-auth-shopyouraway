(function () {
	window.SYW = window.SYW || {};
	window.SYWINTERNAL = window.SYWINTERNAL || {};
	var globalCallback;
	var host;
	var globalAppId;
	var script;
	var returnUrl;

	function isMobile() {
		return navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
	}

	SYW.signIn = function (callback, appId, website, urlToRedirectTo) {
		globalCallback = callback;
		globalAppId = appId;
		host = getWebsite(website);
		if (isMobile()) {
			returnUrl = getReturnUrl(urlToRedirectTo);
			openSignInForMobile(returnUrl);
		} else {
			openSignInForWeb();
		}
	};

	function openSignInForMobile() {
		var signInPageUrl = "https://" + host + "/secured/m/sign-in-or-register";
		var autorizationPageUrl = encodeURIComponent("/secured/m/external/signin/app/" + globalAppId + "/install");

		var signInWindow = window.open(signInPageUrl + "?returnUrl=" + autorizationPageUrl + "&appId=" + globalAppId);
		var timer = setInterval(checkWindowIfClosed, 500);

		function checkWindowIfClosed() {
			if (signInWindow.closed) {
				clearInterval(timer);
				getResponse("https://" + host + "/secured/m/platform/connect/" + globalAppId);
			}
		};
	};

	function openSignInForWeb() {
		var left = screen.width / 2 - 300;
		var top = screen.height / 2 - 313.5;
		var signInWindow = window.open("https://" + host + "/secured/authentication/external/signIn?appId=" + globalAppId, '', 'status=0,width=600px,height=627px,top=' + top + ', left=' + left);
		var timer = setInterval(checkWindowIfClosed, 500);

		function checkWindowIfClosed() {
			if (signInWindow.closed) {
				clearInterval(timer);
				getResponse("https://" + host + "/secured/platform/connect/" + globalAppId);
			}
		};
	}

	function getWebsite(website) {
		return typeof website == 'string' && website.length > 0 ? website : "www.shopyourway.com";
	};

	function getReturnUrl(urlToRedirectTo) {
		return typeof urlToRedirectTo == 'string' && urlToRedirectTo.length > 0 ? urlToRedirectTo : window.location.href;
	};

	function getResponse(url) {
		var head = document.head;
		script = document.createElement("script");
		script.setAttribute("src", url);
		head.appendChild(script);
	}

	SYWINTERNAL.GetToken = function (data) {
		document.head.removeChild(script);
		globalCallback(data.token);
	};

	SYWINTERNAL.RedirectFromMobile = function () {
		document.head.removeChild(script);
		window.location.href = returnUrl;
	};
})();