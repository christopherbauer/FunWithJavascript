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

        var config = $.extend(defaults, options);

        var Prefix = "data-" + config.Prefix;

        var itemCount;

        function enhanceElements() {
            $(config.Selectors.Gallery).addClass("scroll-gallery");

            var $elements = $(config.Selectors.Gallery).find("> *");
            $elements.each(function (i, element) {
                $(element).attr(Prefix + "-rank", i);
                $(element).addClass("scroll-gallery-element");
            });
        }

        function createPageIndicators() {
            var $container = $(config.Selectors.Indicators);

            if (config.IndicatorOptions.IncreaseTouchSurface) {
                $container.addClass("widen");
            }

            var $ul = $("<ul></ul>");

            if (config.IndicatorOptions.Rounded) {
                $ul.attr("data-rounded", "true");
            }

            for (var i = 0; i < getTotalPages() ; i++) {
                var $li = $("<li></li>");
                $li.attr("data-page-number", i + 1);

                var $button = $("<button />");
                $button.val(config.IndicatorOptions.ShowPageNumber ? (i + 1) : "");
                $li.append($button);

                $ul.append($li);
            }

            $container.append($ul);

            $(config.Selectors.Indicators).find("[data-page-number]").on("click", function () {
                $(config.Selectors.Gallery).trigger("page-changed", {
                    PageIndex: parseInt($(this).data("page-number")) - 1
                });
            });
        }

        function updatePageButtons() {
            $(config.Selectors.Next).prop("disabled", !hasNextPage());
            $(config.Selectors.Previous).prop("disabled", !hasPreviousPage());
        }

        function updatePageIndicators() {
            $(config.Selectors.Indicators).find("[data-page-number]").removeAttr("current-page");
            $(config.Selectors.Indicators).find("[data-page-number=" + (config.PageIndex + 1) + "]").attr("current-page", '');
        }

        function updatePageDisplay() {
            if ($(config.Selectors.PageCurrent).length) {
                $(config.Selectors.PageCurrent).text(config.PageIndex + 1);
            }
            if ($(config.Selectors.PageTotal).length) {
                $(config.Selectors.PageTotal).text(getTotalPages());
            }
        }

        function updateItemCount() {
            itemCount = $(config.Selectors.Gallery).find("[" + Prefix + "-rank]").length;
        }

        function hasNextPage() {
            return (config.PageIndex + 1) * config.PageSize < itemCount;
        }

        function hasPreviousPage() {
            return config.PageIndex > 0;
        }


        function getScrollPosition() {
            var $scrollElement = $(config.Selectors.Gallery).find("[" + Prefix + "-rank='" + [config.PageIndex * config.PageSize] + "']");

            var layout = ($scrollElement.outerWidth(true) - $scrollElement.innerWidth()) / 2;

            var pageAdjustment = config.PageIndex > 0 ? layout : 0;

            var $parent = $scrollElement.parent();

            return ($scrollElement.position().left - layout) + $parent.scrollLeft() + pageAdjustment - $parent.offset().left;
        }

        function scrollTo() {
            $(config.Selectors.Gallery).stop().animate({ scrollLeft: getScrollPosition() }, config.Speed, config.Easing);
        }

        function getTotalPages() {
            return Math.ceil(itemCount / config.PageSize);
        }

        function onPageChanged(event, data) {
            config.PageIndex = data.PageIndex;
            scrollTo();
            updatePageButtons();
            updatePageIndicators();
            updatePageDisplay();
        }

        function onNextPage() {
            if (hasNextPage()) {
                $(config.Selectors.Gallery).trigger("page-changed", {
                    PageIndex: config.PageIndex + 1
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
            $(config.Selectors.Gallery).on("page-changed", onPageChanged);
            $(config.Selectors.Next).on("click", onNextPage);
            $(config.Selectors.Previous).on("click", onPreviousPage);

            enhanceElements();
            updateItemCount();

            if (!config.MaintainScrollPosition) {
                $(document).ready(function () {
                    $(config.Selectors.Gallery).scrollLeft(0);
                });
            } else {
                $(document).ready(function () {
                    $(config.Selectors.Gallery).scrollLeft(getScrollPosition());
                });
            }
            updatePageButtons();
            if ($(config.Selectors.Indicators).length) {
                createPageIndicators();
                updatePageIndicators();
            }
            updatePageDisplay();
        }

        initialize();
    };

    window.ScrollGallery = window.ScrollGallery || ScrollGallery;
})();