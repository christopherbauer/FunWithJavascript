var Clipboard = (function () {
    return {
        ready: function (selector) {
            new Clipboard(selector,
            {
                text: function(trigger) {
                    if ($(trigger).attr("data-clipboard-target")) {
                        return $($(trigger).attr("data-clipboard-target")).text();
                    }
                    return $(trigger).text();
                }
            });
        }
    }
})();