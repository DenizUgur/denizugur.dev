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

    var url = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=Deniz343&api_key=fa142978a84c511403a710029688c023&format=json&limit=1";

    $.get(url, function (data) {
        var name = data.recenttracks.track[0].name;
        var artist = data.recenttracks.track[0].artist["#text"];
        var lastfm_url = data.recenttracks.track[0].url;
        var nowplaying = "false";
        if (data.recenttracks.track[0]["@attr"])
            var nowplaying = data.recenttracks.track[0]["@attr"].nowplaying;

        var text = name;
        if (text.length > 0) $("#lastfm").html("</br>\u266a " + text);
        $("#lastfm").attr("href", lastfm_url);
        if (nowplaying == "true") {
            $("#lastfm").addClass("pulse");
        }
    });
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