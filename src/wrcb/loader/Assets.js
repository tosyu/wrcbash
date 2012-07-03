mamd.define("wrcb.loader.Assets", ["wrcb.core.utils", "wrcb.core.Request"], function (utils, request) {
    var assets = [],
        loadedAssets = {}
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
        handleAssetLoad = function (url, evt) {
            DEBUG && console.log("loaded", url);
            loadedAssets[url] = evt.currentTarget;
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
                aud,
                url;
            while (--i >= 0) {
                DEBUG && console.log("loading", assets[i].url);
                url = assets[i].url;
                switch (assets[i].type) {
                case "image":
                    img = new Image();
                    utils.bindEvent(img, "load", utils.bind(handleAssetLoad, handleAssetLoad, url));
                    utils.bindEvent(img, "error", handleAssetError);
                    img.src = assets[i].url;
                    break;
                case "audio":
                    aud = document.createElement("audio");
                    utils.bindEvent(aud, "loadeddata", utils.bind(handleAssetLoad, handleAssetLoad, url));
                    utils.bindEvent(aud, "error", handleAssetError);
                    aud.src = assets[i].url;
                    document.body.appendChild(aud);
                    break;
                }
            }
        };

    return {
        "load": function (_assets, callback) {
            var process = function (data) {
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
            };
            failed = 0;
            loaded = 0;
            assets = [];
            onLoad = callback || false;
            if (typeof _assets === "object") {
                process(_assets);
            } else if (typeof _assets === "string") {
                var rs = request.create({
                    "url": _assets
                });
                rs.on("success", process).on("error", function () {
                    console.error("could not load assets data")
                });
                rs.send();
            }
        },

        "get": function (path) {
            return !!loadedAssets[path] && loadedAssets[path];
        }
    }
});
