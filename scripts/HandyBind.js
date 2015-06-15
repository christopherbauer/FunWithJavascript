(function () {
	"use strict";
	
	var HandyBind = function (selector) {
		$(selector).on("input", function () {
			$(selector).not(this).val($(this).val());
		});
	};
	
	window.HandyBind = window.HandyBind || HandyBind;
})();