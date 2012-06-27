mamd.define("wrcb.loader.Request", function () {

    var Request = function (params) {
        if (!params || typeof params !== "object") {
            throw "Request params not definet or not an config object";
        }

        if (!("url" in params)) {
            throw "No request url defined!";
        }

        var req = new XMLHttpRequest(),
            id = [+new Date(), Math.floor(Math.random() * 1000 + 1)].join('@'),
            listeners = {},
            _self = this;

        req.open(params.method || "GET",
            params.url,
            "async" in params
                ? params.async
                : false
            );

        // INTERNAL
        var fire = function (type, data) {
            var i = 0,
                imax;
            if (listeners[type] && listeners[type].length > 0) {
                imax = listeners[type].length;
                for (; i < imax; i++) {
                    window.setTimeout(listeners[type][i].bind(listeners[type][i], data), 15);
                }
                return true;
            }
            return false;
        };

        // EXTERNAL
        this.on = function (type, callback) {
            if (!listeners[type]) {
                listeners[type] = [];
            }
            listeners[type].push(callback);
            return _self;
        };

        this.un = function (type, callback) {
            var l = listeners[type].length;
            while (--l >= 0) {
                if (listeners[type][l] === callback) {
                    listeners[type].splice(l, 1);
                }
            }
            return _self;
        };

        this.getRequestObject = function () {
            return req;
        };

        this.getResponse = getResponse = function () {
            return JSON.parse(req.responseText);
        };

        this.getStatus = function () {
            return req.status;
        };
        this.abort = function () {
            req.abort();
        };
        this.send = function(body) {
            req.onreadystatechange = function (evt) {
                switch(req.readyState) {
                case 4:
                    fire("load", getResponse());
                    if (req.status === 200 || req.status === 201 || req.status === 0) {
                        fire("success", getResponse());
                    } else {
                        fire("error", getResponse());
                    }
                    break;
                }
            };
            try {
                req.send(body);
            } catch (e) {
                fire("error");
            }
        };
    };

    return {
        "create": function (params) {
            return new Request(params);
        }
    }
});
