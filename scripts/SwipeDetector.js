(function(){
	"use strict";
	
	var defaults = {
		Selector : null,
		Threshold: 30
	}
	
	var SwipeDetector = function(options) {
		if (typeof options !== "object") {
			options = {
				Selector: options
			};
		}
		
		var config = $.extend(defaults,options, { Start: null });
		
		var clear = function () {
			config.Start = null;
			$(config.Selector).off("mousemove", mouseMove);
		};

		var mouseMove = function (data) {
			if (!config.Start) {
				config.Start = data.pageX;
			}
			
			var dx = data.pageX - config.Start;
			if (dx > config.Threshold) {
				clear();
				$(this).trigger("swipe-right");
			} else if (dx < -config.Threshold) {
				clear();
				$(this).trigger("swipe-left");
			}
		};

		$(config.Selector).on("mousedown", function(data) {
			$(this).on("mousemove", mouseMove);
		});
		$(config.Selector).on("mouseup", function(data) {
			clear();
		});
	};

	window.SwipeDetector = SwipeDetector;
})();