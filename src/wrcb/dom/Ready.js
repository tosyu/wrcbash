mamd.define("wrcb.dom.Ready", function () {

    /*Copyright (c) 2012 John Resig, http://jquery.com/

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

    var userAgent = navigator.userAgent.toLowerCase(),
        browser = {
            version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
            safari: /webkit/.test(userAgent),
            opera: /opera/.test(userAgent),
            msie: (/msie/.test(userAgent)) && (!/opera/.test( userAgent )),
            mozilla: (/mozilla/.test(userAgent)) && (!/(compatible|webkit)/.test(userAgent))
        },
        readyBound = false,
        isReady = false,
        readyList = [],
        domReady = function () {
            // Make sure that the DOM is not already loaded
            if(!isReady) {
                // Remember that the DOM is ready
                isReady = true;

                if(readyList) {
                    for(var fn = 0; fn < readyList.length; fn++) {
                        readyList[fn].call(window, []);
                    }

                    readyList = [];
                }
            }
        },
        addLoadEvent = function(func) {
            var oldonload = window.onload;
            if (typeof window.onload != 'function') {
                window.onload = func;
            } else {
                window.onload = function() {
                    if (oldonload) {
                        oldonload();
                    }
                func();
                }
            }
        },
        bindReady = function() {
            if (readyBound) {
                return false;
            }
            readyBound = true;

            // Mozilla, Opera (see further below for it) and webkit nightlies currently support this event
            if (document.addEventListener && !browser.opera) {
                // Use the handy event callback
                document.addEventListener("DOMContentLoaded", domReady, false);
            }

            // If IE is used and is not in a frame
            // Continually check to see if the document is ready
            if (browser.msie && window == top) (function(){
                if (isReady) return;
                try {
                    // If IE is used, use the trick by Diego Perini
                    // http://javascript.nwbox.com/IEContentLoaded/
                    document.documentElement.doScroll("left");
                } catch(error) {
                    setTimeout(arguments.callee, 0);
                    return;
                }
                // and execute any waiting functions
                domReady();
            })();

            if(browser.opera) {
                document.addEventListener( "DOMContentLoaded", function () {
                    if (isReady) return;
                    for (var i = 0; i < document.styleSheets.length; i++)
                        if (document.styleSheets[i].disabled) {
                            setTimeout( arguments.callee, 0 );
                            return;
                        }
                    // and execute any waiting functions
                    domReady();
                }, false);
            }

            if(browser.safari) {
                var numStyles;
                (function(){
                    if (isReady) return;
                    if (document.readyState != "loaded" && document.readyState != "complete") {
                        setTimeout( arguments.callee, 0 );
                        return;
                    }
                    if (numStyles === undefined) {
                        var links = document.getElementsByTagName("link");
                        for (var i=0; i < links.length; i++) {
                            if(links[i].getAttribute('rel') == 'stylesheet') {
                                numStyles++;
                            }
                        }
                        var styles = document.getElementsByTagName("style");
                        numStyles += styles.length;
                    }
                    if (document.styleSheets.length != numStyles) {
                        setTimeout( arguments.callee, 0 );
                        return;
                    }

                    // and execute any waiting functions
                    domReady();
                })();
            }

            // A fallback to window.onload, that will always work
            addLoadEvent(domReady);
        };
        bindReady();
        return function(fn, args) {
                // Attach the listeners
                bindReady();

                // If the DOM is already ready
                if (isReady) {
                    // Execute the function immediately
                    fn.call(window, []);
                } else {
                    // Add the function to the wait list
                    readyList.push( function() { return fn.call(window, []); } );
                }
            };
});
