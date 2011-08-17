//- JavaScript source code

//- macro.js ~~
//
//  This module will eventually provide macro expansion features, but it won't
//  be able to do that safely under strict mode without its own interpreter.
//  Here are some items I will be adding soon:
//
//  -   macros for basic scientific typesetting with Unicode symbols
//  -   standardized function serialization and/or stringification,
//
//                                                      ~~ (c) SRW, 17 Aug 2011

chassis(function (q) {
    "use strict";

    q.lib("base") || q.die();

    q.macro = function () {

        q.macro$heredoc = function (x) {

         // This function provides a "heredoc"-ish utility for JavaScript.
         // For those unfamiliar with a heredoc, it is a common convenience
         // feature in higher-level languages that enables in-place macro
         // expansion for multi-line strings. This doesn't provide expansions
         // at the moment, but it does [mostly] reconstruct multiline input.

            var delim, re;

         // If the text begins with whitespace characters, we assume each line
         // begins with the same indent so that we are "shifting to the left".

            re = /^(\s+)/;
            if (re.test(x) === true) {
                delim = x.match(re)[1];
                return q.base$trim(x.split(delim).join('\n'));
            }

         // If it hasn't returned yet, it's because the text doesn't lead with
         // spaces. Instead, we will hunt for the first occurrence of two or
         // more whitespace characters and hope for the best. It works nicely
         // considering that no inverse exists for consecutive newlines :-P

            re = /(\s{2,})/;
            if (re.test(x) === true) {
                delim = x.match(re)[1];
                return q.base$trim(x.split(delim).join(delim + '\n'));
            }
        };

    };

});

//- vim:set syntax=javascript:
