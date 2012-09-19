mamd.define("wrcb.actors.Background", [
        "wrcb.core.utils",
        "wrcb.loader.Assets",
        "wrcb.core.Actor"
    ],
    function (utils, assets, Actor) {
        var Background = function (params) {
            var sprite = assets.get(params.asset),
                camera = null,
                scene = null,
                viewport = null;

            params.width = sprite.width;
            params.height = sprite.height;

            this.constructor(params);

            this.draw = function (context) {
                var d = this.getDimensions();
                context.drawImage(sprite, 0, 0, d[0], d[1]);
            };
        };
        Background.prototype = new Actor();

        return Background;
    }
);
