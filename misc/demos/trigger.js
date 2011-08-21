//- JavaScript source code

//- trigger.js ~~
//                                                      ~~ (c) SRW, 21 Aug 2011

chassis(function (q) {
    "use strict";

 // Prerequisites (n/a)

 // Declarations

    var defineProperty, trigger, x, y, z;

 // Definitions

    defineProperty = function (obj, name, parameters) {
        if (typeof Object.defineProperty === 'function') {
            defineProperty = Object.defineProperty;
        } else {
            defineProperty = function (obj, key, parameters) {
                var each;
                for (each in parameters) {
                    if (parameters.hasOwnProperty(each)) {
                        switch (each) {
                        case "get":
                            obj.__defineGetter__(key, parameters[each]);
                            break;
                        case "set":
                            obj.__defineSetter__(key, parameters[each]);
                            break;
                        case "value":
                            delete obj[key];
                            obj[key] = parameters[each];
                            break;
                        default:
                         // (placeholder)
                        }
                    }
                }
                return obj;
            };
        }
        return defineProperty(obj, name, parameters);
    };

    trigger = function (obj, name, f) {
        delete obj[name];
        return defineProperty(obj, name, {
            configurable: true,
            set: function (g) {
                f.call(this, arguments);
            }
        });
    };

 // Demonstrations

    x = {};
    y = 0;
    z = ["Four", "Cows", "Got", "Drunk", "At", "Ed's", "Bar"];

    trigger(x, "count", function () {
        y += 1;
        q.puts(y);
    });

    while (x.count = z.shift()) {}      //- this will print 1:8, one line each

});

//- vim:set syntax=javascript:
