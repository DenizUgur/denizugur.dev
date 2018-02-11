$(document).ready(function () {
    var data = {
        "google": "https://www.google.com"
        "pamporovo": "https://www.youtube.com/watch?v=E6RPadYqsKE"
    };

    var hash = window.location.hash.substring(1);

    $.each(data, function (key, val) {
        if (hash === key) {
            window.location = val;
        }
    });
});
