$(document).ready(function () {
    var data = {
        "pamporovo": "https://www.youtube.com/watch?v=E6RPadYqsKE"
    };

    var hash = url_query("ref");
    $.each(data, function (key, val) {
        if (hash === key) {
            window.location = val;
        }
    });

    if (Math.random() < 0.3) {
        $(".glitch-wrapper").find("h1").hide();
        $(".glitch-wrapper").find("div").show();
    }
});

function url_query(query) {
    query = query.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var expr = "[\\?&]" + query + "=([^&#]*)";
    var regex = new RegExp(expr);
    var results = regex.exec(window.location.href);
    if (results !== null) {
        return results[1];
    } else {
        return false;
    }
}