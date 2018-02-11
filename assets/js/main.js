"use strict";
(function () {
    var hash = window.location.hash.substring(1);

    $.getJSON("refs.json", function (data) {
        $.each(data, function (key, val) {
            if (hash.equals(key)) {
                window.location = val;
            }
        });
    });
})();
