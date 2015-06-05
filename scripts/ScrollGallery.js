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
				Previous: null,
				Indicators: null
			},
			IndicatorOptions: {
				Rounded: true,
				ShowPageNumber: false
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
	
		function makeElementsClassy() {
			$(options.Selectors.Gallery).addClass("scroll-gallery");
			var $elements = $(options.Selectors.Gallery).find("*");
			$elements.each(function (i, element) {
				$(element).addClass("scroll-gallery-element");
			});
		}
	
		function refreshItemCount() {
			itemCount = $(options.Selectors.Gallery).find("["+rankAttribute+"]").length;
		}
		
		function hasNextPage() {
			return (options.Page+1)*options.PageSize < itemCount;
		}
		
		function hasPreviousPage() {
			return options.Page > 0;
		}
		
		function checkButtons() {
			$(options.Selectors.Next).prop("disabled", !hasNextPage());
			$(options.Selectors.Previous).prop("disabled", !hasPreviousPage());
		}
		
		function scrollTo() {
			var $scrollElement = $(options.Selectors.Gallery).find("[" + rankAttribute+"='"+[options.Page * options.PageSize]+"']");
			
			var layout = ($scrollElement.outerWidth(true)-$scrollElement.innerWidth()) / 2;
				
			var pageAdjustment = options.Page > 0 ? layout : 0;
			
			var $parent = $scrollElement.parent();
			
			var elementScrollLeft = ($scrollElement.position().left - layout) + $parent.scrollLeft() + pageAdjustment - $parent.offset().left;
			
			$(options.Selectors.Gallery).stop().animate({ scrollLeft: elementScrollLeft }, 1000);
		}
		
		function createIndicators() {			
			var container = $(options.Selectors.Indicators);
			var ul = $("<ul></ul>");
			if(options.IndicatorOptions.ShowPageNumber) {
				ul.attr("show-page-number",'');
			}
			if(options.IndicatorOptions.Rounded) {
				ul.attr("rounded", '');
			}
			for(var i = 0; i<Math.ceil(itemCount/options.PageSize); i++) {
				ul.append("<li data-page-number="+(i+1)+"><span>"+i+"</span></li>");
			}
			container.append(ul);
		}
		
		function checkIndicators () {
			$(options.Selectors.Indicators).find("[data-page-number]").removeAttr("current-page");
			$(options.Selectors.Indicators).find("[data-page-number="+(options.Page+1)+"]").attr("current-page", '');
		}
		
		function onPageChanged(event, data) {
			options.Page = data.Page;
			scrollTo();
			checkButtons();
			checkIndicators();
		}
		
		function onNextPage() {
			if (hasNextPage()) {
				$(options.Selectors.Gallery).trigger("page-changed", {
					Page: options.Page + 1
				});
			}
		}
		
		function onPreviousPage() {
			if (hasPreviousPage()) {
				$(options.Selectors.Gallery).trigger("page-changed", {
					Page: options.Page - 1
				});
			}
		}
		
		function initialize() {
			$(options.Selectors.Gallery).on("page-changed", onPageChanged);
			$(options.Selectors.Next).on("click", onNextPage);
			$(options.Selectors.Previous).on("click", onPreviousPage);
			
			rankElements();
			makeElementsClassy();
			refreshItemCount();	
			
			if($(options.Selectors.Indicators).length) {
				createIndicators();
			}

			checkButtons();
			checkIndicators();
		}
		
		initialize();
	};
	
	window.ScrollGallery = window.ScrollGallery || ScrollGallery;
})();