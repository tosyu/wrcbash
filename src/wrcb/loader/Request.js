mamd.define("wrcb.loader.Request", function () {
    var RequestObject = false;
    try{
        // create XMLHttpRequest (Gecko, WebKit, Presto, Trident w IE>6)
        RequestObject = XMLHttpRequest();
    } catch(e) {
        try {
            // try ActiveXObject, from ActiveX IE
            RequestObject = ActiveXObject("Msxml2_XMLHTTP");
        } catch(e) {
            try {
            // Utworzenie obiektu ActiveXObject, dla innych wersji IE
                RequestObject = ActiveXObject("Microsoft_XMLHTTP");
            } catch(e) {}
        }
    }

    var Request = function (params) {
        /*if (!RequestObject) {
            throw "No sufficient request object available!";
        }*/

        if (!params || typeof params !== "object") {
            throw "Request params not definet or not an config object";
        }

        if (!("url" in params)) {
            throw "No request url defined!";
        }

        console.log("typeof ", typeof RequestObject)

        var req = new RequestObject(),
            id = [+new Date(), Math.floor(Math.random() * 1000 + 1)].join('@'),
            listeners;

        req.open(params.method || "GET",
            params.url,
            "async" in params
                ? params.async
                : false
            );

        // INTERNAL
        var fireEvents = function (type, data) {
            var i = 0,
                imax;
            if (listeners[type] && listeners[type].length > 0) {
                imax = listeners[type];
                for (; i < imax; i++) {
                    window.setTimeout(listeners[type][i].bind(listeners[type][i], data), 15);
                }
                return true;
            }
            return false;
        };

        // EXTERNAL
        this.addEventListener = function (type, callback) {
            if (!listeners[type]) {
                listeners[type] = [];
            }
            listeners[type].push(callback);
        };

        this.removeEventListener = function (type, callback) {
            var l = listeners[type].length;
            while (--l >= 0) {
                if (listeners[type][l] === callback) {
                    listeners[type].splice(l, 1);
                }
            }
        };

        this.getRequestObject = function () {
            return req;
        };

        this.getResponse = function () {
            return req.responseText;
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
                    fireEvents("load", this.getResponse());
                    if (req.status === 200 || req.status === 201) {
                        fireEvents("success", this.getResponse());
                    } else {
                        fireEvents("error", this.getResponse());
                    }
                    break;
                }
            };
            req.send(body);
        };
    };

    return {
        "create": function Request_create(params) {
            return new Request(params);
        }
    }
});
