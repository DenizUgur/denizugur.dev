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

    if (hash == "test1") {
        window.scrollTo(0, 1);
    } else if (hash == "test2") {
        window.scrollTo(0, 100);
    } else {
         var doc = window.document;
         // If there's a hash, or addEventListener is undefined, stop here
         if (!location.hash && window.addEventListener) {

             //scroll to 1
             window.scrollTo(0, 1);
             var scrollTop = 1,
                 getScrollTop = function () {
                     return window.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
                 },

                 //reset to 0 on bodyready, if needed
                 bodycheck = setInterval(function () {
                     if (doc.body) {
                         clearInterval(bodycheck);
                         scrollTop = getScrollTop();
                         window.scrollTo(0, scrollTop === 1 ? 0 : 1);
                     }
                 }, 15);

             window.addEventListener("load", function () {
                 setTimeout(function () {
                     //at load, if user hasn't scrolled more than 20 or so...
                     if (getScrollTop() < 20) {
                         //reset to hide addr bar at onload
                         window.scrollTo(0, scrollTop === 1 ? 0 : 1);
                     }
                 }, 0);
             }, false);
         }
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