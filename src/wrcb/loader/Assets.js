mamd.define("wrcb.loader.Assets", ["wrcb.loader.Request"], function (request) {
    return {
        "load": function () {
            var rs = request.create({
                "url": "assets/assets.json"
            });
            rs.addEventListener(function (data) {
                console.log("loaded", data);
            });
            rs.send();
        }
    }
});
