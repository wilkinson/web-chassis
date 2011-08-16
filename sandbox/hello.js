//- JavaScript source code

//- hello.js ~~
//
//  This program demonstrates both out-of-order execution and the "namespace"
//  system employed by Chassis, but in the end, it's just "Hello world" ;-)
//
//  NOTE: I still haven't decided how to handle generic definitions for the
//  case when functions have zero arguments ...
//
//                                                          ~~ SRW, 25 Jul 2011

chassis(function (q) {
    "use strict";

    q.lib("base") || q.die();
    q.lib("demo") || q.die();

    q.include("demo");

    q.hello(42);
    q.hello("World");

});

chassis(function (q) {
    "use strict";

    q.lib("base") || q.die();

    q.demo = function () {

        var Duck = q.duck().constructor;

        q.demo$hello = q.generic();

        q.demo$hello(Duck).def = function (x) {
            q.puts("Hello, Duckling!");
        };

        q.demo$hello(String).def = function (x) {
            q.puts("Hello,", x + "!");
        };

    };

});

//- vim:set syntax=javascript:
