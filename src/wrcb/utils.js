mamd.define("wrcb.utils", function () {
    return {

        "bind": function (func, oThis) {

            if (typeof func !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var args = Array.prototype.slice.call(arguments, 2),
                fToBind = func,
                fNOP = function () {},
                fBound = function () {
                    return fToBind.apply(func instanceof fNOP
                        ? this
                        : oThis,
                        args.concat(Array.prototype.slice.call(arguments)));
                };

            if ("bind" in func) {
                return func.bind.apply(func, Array.prototype.slice.call(arguments, 1));
            }

            fNOP.prototype = func.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        },

        "indexOf": function (haystack, needle) {
            var l = haystack.length;
            if (haystack.indexOf) {
                return haystack.indexOf.call(haystack, needle);
            }

            while (--l >= 0) {
                if (haystack[l] === needle) {
                    return l;
                }
            }

            return -1;
        },

        "bindEvent": function (element) {
            var bindFunc = element.attachEvent || element.addEventListener,
                args = Array.prototype.slice.call(arguments, 1);
            bindFunc.apply(element, args);
        },

        "unbindEvent": function (element) {
            var bindFunc = element.dettachEvent || element.removeEventListener,
                args = Array.prototype.slice.call(arguments, 1);
            bindFunc.apply(element, args);
        },

        "getColor": function (r, g, b, a) {
            return !!a
                ? ['rgba(', [r, g, b, a].join(','), ')'].join('')
                : ['rgb(', [r, g, b].join(','), ')'].join('');
        }
    }
});
