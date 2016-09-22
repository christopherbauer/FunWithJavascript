var Dialog = (function () {
    var instance;

    function createInstance() {
        var $dialog = $("<div id=\"dialogDisplay\"></div>");
        return $dialog;
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance()
                    .appendTo("body")
                    .dialog({
                        modal: true,
                        autoOpen: false,
                        width: ($(window).width() * .80)
                    });
            }
            return instance;
        }
    };
})();
