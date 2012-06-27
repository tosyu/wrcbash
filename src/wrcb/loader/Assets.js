mamd.define("wrcb.loader.Assets", ["wrcb.loader.Request"], function (request) {
    var assets = [],
        loaded = 0,
        failed = 0,
        onLoad = false,
        onFailed = false,
        add = function (url, type) {
            assets.push({
                "url": url,
                "type": type
            });
        },
        checkState = function () {
            if (loaded === assets.length) {
                !!onLoad && onLoad();
            } else if (loaded + failed === assets.length
                || failed === assets.length) {
                !!onFailed && onFailed();
            }
        },
        handleAssetLoad = function (evt) {
            loaded++;
            checkState();
            !!evt.currentTarget && !!evt.currentTarget.parentNode
                && evt.currentTarget.parentNode.removeChild(evt.currentTarget);
        },
        handleAssetError = function (evt) {
            failed++;
            checkState;
            !!evt.currentTarget && !!evt.currentTarget.parentNode
                && evt.currentTarget.parentNode.removeChild(evt.currentTarget);
        },
        loadData = function () {
            var i = assets.length,
                img,
                aud;
            while (--i >= 0) {
                console.log("loading", assets[i].url);
                switch (assets[i].type) {
                case "image":
                    img = new Image();
                    !!img.addEventListener && img.addEventListener("load", handleAssetLoad);
                    !!img.addEventListener && img.addEventListener("error", handleAssetError);
                    !!img.attachEvent && img.attachEvent("load", handleAssetLoad);
                    !!img.attachEvent && img.attachEvent("error", handleAssetError);
                    img.src = assets[i].url;
                    break;
                case "audio":
                    aud = document.createElement("audio");
                    !!aud.addEventListener && aud.addEventListener("loadeddata", handleAssetLoad);
                    !!aud.addEventListener && aud.addEventListener("loadeddata", handleAssetError);
                    !!aud.attachEvent && aud.attachEvent("load", handleAssetLoad);
                    !!aud.attachEvent && aud.attachEvent("error", handleAssetError);
                    aud.src = assets[i].url;
                    document.body.appendChild(aud);
                    break;
                }
            }
        };

    return {
        "load": function (callback) {
            onLoad = callback || false;
            var rs = request.create({
                "url": "assets/assets.json"
            });
            rs.on("success", function (data) {
                console.log("loaded descriptor", data);
                var i = data.images && data.images.length || 0;
                while (--i >= 0) {
                    add(data.images[i], "image");
                }
                var i = data.audio && data.audio.length || 0;
                while (--i >= 0) {
                    add(data.audio[i], "audio");
                }
                loadData();

            }).on("error", function () {
                console.error("could not load assets data")
            });
            rs.send();
        }
    }
});
