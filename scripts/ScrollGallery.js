(function () {
    "use strict";

    var ScrollGallery = function (options) {
        var defaults = {
            PageSize: 3,
            PageIndex: 0,
            Prefix: "sg",
            MaintainScrollPosition: false,
            Easing: "",
            Speed: 1000,
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
                ClickToJump: true,
                IncreaseTouchSurface: true
            }
        };

        options = $.extend(defaults, options);

        var Prefix = "data-" + options.Prefix;

        var itemCount;

        function enhanceElements() {
            $(options.Selectors.Gallery).addClass("scroll-gallery");

            var $elements = $(options.Selectors.Gallery).find("> *");
            $elements.each(function (i, element) {
                $(element).attr(Prefix + "-rank", i);
                $(element).addClass("scroll-gallery-element");
            });
        }

        function createPageIndicators() {
            var $container = $(options.Selectors.Indicators);

            if (options.IndicatorOptions.IncreaseTouchSurface) {
                $container.addClass("widen");
            }

            var $ul = $("<ul></ul>");

            if (options.IndicatorOptions.Rounded) {
                $ul.attr("data-rounded", "true");
            }

            for (var i = 0; i < getTotalPages() ; i++) {
                var $li = $("<li></li>");
                $li.attr("data-page-number", i + 1);

                var $button = $("<button />");
                $button.val(options.IndicatorOptions.ShowPageNumber ? (i + 1) : "");
                $li.append($button);

                $ul.append($li);
            }

            $container.append($ul);

            $(options.Selectors.Indicators).find("[data-page-number]").on("click", function () {
                $(options.Selectors.Gallery).trigger("page-changed", {
                    PageIndex: parseInt($(this).data("page-number")) - 1
                });
            });
        }

        function updatePageButtons() {
            $(options.Selectors.Next).prop("disabled", !hasNextPage());
            $(options.Selectors.Previous).prop("disabled", !hasPreviousPage());
        }

        function updatePageIndicators() {
            $(options.Selectors.Indicators).find("[data-page-number]").removeAttr("current-page");
            $(options.Selectors.Indicators).find("[data-page-number=" + (options.PageIndex + 1) + "]").attr("current-page", '');
        }

        function updatePageDisplay() {
            if ($(options.Selectors.PageCurrent).length) {
                $(options.Selectors.PageCurrent).text(options.PageIndex + 1);
            }
            if ($(options.Selectors.PageTotal).length) {
                $(options.Selectors.PageTotal).text(getTotalPages());
            }
        }

        function updateItemCount() {
            itemCount = $(options.Selectors.Gallery).find("[" + Prefix + "-rank]").length;
        }

        function hasNextPage() {
            return (options.PageIndex + 1) * options.PageSize < itemCount;
        }

        function hasPreviousPage() {
            return options.PageIndex > 0;
        }


        function getScrollPosition() {
            var $scrollElement = $(options.Selectors.Gallery).find("[" + Prefix + "-rank='" + [options.PageIndex * options.PageSize] + "']");

            var layout = ($scrollElement.outerWidth(true) - $scrollElement.innerWidth()) / 2;

            var pageAdjustment = options.PageIndex > 0 ? layout : 0;

            var $parent = $scrollElement.parent();

            return ($scrollElement.position().left - layout) + $parent.scrollLeft() + pageAdjustment - $parent.offset().left;
        }

        function scrollTo() {
            $(options.Selectors.Gallery).stop().animate({ scrollLeft: getScrollPosition() }, options.Speed, options.Easing);
        }

        function getTotalPages() {
            return Math.ceil(itemCount / options.PageSize);
        }

        function onPageChanged(event, data) {
            options.PageIndex = data.PageIndex;
            scrollTo();
            updatePageButtons();
            updatePageIndicators();
            updatePageDisplay();
        }

        function onNextPage() {
            if (hasNextPage()) {
                $(options.Selectors.Gallery).trigger("page-changed", {
                    PageIndex: options.PageIndex + 1
                });
            }
        }

        function onPreviousPage() {
            if (hasPreviousPage()) {
                $(options.Selectors.Gallery).trigger("page-changed", {
                    PageIndex: options.PageIndex - 1
                });
            }
        }

        function initialize() {
            $(options.Selectors.Gallery).on("page-changed", onPageChanged);
            $(options.Selectors.Next).on("click", onNextPage);
            $(options.Selectors.Previous).on("click", onPreviousPage);

            enhanceElements();
            updateItemCount();

            if (!options.MaintainScrollPosition) {
                $(document).ready(function () {
                    $(options.Selectors.Gallery).scrollLeft(0);
                });
            } else {
                $(document).ready(function () {
                    $(options.Selectors.Gallery).scrollLeft(getScrollPosition());
                });
            }
            updatePageButtons();
            if ($(options.Selectors.Indicators).length) {
                createPageIndicators();
                updatePageIndicators();
            }
            updatePageDisplay();
        }

        initialize();
    };

    window.ScrollGallery = window.ScrollGallery || ScrollGallery;
})();