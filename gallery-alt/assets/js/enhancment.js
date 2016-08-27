$(document).ready(function () {

    function tooltip() {
        $.ajax({
            type: "GET",
            url: "./images/images.xml",
            dataType: "xml",
            success: xmlParser
        });

        function xmlParser(xml) {

            var id = $(".active > a").first().attr("id");

            var $xml = $(xml),
                size = $xml.find("images[id='" + id + "'] size").text(),
                dh = $xml.find("images[id='" + id + "'] dh").text(),
                dv = $xml.find("images[id='" + id + "'] dv").text();

            var str = size + ", " + dh + "x" + dv;

            $("p > a").first()
                .attr("data-toggle", "tooltip")
                .attr("title", str);
            $('[data-toggle="tooltip"]').tooltip();

        }
    }
    
    tooltip();

});