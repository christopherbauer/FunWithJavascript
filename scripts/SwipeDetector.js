(function(){
	"use strict";
	
	var SwipeDetector = function(selector) {
		var start;
		
		var clear = function () {
			start = null;
			$(selector).off("mousemove", mouseMove);
		};

		var mouseMove = function (data) {
			if (!start) {
				start = { x: data.pageX, y: data.pageY};
			}
			
			var dx = data.pageX - start.x;
			if (dx > 30) {
				clear();
				$(this).trigger("swipe-right");
			} else if (dx < -30) {
				clear();
				$(this).trigger("swipe-left");
			}
		};

		$(selector).on("mousedown", function(data) {
			$(this).on("mousemove", mouseMove);
		});
		$(selector).on("mouseup", function(data) {
			clear();
		});
	};

	window.SwipeDetector = SwipeDetector;
})();