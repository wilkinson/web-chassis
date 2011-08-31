//- JavaScript source code

//- new-native.js ~~
//
//  This program contains a rather depressing demonstration for why the usual
//  "toString" and Mozilla's "toSource" methods cannot be trusted to stringify
//  functions into an executable representation. I wrote this tonight while I
//  was hunting through the ES5 specification for an entirely different reason,
//  and it serves well, I believe, to highlight one of the fundamental problems
//  facing Quanah and distributed JavaScript in general. Of course, inspiration
//  struck and I now have a very novel solution planned for the second paper
//  on Quanah, but for the time being, this is a very depressing problem ...
//
//  NOTE: Passages taken from the January 2011 ES5 specification are included
//  at the bottom of this program.
//
//                                                      ~~ (c) SRW, 30 Aug 2011

/*jslint indent: 4, maxlen: 80 */
/*global chassis: true */

chassis(function (q) {
    "use strict";

 // Prerequisites

    if (typeof Function.prototype.bind !== 'function') {
        q.puts('The "bind" method is not available in this implementation.');
        return;
    }

 // Constructors

    function Lala() {}

 // Declarations

    var Lele, x;

 // Definitions

    Lele = Lala.bind();

    Lele.prototype = {};                //- F'bind objects lacks prototypes

    Lele.prototype.lili = "lolo";

    x = new Lele();

 // Demonstrations

    q.puts(Lele);

    if (typeof x.lili !== 'undefined') {
        q.puts(x.lili);                 //- but, nothing is going to print here
    }

    Lala.prototype.lili = "lulu";

    q.puts(x.lili);

});

//- [[Scope]] -- p.34
//
//  A lexical environment that defines the environment in which a Function
//  object is executed. Of the standard built-in ECMAScript objects, only
//  Function objects implement [[Scope]].

//- Function.prototype.bind -- p.119
//
//  NOTE Function objects created using Function.prototype.bind do not have a
//  prototype property or the [[Code]], [[FormalParameters]], and [[Scope]]
//  internal properties.

//- vim:set syntax=javascript:
