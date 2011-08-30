//- JavaScript source code

//- mc-pi.js ~~
//
//  This program computes a Monte Carlo approximation to pi by throwing darts
//  at a circular target inscribed in a unit square. The darts' coordinates are
//  uniformly distributed in the X and Y axes, which lets us assume that the
//  expected proportion that land within the circle is equal to the ratio of
//  the circle's area to the square's. An elementary geometric calculation then
//  shows us that this proportion is pi/4, so ... we multiply by 4 :-)
//
//                                                      ~~ (c) SRW, 26 Aug 2011

chassis(function (q) {
    "use strict";

 // Prerequisites (n/a)

 // Declarations

    var dart, simulate;

 // Definitions

    dart = function () {
        var dx, dy;
        dx = Math.random() - (1/2);
        dy = Math.random() - (1/2);
        return (Math.sqrt((dx * dx) + (dy * dy)) < (1/2)) ? 1 : 0;
    };

    simulate = function (n) {
        var inside, total;
        inside = 0;
        total = 0;
        while (total < n) {
         // By the way, did you notice that this is embarrassingly parallel?
            inside += dart();
            total += 1;
        }
        return 4 * inside / total;
    };

 // Demonstrations

    q.puts("\u03C0", "\u2248", simulate(1000));

});

//- vim:set syntax=javascript:
