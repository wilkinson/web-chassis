//- JavaScript source code

//- strict-mode-test.js ~~
//                                                      ~~ (c) SRW, 14 Aug 2011

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base") || q.die();

 // Declarations

    var supported;

 // Definitions

    supported = (function () {
        "use strict";
        return (this === null);
    }.call(null));

 // Demonstrations and invocations

    if (supported === true) {
        q.puts("Strict mode is supported.");
    } else {
        q.puts("This interpreter does not support strict mode.");
    }

});

//- vim:set syntax=javascript:
