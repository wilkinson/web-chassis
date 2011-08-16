/** web-chassis v0.1 ********* BEGIN SHELL SCRIPT ********* >/dev/null 2>&1; #*\

#-  web-chassis.js ~~
#
#   (LICENSE AND PREAMBLE GO HERE ...)
#
#                                                       ~~ (c) SRW, 09 Aug 2011

if test -n "${ZSH_VERSION+set}" && (emulate sh) >/dev/null 2>&1; then
    emulate sh;
elif test -n "${BASH_VERSION+set}" && (set -o posix) >/dev/null 2>&1; then
    set -o posix;
fi

alert() {
  # This shell function outputs red text to stderr using ANSI C-strings.
    printf '\033[1;31mERROR: %s\033[1;0m\n' "$*" >&2;
}

available() {
  # This shell function accepts a variable number of program names and prints
  # the absolute path to the first one available by watching for a successful
  # exit code. Looping isn't ideal, but it behaves consistently across shells.
    for each in $@; do
        command -v ${each} >/dev/null 2>&1;
        if [ $? -eq 0 ]; then
            command -v ${each};
            break;
        fi
    done
    return $?;
}

usage() {
  # This shell function prints a subset of the full documentation and exits.
    printf '%s\n\n' "Usage: [SHELL] $0 [OPTION]... [FILE]...";
    printf '%s\n\n' "Options:
    -h, --help                          print this message and exit
    -v, --version                       print version number and exit
    -*, --*                             all other options pass directly to JS";
    printf '%s %s.\n' 'Full documentation is available online at' \
        'http://web-chassis.googlecode.com';
    exit $1;
}

version() {
  # This shell function prints the version number and exits. 
    printf '%s\n' 'v0.1-pre';
    exit $1;
}

while getopts ":-:hv" option; do
    case "${option}" in
        h)
            usage 0;
            ;;
        v)
            version 0;
            ;;
        *)
          # This is a hack so I can fake support for "long options" even
          # though 'getopts' doesn't support them. It deliberately omits
          # a catch for unknown flags; those will pass directly to JS :-)
            [ ${OPTARG} = help ] && usage 0;
            [ ${OPTARG} = version ] && version 0;
            ;;
    esac
done

ENVJS=${JS};
JS=$(available ${JS} jsc js d8 v8 node rhino ringo narwhal);
SHORTJS="${JS##*\/}";
Q=$0;
ARGV="$*";

if [ -n "${ENVJS}" ] && [ -n "${JS}" ]; then
    if [ "${ENVJS}" != "${JS}" ] && [ "${ENVJS}" != "${SHORTJS}" ]; then
        alert "Could not find '${ENVJS}'; using '${SHORTJS}' instead ...";
    fi
fi

case ${SHORTJS:=:} in
  # Explicit rules to enable features that should have been on by default ...
    d8)                                 #-  Google V8 debugging shell
        exec ${JS} --strict_mode ${Q} -- ${Q} ${ARGV};
        ;;
    js)                                 #-  Mozilla SpiderMonkey 1.8.5+
        exec ${JS} -U ${Q} ${ARGV};     #   --> "-m -j" enables JIT compilers
        ;;
    jsc)                                #-  JavaScriptCore developer shell
        exec ${JS} ${Q} -- ${Q} ${ARGV};
        ;;
    node)                               #-  Node.js
        exec ${JS} ${Q} ${ARGV} --v8-options --strict_mode;
        ;;
    rhino)                              #-  Mozilla Rhino 1.7 release 3 2011
        exec ${JS} -encoding utf8 ${Q} ${Q} ${ARGV};
        ;;
    v8)                                 #-  Google V8 sample shell
        exec ${JS} --strict_mode -e "scriptArgs = ('${ARGV}'.split(' '))" ${Q};
        ;;
  # Last resort rules
    :)                                  #-  No [known] ${JS} available
        alert 'No known JS engine found on ${PATH}.';
        JS="`printf '%q%q' \
            '/System/Library/Frameworks/JavaScriptCore.framework' \
            '/Versions/Current/Resources/jsc'`";
        if [ `available ${JS}` ]; then
            alert "Using ${JS} ..." && exec ${JS} ${Q} -- ${Q} ${ARGV};
        fi
        alert 'No JS engine found.' && exit 1;
        ;;
    *)                                  #-  No explicit rule for ${JS}
        exec ${JS} ${Q} ${ARGV};
        ;;
esac

#****************************** END SHELL SCRIPT ******************************/
/****************************** BEGIN JAVASCRIPT ******************************\
 *                                                                            *
 *  The Web Chassis currently contains three main sections, each of which is  *
 *  labeled according to its run-time execution order rather than by order of *
 *  appearance in this file. It bootstraps itself by reusing as many of its   *
 *  features as possible to demonstrate both its usage and its usefulness :-) *
 *                                                                            *
\******************************************************************************/

/*jslint indent: 4, maxlen: 80                                                */
/*global chassis: true, global: true, module: true, require: false            */

/******************************************************************************\
 *                                                                            *
 *  (1) Definition of an event loop for altering program execution order      *
 *                                                                            *
\******************************************************************************/

(function (global) {                    //- This strict anonymous closure can
    "use strict";                       //  still access the global object :-)

 // Constructors (these would get lifted to the top of the scope anyway ...)

    function TryAgainLater(message) {
        this.message = message || "Dying ...";
    }
    TryAgainLater.prototype = new Error();

 // Private declarations

    var chassis, revive, stack;

 // Private definitions

    chassis = global.chassis = function chassis(f) {
        if (typeof f === 'function') {
            stack.unshift(f);
            revive();
        } else {
            throw new Error("Web Chassis expects functions as arguments.");
        }
    };

    revive = function () {
        var counter, func, n;
        counter = 0;
        n = stack.length;
        while ((func = stack.shift()) !== undefined) {
            try {
                func.call(null, chassis, global);
            } catch (err) {
                if (err instanceof TryAgainLater) {
                    stack.push(func);
                } else {
                    chassis.puts(err);
                }
            }
            if (counter === n) {
                break;
            }
            counter += 1;
        }
    };

    stack = [];

 // Because JS functions are also objects, we can use Chassis itself as an
 // object in which we may store related properties, methods, and data :-)

    chassis.die = function (message) {
        throw new TryAgainLater(message);
    };

    chassis.flags = {
        debug:  false,
        digits: 5
    };

    chassis.include = function (libname) {    //- see also: http://goo.gl/2h4m
        var loaded = {};
        chassis.include = function (libname) {
            var i, keys, n, re, temp;
            if (loaded[libname] === true) {
             // The module has already been loaded -- no work necessary :-)
                return;
            }
            keys = Object.keys(chassis);
            n = keys.length;
            re = new RegExp("^" + libname + "\\$(.+)$");    //- fix this later
            for (i = 0; i < n; i += 1) {
                temp = keys[i];
                if (re.test(temp)) {
                    chassis[temp.match(re)[1]] = chassis[temp];
                } 
            }
            loaded[libname] = true;
        };
        chassis.include(libname);
    };

    chassis.lib = function (libname) {
        var available = true;
        if (chassis.hasOwnProperty(libname)) {
            switch (typeof chassis[libname]) {
            case "function":
             // Lazy-load it, then redefine it as null in an effort to avoid
             // re-running it later. Unfortunately, it may still run twice or
             // more under certain conditions because JS may or may not block
             // _all_ execution when 'revive' recurses.
                chassis[libname].call(null);
                Object.defineProperty(chassis, libname, {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: null
                });
                break;
            case "undefined":
                available = false;
                break;
            default:
             // Otherwise, it has already been loaded; we'll check to be sure.
                if (chassis[libname] !== null) {
                    throw new Error(libname + " is not a valid module.");
                }
            }
        } else {
         // It's missing, so we'll leave a setter to trigger a revival.
            Object.defineProperty(chassis, libname, {
                configurable: true,
                set: function (f) {
                    if (typeof f === 'function') {
                        Object.defineProperty(chassis, libname, {
                            configurable: true,
                            enumerable: true,
                            writable: true,
                            value: f
                        });
                        revive();
                    } else {
                        throw new Error("Modules must be functions.");
                    }
                }
            });
            available = false;
        }
        return available;
    };

    chassis.puts = function (err) {
     // This is a placeholder until we define the "real" function in Part III.
     // We need this to keep the JS interpreters from freaking out, but we can
     // simplify by noticing that until then, this function only runs after a
     // caught error -- an easy way to output that is just to throw it :-P
        throw err;
    };

}(function () {
 // JSLint gets upset that I'm not using ES5 strict mode here, but it's my best
 // solution currently. Node.js and RingoJS cause trouble; see "Notes.txt".
    return (typeof this.global === 'object') ? this.global : this;  // (JSLINT)
}.call(null)));

/******************************************************************************\
 *                                                                            *
 *  (3) Platform-specific configurations, definitions, and interactions       *
 *                                                                            *
\******************************************************************************/

chassis(function (q, global) {
    "use strict";

 // Prerequisites

    q.lib("base") || q.die();           //- (JSLINT hates this, but ... meh ;-)

    q.include("base");

 // Declarations

    var fmt;

 // Definitions

    fmt = function () {
        var temp = q.map(arguments).using(q.format);
        return Array.prototype.join.call(temp, " ");
    };

    q.detects = function (property) {
     // This is a memoized lazy-loading function for feature detection :-)
        var cache = {};
        q.detects = function (property) {
            if (cache.hasOwnProperty(property) === false) {
                cache[property] = (global[property]) ? true : false;
            }
            return cache[property];
        };
     // Some special values ...
        q.detects.module = (typeof module === 'object');
        return q.detects(property);
    };

    q.platform = (function () {
     // This anonymous closure can probably be removed later ...
        if (q.detects("location")) {
            return (q.detects("window")) ? "browser" : "webworker";
        }
        if (q.detects("process")) {
            return "nodejs";
        }
        if (q.detects("load") && q.detects("print")) {
            return "dev-shell";
        }
        throw new Error("Platform detection failed.");
    }());

    switch (q.platform) {
    case "browser":
        global.window.onunload = function () {
            delete global.chassis;
        };
        q.argv = global.location.search.slice(1).split(",");
        q.load = function (uri) {
            var script = global.document.createElement("script");
            script.src = uri;
            script.onload = function () {
                global.chassis(function () {});
            };
            global.document.body.appendChild(script);
        };
        if (q.detects("console")) {
            q.puts = function () {
                global.console.log(fmt.apply(this, arguments));
            };
        } else {
            q.puts = function () {
                var d, f;
                d = global.document;
                f = q.compose([d.body.appendChild, d.createElement]);
                f("pre").innerHTML += fmt.apply(this, arguments);
                d = null;
            };
        }
        break;
    case "webworker":
        q.argv = global.location.search.slice(1).split(",");
        q.load = function (uri) {
            global.importScripts(uri);
            global.chassis(function () {});
        };
        q.puts = function () {
            global.postMessage(fmt.apply(this, arguments));
        };
        break;
    case "dev-shell":
        q.load = function (uri) {
            global.load(uri);
            global.chassis(function () {});
        };
        q.puts = function () {
            global.print(fmt.apply(this, arguments));
        };
     // q.read = function (uri) { ... } //- comming soon ...
        if (q.detects("scriptArgs")) {
            q.argv = global.scriptArgs;
            break;
        }
        if (q.detects("arguments")) {
            q.argv = Array.prototype.slice.call(global["arguments"], 1);
        } else {
            q.argv = [];
        }
        break;
    case "nodejs":
        global.fs = require("fs");
        global.vm = require("vm");
        q.argv = global.process.argv.slice(2);
        q.load = function (uri) {
            global.fs.readFile(uri, "utf8", function (err, data) {
                if (err) {
                    throw err;
                }
                global.vm.createScript(data, uri).runInThisContext();
                global.chassis(function () {});
            });
        };
        q.puts = function () {
            global.console.log(fmt.apply(this, arguments));
        };
        break;
    default:
        throw new Error("Platform configuration failed.");
    }

 // To parse arguments consistently, I am using the following conventions:
 //
 // -   arguments look like "[-]*key=value"
 // -   keys are made of typical filesystem characters  (A-Za-z_./0-9).
 // -   values are made of valid "word" characters      (A-Za-z_).
 // -   keys without values map to "key=true".
 //
 // For "special" characters, pass the URL to a JSON file or something ;-)

    q.ply(q.argv).by(function (key, val) {
        var flag, matches;
        flag = /^[\-]{0,2}([\w\.\-\/]+)[=]?([\w]*)$/;
        if (flag.test(val)) {
            val.replace(flag, function (matches, key, val) {
                if ((val === "true") || (val === "false")) {
                 // This is an explicit "coercion" from String to Boolean.
                    q.flags[key] = (val === "true") ? true : false;
                } else {
                    q.flags[key] = val || true;
                }
            });
        }
    });

 // We may only load external scripts after processing _all_ input arguments!

    q.ply(q.flags).by(function (key, val) {
        if ((/\.js$/).test(key)) {
            q.load(key);
        }
    });

 // Finally, we'll add the ability to load Chassis as a CommonJS module. It's
 // challenging to detect CommonJS within the confines of ES5 strict mode due
 // to scope chain oddities and other surprises, but we'll try, okay? ;-)

    if (typeof module === 'object') {
        module.exports.init = function () {
         // Usage: var q = require("./bin/chassis.js").init();
            return q;
        };
    }

});

/******************************************************************************\
 *                                                                            *
 *  (2) Generic programming tools for supplanting "plain" duck typing         *
 *                                                                            *
\******************************************************************************/

chassis(function (q) {
    "use strict";

    q.base = function () {

     // Constructors

        function Duck(x) {
         // I need to make things more Smalltalk-ish so that custom types may
         // set properties explicitly in order to achieve certain behaviors.
            this.raw = x;
        }

        Duck.prototype.isArrayLike = function () {
            var raw = this.raw;
            switch (typeof raw) {
            case "string":
                return true;            //- need to revisit this later!
            case "object":
                return ((raw !== null) && (raw.hasOwnProperty("length")));
            default:
                return false;
            }
        };

        Duck.prototype.has = function (type, name) {
            return ((this.raw !== null)                 &&
                    (typeof this.raw !== 'undefined')   &&
                    (typeof this.raw[name] === type)
            );
        };

        Duck.prototype.isObjectLike = function () {
            return (this.raw instanceof Object);
        };

        Duck.prototype.toNumber = function () {
            return parseFloat(this.raw);
        };

     // Private declarations

        var duck, generic, guts, index_of, key_gen, known_types;

        duck = function (x) {
            return new Duck(x);
        };

        generic = function base$generic() {
            var f;
            f = function self() {
                return guts.apply(self, arguments);
            };
            f.constructor = base$generic;
            f.def = {};
            return f;
        };

        generic.registerType = function (x) {
            if (index_of(x).special === false) {
                known_types.push(x);
            }
        };

        guts = function () {
         // This is the "fake prototype" for all generic functions. Yes, I do
         // force you to use nine named arguments or less. Fork it ;-)
         // NOTE: Generic functions cannot currently be defined for functions
         // that expect zero input arguments. I will deal with this soon.
            var args, def, i, key, n, temp;
            args = Array.prototype.slice.call(arguments, 0, 9);
            key  = key_gen(args);
            n    = args.length;
            def  = this.def;
            if (key.special === true) {
                return Object.defineProperty({}, "def", {
                    configurable: false,
                    enumerable:   false,
                    get: function () {
                        return def[key.index];
                    },
                    set: function (g) {
                        def[key.index] = g;
                    }
                });
            }
            if (typeof def[key.index] === 'function') {
                return def[key.index].apply(this, args);
            }
         // Try converting the arguments to Duck types ...
            temp = [];
            for (i = 0; i < n; i += 1) {
                temp[i] = duck(args[i]);
            }
            key = key_gen(temp);
            if (typeof def[key.index] === 'function') {
                return def[key.index].apply(this, temp);
            }
         // We're not ever supposed to fall this far, but if we do, we'll try
         // to offer some helpful debugging advice. (This may be removed ...)
            temp = [];
            while (temp.length < n) {
                temp.push(Function);
            }
            if (key_gen(temp).index === key_gen(args).index) {
                throw new Error("Unregistered type" + ((n > 1) ? "s" : ""));
            } else {
                throw new Error("No definition found (" + this + ").");
            }
        };

        if (typeof Array.prototype.indexOf === 'function') {
            index_of = function (x) {
                var i, types;
                types = known_types;
                i = types.indexOf(x);
                return {
                    special:    (i !== -1),
                    index:      (i !== -1) ? i : types.indexOf(x.constructor)
                };
            };
        } else {
            index_of = function (x) {
                var done, i, index, types;
                done = false;
                types = known_types;
                for (i = 0; (done === false) && (i < types.length); i += 1) {
                    if (x === types[i]) {
                        done = true;
                        index = i;
                    }
                }
                return {
                    special:    done,
                    index:      (done) ? index : index_of(x.constructor).index
                };
            };
        }

        key_gen = function (x) {
            var i, n, special, temp, y;
            n = x.length;
            special = true;
            y = [];
            for (i = 0; i < n; i += 1) {
                temp = index_of(x[i]);
                y[i] = temp.index;
                if (special) {
                    special = temp.special;
                }
            }
            return {
                special:    special,
                index:      y.join("-")
            };
        };

        known_types = [
         // These are listed in the order shown in the ES5 standard (Jan 2011,
         // pp.110-111) under Section 15.1.4; performance is irrelevant here.
            Object, Function, Array, String, Boolean, Number, Date,
            RegExp, Error, EvalError, RangeError, ReferenceError, SyntaxError,
            TypeError, URIError,
         // This is a type I have defined in this closure itself, and ...
            Duck,
         // ... these are some "types" whose behavior isn't well-defined yet.
            null, undefined
        ];

     // Now, let's create the 'base' module, following a naming convention
     // such that property "foo" --> "q.base$foo" :-)

        q.base$duck     = duck;
        q.base$generic  = generic;

        q.base$compose  = generic();
        q.base$filter   = generic();
        q.base$format   = generic();
        q.base$map      = generic();
        q.base$ply      = generic();
        q.base$reduce   = generic();
        q.base$seq      = generic();
        q.base$trim     = generic();
        q.base$zip      = generic();

     // Now, we'll define the module's methods via generic polymorphism :-)

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

    };                                  //- end of q.base module definition
});                                     //- end of part II :-)

//- vim:set syntax=javascript:
