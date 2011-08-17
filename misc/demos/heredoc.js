//- JavaScript source code

//- heredoc.js ~~
//
//  JavaScript _does_ support multi-line string literals using backslash, but
//  I didn't know that because the built-in Vim syntax file on Snow Leopard
//  has a _lot_ of mistakes in it. I am writing a fresh one, I assure you ;-)
//
//  Anyway, this program demonstrates a simple "heredoc" function. Further
//  explanation is given alongside the code itself.
//
//                                                      ~~ (c) SRW, 16 Aug 2011

chassis(function (q) {
    "use strict";

 // Declarations

    var heredoc, missive;

 // Definitions

    heredoc = function (x) {

     // This function provides a "heredoc"-ish utility for JavaScript. For
     // those unfamiliar with a heredoc, it is a common convenience feature
     // in higher-level languages that enables in-place macro expansion for
     // multi-line strings. At least, that's my off-the-cuff definition ...
     // Anyway, this function doesn't provide expansions at the moment, but
     // it does attempt to reconstruct multi-line strings :-)

        var delim, re, trim;

     // First off, I will define a "trim" function because sometimes the
     // String prototype lacks that method, even though it _should_ have it.

        trim = function (x) {
         // This function uses basic conditional evaluation -- nothing fancy.
            if (typeof String.prototype.trim === 'function') {
                return String.prototype.trim.call(x);
            } else {
                return x.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
            }
        };

     // If the text begins with whitespace characters, we will assume each
     // line begins with the same indent, so that we can attempt to convert
     // the text to its original form.

        re = /^(\s+)/;
        if (re.test(x) === true) {
            delim = x.match(re)[1];
            return trim(x.split(delim).join('\n'));
        }

     // If it hasn't returned yet, it's because the text doesn't lead with
     // spaces. Instead, we will hunt for the first occurrence of two or more
     // whitespace characters and hope for the best. It works nicely for the
     // most part, and no inverse exists for consecutive newlines anyway :-P

        re = /(\s{2,})/;
        if (re.test(x) === true) {
            delim = x.match(re)[1];
            return trim(x.split(delim).join(delim + '\n'));
        }
    };                                  //- end of "heredoc" function

 // Demonstrations / Invocations

    missive = heredoc("\
        Dear Jonas,\
        \
        You are a crazy person.\
        \
        Your friend,\
        \
        \
        Sean\
    ");

    q.puts(missive);

});

//- vim:set syntax=javascript:
