$(document).ready(function () {

    $("a.image").on("click", function () {

        if (!skel.vars.mobile) {
            var id = "IMG_" + $(this).attr("id");
            console.log(id);
        }

    });

});