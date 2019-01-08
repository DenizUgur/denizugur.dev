$(document).ready(function () {
    var url = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=Deniz343&api_key=fa142978a84c511403a710029688c023&format=json&limit=1";

    $.get(url, function (data) {
        var name = data.recenttracks.track[0].name;
        var artist = data.recenttracks.track[0].artist["#text"];
        var album = data.recenttracks.track[0].album["#text"];
        var image = data.recenttracks.track[0].image[2]["#text"];
        var lastfm_url = data.recenttracks.track[0].url;
        var nowplaying = "false";
        if (data.recenttracks.track[0]["@attr"])
            var nowplaying = data.recenttracks.track[0]["@attr"].nowplaying;

        if (name.length > 0) {
            $(".artist").html(artist);
            $(".song").html(name);
            $(".album").html(album);
            if (image.length > 0) {
                var ai = new Image();
                ai.crossOrigin = "Anonymous";
                ai.src = image;
                ai.onload = function () {
                    $(".art").css("background-image", "url('" + image + "')");
                };
            }
            $(".art").on("click", function () {
                window.open(lastfm_url, "_blank");
            });
        }
        if (nowplaying == "true") {
            $("#playbox").addClass("pulse");
        }
    });
});