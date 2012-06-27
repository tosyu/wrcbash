mamd.define("wrcb.utils", function () {
    return {
        "getColor": function (r, g, b, a) {
            return !!a
                ? ['rgba(', [r, g, b, a].join(','), ')'].join('')
                : ['rgb(', [r, g, b].join(','), ')'].join('');
        }
    }
});
