//- JavaScript source code

//- es5-arguments.js ~~
//
//  This program demonstrates just one of the many subtle errors you _won't_
//  have to debug if you enable ES5 strict mode. I will try to write more of
//  these to share at our next lab meeting :-)
//
//                                                      ~~ (c) SRW, 16 Aug 2011

chassis(function (q) {
    "use strict";

 // Results are shown for ES5 strict mode   OFF vs. ON  .

    (function (x) {

        q.puts(x++, arguments[0]);      //> 1 2     1 1

    }(1));

    (function (x) {

        q.puts(++x, arguments[0]);      //> 2 2     2 1

    }(1));

    (function (x) {

        q.puts(x, arguments[0]++);      //> 1 1     1 1

    }(1));

    (function (x) {

        q.puts(x, ++arguments[0]);      //> 1 2     1 2

    }(1));

    (function (x) {

        q.puts(--x, ++arguments[0]);    //> 0 1     0 2

    }(1));

    (function (x) {

        q.puts(x++, --arguments[0]);    //> 1 1     1 0

    }(1));

});

//- vim:set syntax=javascript:
