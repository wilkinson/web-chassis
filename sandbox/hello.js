//- JavaScript source code

//- hello.js ~~
//
//  This program demonstrates both out-of-order execution and the "namespace"
//  system employed by Web Chassis, but in the end, it's just "Hello world" ;-)
//
//  NOTE: I still haven't decided how to handle generic definitions for the
//  case when functions have zero arguments ...
//
//                                                      ~~ (c) SRW, 18 Aug 2011

/*jslint indent: 4, maxlen: 80 */
/*global chassis: true */

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("demo");

 // Now, let's add some shortcuts from q.demo$foo --> q.foo :-)

    q.include("demo");

 // Invocations

    q.hello(42);
    q.hello("World");

});

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base");

 // Module definition

    q.demo = function () {

        var Duck = q.base$duck(null).constructor;

        q.demo$hello = q.base$generic();

        q.demo$hello(Duck).def = function (x) {
            q.puts("Hello, Duckling!");
        };

        q.demo$hello(String).def = function (x) {
            q.puts("Hello,", x + "!");
        };

    };

});

//- vim:set syntax=javascript:
