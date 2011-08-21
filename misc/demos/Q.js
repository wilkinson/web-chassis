//- JavaScript source code

//- Q.js ~~
//
//  Because it is extremely bad practice to modify the global prototypes, the
//  program shown here is presented only for its academic appeal. The pattern
//  it provides is really pretty, though :-)
//
//  I usually use the letter "q" for the variable name, but you can use any
//  valid JS identifier your heart desires. For demonstration purposes, I have
//  used "chassis" below for all references to Web Chassis itself so it will
//  stringify nicely in the browser console my advisor will probably use :-P
//
//                                                      ~~ (c) SRW, 19 Aug 2011

chassis(function (chassis, global) {
    "use strict";

 // Definition

    Array.prototype.Q = function (f) {
        var that = this;
        chassis(function (chassis) {
            f.call(that, chassis, global);
        });
    };

 // Demonstration

    [1, 2, 3, 4, 5].Q(function (q) { q.puts(this); });

});

//- vim:set syntax=javascript:
