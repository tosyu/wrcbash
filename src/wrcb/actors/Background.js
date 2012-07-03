mamd.define("wrcb.actors.Background", [
        "wrcb.core.utils",
        "wrcb.loader.Assets",
        "wrcb.core.Actor"
    ],
    function (utils, assets, Actor) {
        var Background = function () {
            var carSprite = assets.get("assets/images/sample-map.png"),
                camera = null,
                scene = null,
                viewport = null;
            this.draw = function (context) {
                var d = this.getDimensions();
                context.drawImage(carSprite, 0, 0, d[0], d[1]);
            };
        };
        Background.prototype = new Actor({
            "x": 0,
            "y": 0,
            "width": 2560,
            "height": 1600,
            "drawable": true
        });

        return Background;
    }
);
