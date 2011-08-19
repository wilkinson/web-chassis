//- JavaScript source code

//- epu.js ~~
//
//  Here, "epu" stands for "e pluribus unum", which is both an American motto
//  and a Latin phrase meaning "one out of many". The idea behind this program
//  is to demonstrate concatenation of inline scripts inside a webpage.
//
//  What turned out to be even more interesting about this program, however,
//  was that I realized how to use DOM event listeners to define "phony"
//  libraries that re-trigger Web Chassis execution, allowing me in this case
//  to ensure all codes in the webpage run before this one does :-)
//
//                                                      ~~ (c) SRW, 18 Aug 2011

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base");

    if (q.detects("window")) {
        (function (f) {
            window.onunload = function () {
                if (typeof f === 'function') {
                    f.apply(this, arguments);
                }
                q.run_on_unload = function () {};
            };
        }(window.onunload));
    } else {
        q.puts("This demonstration only runs in a browser context.");
        return;
    }

 // And here is our "phony" library. We can make the title arbitrarily bizarre
 // in order to ensure that this code doesn't run until we decide it does ;-)

    q.lib("run_on_unload");

 // Declarations

    var i, s, x, y;

 // Definitions / Demonstrations / Invocations

    s = document.createElement("script");
    s.innerHTML += 'alert("Goodbye!");';
    document.body.appendChild(s);

    x = document.getElementsByTagName("script");

    y = q.base$map(x).using(function (each) {
        return each.text;
    });

    alert(Array.prototype.join.call(y, "\n"));

});

//- vim:set syntax=javascript:
