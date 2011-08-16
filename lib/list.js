//- JavaScript source code

//- list.js ~~
//
//  This module contains methods for handling JavaScript Arrays as lists:
//
//      JS : Scheme :: new Array() : (list)
//
//  This isn't a hard concept to understand, but C/C++/Java programmers do get
//  a bit whiny about it sometimes. An associative array, to them, is just a
//  slow version of a "regular" array that doesn't support pointer arithmetic.
//  They're correct to raise those arguments, but I have been writing almost
//  all of my programs -- in different languages -- in terms of two "universal"
//  types for several years. JavaScript calls them Arrays and Objects, Ruby
//  calls them Arrays and Hashes, and Python calls them Lists and Dictionaries;
//  obviously, I'm not going to list analogs for every language I've used! The
//  real tricks to using JS arrays are to conceptualize them as lists, not as
//  associative arrays, and to avoid assigning values to non-numeric indices in
//  any situation where an Object could have been used. This module exists so
//  that useful methods for working with arrays can be provided generically
//  without messing with the global prototype definitions. It's new, okay? ;-)
//
//  NOTE: I need to be start being more careful about using "q.ply" only when
//  I can guarantee that sequentiality need not be guaranteed. Otherwise, I'm
//  going to start painting myself into a lot of corners when I actually write
//  the parallel definition eventually ...
//
//                                                          ~~ SRW, 26 Jun 2011

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base") || q.die();

    q.list = function () {

     // q.list$contains = q.base$generic();  //- would this be useful?

        q.list$diff  = q.base$generic();

        q.list$intersect = q.base$generic();

        q.list$union = q.base$generic();

        q.list$uniq  = q.base$generic();

        q.list$diff(Array, Array).def = function (x1, x2) {
            var y = [];
            q.base$ply(x1).by(function (i, xval) {
                var dupe = false;
                q.base$ply(x2).by(function (j, yval) {
                    if (xval === yval) {
                        dupe = true;
                    }
                });
                if (dupe === false) {
                    y.push(xval);
                }
            });
            return y;
        };

        q.list$intersect(Array, Array).def = function (x1, x2) {
            if (typeof Array.prototype.indexOf === 'function') {
                q.list$intersect(Array, Array).def = function (x1, x2) {
                    var a, b, y;
                    a = q.list$uniq(x1);
                    b = q.list$uniq(x2);
                    y = [];
                    q.base$ply(a).by(function (key, val) {
                        if (b.indexOf(val) !== -1) {
                            y.push(val);
                        }
                    });
                    return y;
                };
            } else {
                q.list$intersect(Array, Array).def = function (x1, x2) {
                    var a, b, y;
                    a = q.list$uniq(x1);
                    b = q.list$uniq(x2);
                    y = [];
                    q.base$ply(a).by(function (i, aval) {
                        q.base$ply(b).by(function (j, bval) {
                            if (aval === bval) {
                                y.push(aval);
                            }
                        });
                    });
                    return y;
                };
            }
            return (q.list$intersect(Array, Array).def)(x1, x2);
        };
        q.list$union(Array, Array).def = function (x1, x2) {
            return q.list$uniq(x1, x2);
        };

        q.list$uniq(Array).def = function (x) {
            if (typeof Array.prototype.indexOf === 'function') {
                q.list$uniq(Array).def = function (x) {
                    var y = [];
                    q.base$ply(x).by(function (key, xval) {
                        if (y.indexOf(xval) === -1) {
                            y.push(xval);
                        }
                    });
                    return y;
                };
            } else {
                q.list$uniq(Array).def = function (x) {
                    var y = [];
                    q.base$ply(x).by(function (key, xval) {
                        var dupe = false;
                        q.base$ply(y).by(function (key, yval) {
                            if (xval === yval) {
                                dupe = true;
                            }
                        });
                        if (dupe === false) {
                            y.push(xval);
                        }
                    });
                    return y;
                };
            }
            return (q.list$uniq(Array).def)(x);
        };

        q.list$uniq(Array, Array).def = function (x1, x2) {
         // Something weird happens here if you use Narwhal and this line:
         // return q.list$uniq(Array.prototype.concat(x1, x2));
            return q.list$uniq(x1.concat(x2));
        };

    };

});

//- vim:set syntax=javascript:
