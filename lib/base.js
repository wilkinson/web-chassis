//- JavaScript source code

//- base.js ~~
//
//  This module implements a base library of higher-order functional patterns
//  by using the generic function templates defined in Web Chassis itself :-)
//
//                                                      ~~ (c) SRW, 15 Aug 2011

chassis(function (q) {
    "use strict";

 // Prerequisites (n/a)

 // Module definition

    q.base = function () {

        var Duck = q.duck(null).constructor;

        q.base$compose  = q.generic();
        q.base$filter   = q.generic();
        q.base$format   = q.generic();
        q.base$map      = q.generic();
        q.base$ply      = q.generic();
        q.base$reduce   = q.generic();
        q.base$seq      = q.generic();
        q.base$trim     = q.generic();
        q.base$zip      = q.generic();

        q.base$compose(Array).def = function (x) {
            return q.base$reduce(x).using(function (f, g) {
                return function () {
                    return f.call(this, g.apply(this, arguments));
                };
            });
        };

        q.base$filter(Array).def = function (x) {
            if (typeof Array.prototype.filter === 'function') {
                q.base$filter(Array).def = function (x) {
                    return {
                        using: function (f) {
                            var test;
                            if (f.constructor === RegExp) {
                                test = function (each) {
                                    return f.test(each);
                                };
                            } else {
                                test = f;
                            }
                            return Array.prototype.filter.call(x, test);
                        }
                    };
                };
            } else {
                q.base$filter(Array).def = function (x) {
                    return {
                        using: function (f) {
                            var test, y;
                            if (f.constructor === RegExp) {
                                test = function (each) {
                                    return f.test(each);
                                };
                            } else {
                                test = f;
                            }
                            y = [];
                            q.base$ply(x).by(function (key, val) {
                                if (test(val) === true) {
                                    y.push(val);
                                }
                            });
                            return y;
                        }
                    };
                };
            }
            return (q.base$filter(Array).def)(x);
        };

        q.base$filter(Duck).def = function (x) {
            if (x.isArrayLike()) {
                return (q.base$filter(Array).def)(x.raw);
            }
            if (x.isObjectLike()) {
                return {
                    using: function (f) {
                        var test, y;
                        if (f.constructor === RegExp) {
                            test = function (each) {
                                return f.test(each);
                            };
                        } else {
                            test = f;
                        }
                        y = Object.create(Object.getPrototypeOf(x.raw));
                        q.base$ply(x.raw).by(function (key, val) {
                            if (test(val) === true) {
                                y[key] = val;
                            }
                        });
                        return y;
                    }
                };
            } else {
                return {
                    using: function (f) {
                        if (f.constructor === RegExp) {
                            return f.test(x.raw.toString());
                        } else {
                            return f(x.raw);
                        }
                    }
                };
            }
        };

        q.base$format(Array).def = function (x) {
            return q.base$map(x).using(q.base$format).join(",");
        };

        q.base$format(Duck).def = function (x) {
            var temp, y;
            if (x.isObjectLike()) {
                temp = x.raw;
                y = [];
                q.base$ply(temp).by(function (key, val) {
                    y.push(key + ': "' + q.base$format(val) + '"');
                });
                return "{\n    " + y.join(",\n    ") + "\n}";
            } else {
                if (x.has("function", "toSource")) {
                    y = x.raw.toSource();
                } else {
                    y = x.raw.toString();
                }
                return y;
            }
        };

        q.base$format(Error).def = function (x) {
            return x.name + ": " + x.message;
        };
        q.base$format(EvalError).def        =   (q.base$format(Error).def);
        q.base$format(RangeError).def       =   (q.base$format(Error).def);
        q.base$format(ReferenceError).def   =   (q.base$format(Error).def);
        q.base$format(SyntaxError).def      =   (q.base$format(Error).def);
        q.base$format(TypeError).def        =   (q.base$format(Error).def);
        q.base$format(URIError).def         =   (q.base$format(Error).def);

        q.base$format(Number).def = function (x) {
         // See also: x.toExponential, x.toFixed, x.toString ...
            return x.toPrecision(q.flags.digits);
        };

        q.base$format(String).def = function (x) {
            return x;
        };

        q.base$map(Array).def = function (x) {
            if (typeof Array.prototype.map === 'function') {
                q.base$map(Array).def = function (x) {
                    return {
                        using: function (f) {
                            return Array.prototype.map.call(x, function (val) {
                                return f(val);
                            });
                        }
                    };
                };
            } else {
                q.base$map(Array).def = function (x) {
                    return {
                        using: function (f) {
                            var y = [];
                            q.base$ply(x).by(function (key, val) {
                                y[key] = f(val);
                            });
                            return y;
                        }
                    };
                };
            }
            return (q.base$map(Array).def)(x);
        };

        q.base$map(Duck).def = function (x) {
         // This is significantly harder than the reduce function because maps
         // should (in my opinion) return the same output type as input type.
         // Should I restrict ply-ish methods to Array-Like Objects? Hmm ...
            if (x.isArrayLike()) {
                return (q.base$map(Array).def)(x.raw);
            }
            if (x.isObjectLike()) {
                return {
                    using: function (f) {
                        var temp, y;
                        temp = x.raw;
                        y = Object.create(Object.getPrototypeOf(temp));
                        q.base$ply(temp).by(function (key, val) {
                            y[key] = f(val);
                        });
                        return y;
                    }
                };
            } else {
                return {
                    using: function (f) {
                        return f(x.raw);
                    }
                };
            }
        };

        q.base$ply(Array).def = function (x) {
            if (typeof Array.prototype.forEach === 'function') {
                q.base$ply(Array).def = function (x) {
                    return {
                        by: function (f) {
                            Array.prototype.forEach.call(x, function (v, k) {
                                f(k, v);
                            });
                        }
                    };
                };
            } else {
                q.base$ply(Array).def = function (x) {
                    return {
                        by: function (f) {
                            var i, n;
                            n = x.length;
                            for (i = 0; i < n; i += 1) {
                                f(i, x[i]);
                            }
                        }
                    };
                };
            }
            return (q.base$ply(Array).def)(x);
        };

        q.base$ply(Duck).def = function (x) {
            if (x.isArrayLike()) {
                return (q.base$ply(Array).def)(x.raw);
            }
            if (x.isObjectLike()) {
                return {
                    by: function (f) {
                        var key, temp;
                        temp = x.raw;
                        for (key in temp) {
                            if (temp.hasOwnProperty(key)) {
                                f(key, temp[key]);
                            }
                        }
                    }
                };
            } else {
                return {
                    by: function (f) {
                        f(undefined, x.raw);
                    }
                };
            }
        };

        q.base$reduce(Array).def = function (x) {
            if (typeof Array.prototype.reduce === 'function') {
                q.base$reduce(Array).def = function (x) {
                    return {
                        using: function (f) {
                            return Array.prototype.reduce.call(x, f);
                        }
                    };
                };
            } else {
                q.base$reduce(Array).def = (q.base$reduce(Duck).def)(duck(x));
            }
            return (q.base$reduce(Array).def)(x);
        };

        q.base$reduce(Duck).def = function (x) {
            return {
                using: function (f) {
                    var first, y;
                    first = true;
                    q.base$ply(x.raw).by(function (key, val) {
                        if (first) {
                            y = val;
                            first = false;
                        } else {
                            y = f(y, val);
                        }
                    });
                    return y;
                }
            };
        };

        q.base$seq(Duck).def = function (x) {
            return q.base$seq(0, x.toNumber(), 1);
        };

        q.base$seq(Duck, Duck).def = function (x1, x2) {
            return q.base$seq(x1.toNumber(), x2.toNumber(), 1);
        };

        q.base$seq(Duck, Duck, Duck).def = function (x1, x2, x3) {
            return q.base$seq(x1.toNumber(), x2.toNumber(), x3.toNumber());
        };

        q.base$seq(Number, Number, Number).def = function (x1, x2, x3) {
         // This works like Python's "range" and R's "seq(from, to, by)".
            var i, y;
            y = [];
            for (i = x1; i < x2; i += x3) {
                y[i] = i;
            }
            return y;
        };

        q.base$trim(String).def = function (x) {
            if (typeof String.prototype.trim === 'function') {
                q.base$trim(String).def = function (x) {
                    return String.prototype.trim.call(x);
                };
            } else {
                q.base$trim(String).def = function (x) {
                    return x.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
                };
            }
            return (q.base$trim(String).def)(x);
        };

        q.base$zip(Duck).def = function (x) {
            if (x.isArrayLike()) {
                return {
                    using: function (f) {
                        var n, seq;
                        n = q.base$reduce(x).using(function (a, b) {
                            return (a.length < b.length) ? a : b;
                        }).length;
                        seq = q.base$seq(0, n, 1);
                        return q.base$map(seq).using(function (j) {
                            var col;
                            col = q.base$map(x).using(function (row) {
                                return row[j];
                            });
                            return f.apply(this, col);
                        });
                    }
                };
            } else {
                throw new Error("q.base$zip is for array-like objects.");
            }
        };

    };
});

//- vim:set syntax=javascript:
