mamd.define("wrcb.utils", function () {
    return {
        "indexOf": function (haystack, needle) {
            var l = haystack.length;
            if (haystack.indexOf) {
                return haystack.indexOf.call(arr, needle);
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
