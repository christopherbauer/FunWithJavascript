(function () {
    "use strict";

    var defaults = {
        PageSize: 3,
        PageIndex: 0,
        Prefix: "sg", /* TODO: Actually use the prefix */
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

    var statics = {
        Classes: {
            Gallery: "scroll-gallery",
            GalleryElement: "scroll-gallery-element",
            WideTouchable: "widen"
        },
        Attributes: {
            Rounded: "data-rounded",
            PageNumber: "data-page-number",
            Rank: "data-rank",
            CurrentPage: "current-page"
        },
        ItemCount: 0
    };

    var ScrollGallery = function (options) {

        var config = $.extend(defaults, options, statics);

        function enhanceElements() {
            $(config.Selectors.Gallery).addClass(config.Classes.Gallery);

            var $elements = $(config.Selectors.Gallery).find("> *");
            $elements.each(function (i, element) {
                $(element).attr(config.Attributes.Rank, i);
                $(element).addClass(config.Classes.GalleryElement);
            });
        }

        function createPageIndicators() {
            var $container = $(config.Selectors.Indicators);

            if (config.IndicatorOptions.IncreaseTouchSurface) {
                $container.addClass(config.Classes.WideTouchable);
            }

            var $ul = $("<ul></ul>");

            if (config.IndicatorOptions.Rounded) {
                $ul.attr(config.Attributes.Rounded, "true");
            }

            for (var i = 0; i < getTotalPages() ; i++) {
                var $li = $("<li></li>");
                $li.attr(config.Attributes.PageNumber, i + 1);

                var $button = $("<button />");
                $button.val(config.IndicatorOptions.ShowPageNumber ? (i + 1) : "");
                $li.append($button);

                $ul.append($li);
            }

            $container.append($ul);

            $(config.Selectors.Indicators).find("[" + config.Attributes.PageNumber + "]").on("click", function () {
                $(config.Selectors.Gallery).trigger("page-changed", {
                    PageIndex: parseInt($(this).attr(config.Attributes.PageNumber)) - 1
                });
            });
        }

        function updatePageButtons() {
            $(config.Selectors.Next).prop("disabled", !hasNextPage());
            $(config.Selectors.Previous).prop("disabled", !hasPreviousPage());
        }

        function updatePageIndicators() {
            $(config.Selectors.Indicators).find("[" + config.Attributes.PageNumber + "]").removeAttr(config.Attributes.CurrentPage);
            $(config.Selectors.Indicators).find("[" + config.Attributes.PageNumber + "=" + (config.PageIndex + 1) + "]").attr(config.Attributes.CurrentPage, true);
        }

        function updatePageDisplay() {
            $(config.Selectors.PageCurrent).text(config.PageIndex + 1);
            $(config.Selectors.PageTotal).text(getTotalPages());
        }

        function updateItemCount() {
            config.ItemCount = $(config.Selectors.Gallery).find("[" + config.Attributes.Rank + "]").length;
        }

        function hasNextPage() {
            return (config.PageIndex + 1) * config.PageSize < config.ItemCount;
        }

        function hasPreviousPage() {
            return config.PageIndex > 0;
        }


        function getScrollPosition() {
            var $scrollElement = $(config.Selectors.Gallery).find("[" + config.Attributes.Rank + "='" + [config.PageIndex * config.PageSize] + "']");

            var layout = ($scrollElement.outerWidth(true) - $scrollElement.innerWidth()) / 2;

            var pageAdjustment = config.PageIndex > 0 ? layout : 0;

            var $parent = $scrollElement.parent();

            return ($scrollElement.position().left - layout) + $parent.scrollLeft() + pageAdjustment - $parent.offset().left;
        }

        function scrollTo() {
            $(config.Selectors.Gallery).stop().animate({ scrollLeft: getScrollPosition() }, config.Speed, config.Easing);
        }

        function getTotalPages() {
            return Math.ceil(config.ItemCount / config.PageSize);
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

        function validate() {
            if (!$(config.Selectors.Gallery).length) {
                throw "Missing Selector: Gallery";
            }

            if (!$(config.Selectors.Indicators).length && (!$(config.Selectors.Previous) || !$(config.Selectors.Next))) {
                throw "Missing Selector: Indicators or Previous/Next";
            }
        }

        function initialize() {
            validate();

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