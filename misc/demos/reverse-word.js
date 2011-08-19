//- JavaScript source code

//- reverse-word.js ~~
//
//  This is a mystical gem from the C language to reverse the bits in a word.
//  It works as-is in JavaScript, and although I have seldom found it necessary
//  to use the bitwise operators for their intended purpose, this seems like a
//  handy thing to have when the need does arise someday :-)
//
//                                                      ~~ (c) SRW, 18 Aug 2011

chassis(function(q) {
    "use strict";

 // Prerequisites (n/a)

 // Declarations

    var n, reverse, word, x, y, z;

 // Definitions

    reverse = function (n) {
        n = ((n >>  1) & 0x55555555) | ((n <<  1) & 0xaaaaaaaa);
        n = ((n >>  2) & 0x33333333) | ((n <<  2) & 0xcccccccc);
        n = ((n >>  4) & 0x0f0f0f0f) | ((n <<  4) & 0xf0f0f0f0);
        n = ((n >>  8) & 0x00ff00ff) | ((n <<  8) & 0xff00ff00);
        n = ((n >> 16) & 0x0000ffff) | ((n << 16) & 0xffff0000);
        return n;
    };

 // Invocations

    word = Math.pow(2, 31) - 1;

    x = word.toString(2);
    y = reverse(word).toString(2);
    z = reverse(reverse(word)).toString(2);

    n = Math.max(x.length, y.length, z.length);

    while (x.length < n) {
        x = " " + x;
    }

    while (y.length < n) {
        y = " " + y;
    }

    while (z.length < n) {
        z = " " + z;
    }

    q.puts(x, "-->", word);
    q.puts(y, "-->", reverse(word));
    q.puts(z, "-->", reverse(reverse(word)));

});

//- vim:set syntax=javascript:
