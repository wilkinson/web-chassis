//- JavaScript source code

//- zhongwen.js ~~
//                                                      ~~ (c) SRW, 09 Aug 2011

chassis(function (q) {
    "use strict";

    q.lib("base") || q.die();

    var decoded, message;

    message = [20320, 22909, 21527, 63];
    decoded = q.base$map(message).using(String.fromCharCode);

    q.puts(decoded.join(""));

});

//- vim:set syntax=javascript:
