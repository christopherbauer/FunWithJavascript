	(function () {
		"use strict";

		var ScrollGallery = function (options) {
			var defaults = {
				PageSize: 3,
				Page: 0,
				Prefix: "sg",
				MaintainScrollPosition: false,
				Selectors: {
					Gallery: null,
					Next: null,
					Previous: null,
					Indicators: null,
					PageTotal: null,
					PageCurrent: null
				},
				IndicatorOptions: {
					Rounded: true,
					ShowPageNumber: false,
					ClickToJump: true
				}
			};

			options = $.extend(defaults, options);

			var Prefix = "data-" + options.Prefix;

			var itemCount;

			function rankElements() {
				var $elements = $(options.Selectors.Gallery).find("> *");
				$elements.each(function (i, element) {
					$(element).attr(Prefix + "-rank", i);
				});
			}

			function makeElementsClassy() {
				$(options.Selectors.Gallery).addClass("scroll-gallery");
				var $elements = $(options.Selectors.Gallery).find("> *");
				$elements.each(function (i, element) {
					$(element).addClass("scroll-gallery-element");
				});
			}

			function refreshItemCount() {
				itemCount = $(options.Selectors.Gallery).find("[" + Prefix + "-rank]").length;
			}

			function hasNextPage() {
				return (options.Page + 1) * options.PageSize < itemCount;
			}

			function hasPreviousPage() {
				return options.Page > 0;
			}

			function checkButtons() {
				$(options.Selectors.Next).prop("disabled", !hasNextPage());
				$(options.Selectors.Previous).prop("disabled", !hasPreviousPage());
			}

			function getScrollPosition() {
				var $scrollElement = $(options.Selectors.Gallery).find("[" + Prefix + "-rank='" + [options.Page * options.PageSize] + "']");

				var layout = ($scrollElement.outerWidth(true) - $scrollElement.innerWidth()) / 2;

				var pageAdjustment = options.Page > 0 ? layout : 0;

				var $parent = $scrollElement.parent();
				
				return ($scrollElement.position().left - layout) + $parent.scrollLeft() + pageAdjustment - $parent.offset().left;
			}

			function scrollTo() {
				$(options.Selectors.Gallery).stop().animate({ scrollLeft: getScrollPosition() }, 1000);
			}

			function getTotalPages() {
				return Math.ceil(itemCount / options.PageSize);
			}

			function createIndicators() {
				var $container = $(options.Selectors.Indicators);
				var $ul = $("<ul></ul>");
				if (options.IndicatorOptions.ShowPageNumber) {
					$ul.attr("show-page-number", '');
				}
				if (options.IndicatorOptions.Rounded) {
					$ul.attr("rounded", '');
				}
				for (var i = 0; i < getTotalPages() ; i++) {
					$ul.append("<li data-page-number=" + (i + 1) + "><span>" + i + "</span></li>");
				}

				$container.append($ul);

				$(options.Selectors.Indicators).find("[data-page-number]").on("click", function () {
					$(options.Selectors.Gallery).trigger("page-changed", {
						Page: parseInt($(this).data("page-number")) - 1
					});
				});
			}

			function checkIndicators() {
				$(options.Selectors.Indicators).find("[data-page-number]").removeAttr("current-page");
				$(options.Selectors.Indicators).find("[data-page-number=" + (options.Page + 1) + "]").attr("current-page", '');
			}

			function checkPageIndex() {
				if ($(options.Selectors.PageCurrent).length) {
					$(options.Selectors.PageCurrent).text(options.Page+1);
				}
				if ($(options.Selectors.PageTotal).length) {
					$(options.Selectors.PageTotal).text(getTotalPages());
				}
			}

			function onPageChanged(event, data) {
				options.Page = data.Page;
				scrollTo();
				checkButtons();
				checkIndicators();
				checkPageIndex();
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

				if (!options.MaintainScrollPosition) {
					$(document).ready(function() {
						$(options.Selectors.Gallery).scrollLeft(0);
					});
				} else {
					$(document).ready(function () {
						$(options.Selectors.Gallery).scrollLeft(getScrollPosition());
					});
				}
				checkButtons();
				if ($(options.Selectors.Indicators).length) {
					createIndicators();
					checkIndicators();
				}
				checkPageIndex();
			}

			initialize();
		};

		window.ScrollGallery = window.ScrollGallery || ScrollGallery;
	})();