(function() {
	"use strict";
	
	var ScrollGallery = function(options) {
		var defaults = { 
			PageSize: 3, 
			Page: 0,
			RankAttribute: "sg-rank",
			Selectors : { 
				Gallery: null, 
				Next :  null, 
				Previous: null
			}
		};
		
		options = $.extend(defaults, options);
		
		var rankAttribute = "data-"+ options.RankAttribute;
		
		var itemCount;
		
		function rankElements() {
			var $elements = $(options.Selectors.Gallery).find("*");
			$elements.each(function (i, element) {
				$(element).attr(rankAttribute,i);
			});
		}
		
		rankElements();
	
		function makeElementsClassy() {
			$(options.Selectors.Gallery).addClass("scroll-gallery");
			var $elements = $(options.Selectors.Gallery).find("*");
			$elements.each(function (i, element) {
				$(element).addClass("scroll-gallery-element");
			});
		}
		makeElementsClassy();
	
		function refreshItemCount() {
			itemCount = $(options.Selectors.Gallery).find("["+rankAttribute+"]").length;
		}
		
		refreshItemCount();	
		
		function hasNextPage() {
			return (options.Page+1)*options.PageSize < itemCount;
		}
		
		$(options.Selectors.Next).on("click",function() {
			if (hasNextPage()) {
				options.Page++;
				scrollTo();
			}	
			checkButtons();
		});
		
		function hasPreviousPage() {
			return options.Page > 0;
		}
		
		$(options.Selectors.Previous).on("click",function() {
			if(hasPreviousPage()) {
				options.Page--;
				scrollTo();
			}
			checkButtons();
		});
		
		function checkButtons() {
			$(options.Selectors.Next).prop("disabled", !hasNextPage());
			$(options.Selectors.Previous).prop("disabled", !hasPreviousPage());
		}
		
		checkButtons();
		
		function scrollTo() {
			var $scrollElement = $(options.Selectors.Gallery).find("[" + rankAttribute+"='"+[options.Page * options.PageSize]+"']");
			
			var layout = ($scrollElement.outerWidth(true)-$scrollElement.innerWidth()) / 2;
				
			var pageAdjustment = options.Page > 0 ? layout : 0;
			
			var $parent = $scrollElement.parent();
			
			var elementScrollLeft = ($scrollElement.position().left - layout) + $parent.scrollLeft() + pageAdjustment - $parent.offset().left;
			
			$(options.Selectors.Gallery).stop().animate({ scrollLeft: elementScrollLeft }, 1000);
		}
	};
	
	window.ScrollGallery = window.ScrollGallery || ScrollGallery;
})();