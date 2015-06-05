(function() {
	"use strict";
	console.log("Loaded TapGallery");
	
	var TapGallery = function(options) {
	var defaults = { 
			PageSize: 3, 
			Page: 0, 
			Selectors : { 
				Gallery: null, 
				Next :  null, 
				Previous: null
			} 
		};
		
		options = $.extend(defaults, options);
		
		var itemCount;
		
		function rankElements() {
			var $elements = $(options.Selectors.Gallery).find("*");
			$elements.each(function (i, element) {
				$(element).attr("data-rank",i);
				
			});
		}
		
		rankElements();
		
		function refreshItemCount() {
			itemCount = $(options.Selectors.Gallery).find("[data-rank]").length;
		}
		
		refreshItemCount();	
		
		$(options.Selectors.Next).on("click",function() {
			if((options.Page+1)*options.PageSize < itemCount){
				options.Page++;
			}
			
			scrollTo();
		});
		
		$(options.Selectors.Previous).on("click",function() {
			if(options.Page > 0) {
				options.Page--;
			}
			
			scrollTo();
		});
		function scrollTo() {
			var $scrollElement = $(options.Selectors.Gallery).find("[data-rank='"+[options.Page * options.PageSize]+"']");
			console.log($scrollElement);
			var layout = ($scrollElement.outerWidth(true)-$scrollElement.innerWidth()) / 2;
				
			var pageAdjustment = options.Page > 0 ? layout : 0;
			
			var $parent = $scrollElement.parent();
			
			var elementScrollLeft = ($scrollElement.position().left - layout) + $parent.scrollLeft() + pageAdjustment - $parent.offset().left;
			
			$(options.Selectors.Gallery).stop().animate({ scrollLeft: elementScrollLeft }, 1000);
		}
	};
	
	window.TapGallery = TapGallery;
})();