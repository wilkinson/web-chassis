//- JavaScript source code

//- math.js ~~
//
//  This module is an experiment in Duck-typed generic computation with JS :-)
//
//                                                          ~~ SRW, 08 Jul 2011

chassis(function (q) {
    "use strict";

    q.lib("base") || q.die();

    q.math = function () {

        var builtin, Duck;

        Duck = q.base$duck(null).constructor;

     // Native method wrappers

        builtin = {
            constants: [
                "E", "LOG2E", "LOG10E", "LN2", "LN10", "PI", "SQRT2", "SQRT1_2"
            ],
            f: [
                "random"
            ],
            fx: [
                "abs", "acos", "asin", "atan", "ceil", "cos", "exp", "floor",
                "log", "round", "sin", "sqrt", "tan"
            ],
            fxy: [
                "atan2", "pow"
            ],
            fdots: [
                "max", "min"
            ]
        };

     // First, we'll define some constants :-)

        q.base$ply(builtin.constants).by(function (key, val) {
            q["math$" + val.toLowerCase()] = Math[val];
        });

        q.base$ply(builtin.f).by(function (key, val) {
         // This is not finished yet ...
            q["math$" + val] = q.base$generic();
        });

        q.base$ply(builtin.fx).by(function (key, val) {
            var name = "math$" + val;
            q[name] = q.base$generic();
            q[name](Duck).def = function (x) {
                if (x.isArrayLike()) {
                    return q.base$map(x).using(q[name]);
                } else {
                    return (q[name](Number).def)(x.toNumber());
                }
            };
            q[name](Number).def = Math[val];
        });

        q.base$ply(builtin.fxy).by(function (key, val) {
            q["math$" + val] = q.base$generic();
        });

        q.base$ply(builtin.fdots).by(function (key, val) {
            q["math$" + val] = q.base$generic();
        });

     // Additional methods not found in the native Math object

        q.math$prod     =   q.base$generic();
        q.math$sum      =   q.base$generic();

        q.math$pow(Array, Array).def = function (x1, x2) {
            return q.base$zip([x1, x2]).using(function (a, b) {
                return q.math$pow(a, b);
            });
        };

        q.math$pow(Duck, Duck).def = function (x1, x2) {
            if (x1.isArrayLike() && x2.isArrayLike()) {
                return (q.math$pow(Array, Array).def)(x1.raw, x2.raw);
            } else {
                return q.base$map(x1).using(function (val1) {
                    return q.base$map(x2).using(function (val2) {
                        return q.math$pow(val1, val2);
                    });
                });
            }
        };

        q.math$pow(Number, Number).def = function (x1, x2) {
            return Math.pow(x1, x2);
        };

        q.math$prod(Duck).def = function (x) {
            return q.base$reduce(x).using(function (a, b) {
                return q.math$prod(a, b);
            });
        };

        q.math$prod(Array, Array).def = function (x1, x2) {
            return q.base$zip([x1, x2]).using(function (a, b) {
                return q.math$prod(a, b);
            });
        };

        q.math$prod(Duck, Duck).def = function (x1, x2) {
            if (x1.isArrayLike() && x2.isArrayLike()) {
                return (q.math$prod(Array, Array).def)(x1.raw, x2.raw);
            } else {
                return q.base$map(x1).using(function (val1) {
                    return q.base$map(x2).using(function (val2) {
                        return q.math$prod(val1, val2);
                    });
                });
            }
        };

        q.math$prod(Number, Number).def = function (x1, x2) {
            return x1 * x2;
        };

        q.math$sum(Duck).def = function (x) {
            return q.base$reduce(x).using(function (a, b) {
                return q.math$sum(a, b);
            });
        };

        q.math$sum(Array, Array).def = function (x1, x2) {
            return q.base$zip([x1, x2]).using(function (a, b) {
                return q.math$sum(a, b);
            });
        };

        q.math$sum(Duck, Duck).def = function (x1, x2) {
            if (x1.isArrayLike() && x2.isArrayLike()) {
                return (q.math$sum(Array, Array).def)(x1.raw, x2.raw);
            } else {
                return q.base$map(x1).using(function (val1) {
                    return q.base$map(x2).using(function (val2) {
                        return q.math$sum(val1, val2);
                    });
                });
            }
        };

        q.math$sum(Number, Number).def = function (x1, x2) {
            return x1 + x2;
        };

    };

});

//- vim:set syntax=javascript:
