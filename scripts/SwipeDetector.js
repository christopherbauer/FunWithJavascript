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
		
		var handlers = {};
		
		var clear = function (type) {
			config.Start = null;
			$(config.Selector).off(type, handlers[type]);
		};
		var handleMove = function(x, type) {
			if (!config.Start) {
				config.Start = x;
			}
			
			var dx = x - config.Start;
			
			if (dx > config.Threshold) {
				clear(type);
				$(config.Selector).trigger("swipe-right");
			} else if (dx < -config.Threshold) {
				clear(type);
				$(config.Selector).trigger("swipe-left");
			}
		};
		
		handlers["mousemove"] = function(e) {
			handleMove(e.pageX, e.type);
		};
		handlers["touchmove"] = function (e) {
			e.preventDefault();
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			handleMove(touch.pageX, e.type);
		};

		$(config.Selector).on({
			touchstart: function(e) {
				e.preventDefault();
				$(this).on("touchmove", handlers["touchmove"]);
			}, mousedown: function() {
				$(this).on("mousemove", handlers["mousemove"]);
			}, touchend: function(e) {
				e.preventDefault();
				clear("touchmove");
			}, mouseup: function() {
				clear("mousemove");
			}
		});
	};

	window.SwipeDetector = SwipeDetector;
})();