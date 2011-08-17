/** web-chassis v0.1 ********* BEGIN SHELL SCRIPT ********* >/dev/null 2>&1; #*\

#-  web-chassis.js ~~
#
#   (LICENSE AND PREAMBLE GO HERE ...)
#
#                                                       ~~ (c) SRW, 16 Aug 2011

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
        'https://web-chassis.googlecode.com';
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
JS=$(available ${JS} js jsc d8 v8 node rhino ringo narwhal);
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
 *  NOTE: Web Chassis is undergoing renovations -- pardon our mess ;-)        *
 *                                                                            *
\******************************************************************************/

/*jslint indent: 4, maxlen: 80                                                */
/*global chassis: true, global: true, module: true, require: false            */

(function (global) {                    //- This strict anonymous closure can
    "use strict";                       //  still access the global object :-)

 // Constructors (these would get lifted to the top of the scope anyway ...)

    function TryAgainLater(message) {
        this.message = message || "Dying ...";
    }

    TryAgainLater.prototype = new Error();

 // Private declarations

    var a$ply, q, revive, stack;

 // Private definitions

    a$ply = function (x, f) {
        if (typeof Array.prototype.forEach === 'function') {
            a$ply = function (x, f) {
                Array.prototype.forEach.call(x, function (val, key) {
                    f(key, val);
                });
            };
        } else {
            a$ply = function (x, f) {
                var i, n;
                n = x.length;
                for (i = 0; i < n; i += 1) {
                    f(i, x[i]);
                }
            };
        }
        a$ply(x, f);
    };

    q = global.chassis = function chassis(f) {
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
                func.call(null, q, global);
            } catch (err) {
                if (err instanceof TryAgainLater) {
                    stack.push(func);
                } else {
                    q.puts(err);
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

    q.die = function (message) {
        throw new TryAgainLater(message);
    };

    q.flags = {
        debug:  false,
        digits: 5
    };

    q.include = function (libname) {    //- see also: http://goo.gl/2h4m
        var loaded = {};
        q.include = function (libname) {
            if (loaded[libname] === true) {
             // The module has already been loaded -- no work necessary :-)
                return;
            }
            var re = new RegExp("^" + libname + "\\$(.+)$");
            a$ply(Object.keys(q), function (key, val) {
                if (re.test(val) === true) {
                    q[val.match(re)[1]] = q[val];
                }
            });
            loaded[libname] = true;
        };
        q.include(libname);
    };

    q.lib = function (libname) {
        var available = true;
        if (q.hasOwnProperty(libname)) {
            switch (typeof q[libname]) {
            case "function":
             // Lazy-load it, then redefine it as null in an effort to avoid
             // re-running it later. Unfortunately, it may still run twice or
             // more under certain conditions because JS may or may not block
             // _all_ execution when 'revive' recurses.
                q[libname].call(null);
                Object.defineProperty(q, libname, {
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
                if (q[libname] !== null) {
                    throw new Error(libname + " is not a valid module.");
                }
            }
        } else {
         // It's missing, so we'll leave a setter to trigger a revival.
            Object.defineProperty(q, libname, {
                configurable: true,
                set: function (f) {
                    if (typeof f === 'function') {
                        Object.defineProperty(q, libname, {
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
                revive();
            };
            global.document.body.appendChild(script);
        };
        if (q.detects("console")) {
            q.puts = function () {
                global.console.log(Array.prototype.join.call(arguments, " "));
            };
        } else {
            q.puts = function () {
                var d, f, p;
                d = global.document;
                p = d.body.appendChild(d.createElement("pre"));
                p.innerHTML += Array.prototype.join.call(arguments, " ");
                d = p = null;
            };
        }
        break;
    case "webworker":
        q.argv = global.location.search.slice(1).split(",");
        q.load = function (uri) {
            global.importScripts(uri);
            revive();
        };
        q.puts = function () {
            global.postMessage(Array.prototype.join.call(arguments, " "));
        };
        break;
    case "dev-shell":
        q.load = function (uri) {
            global.load(uri);
            revive();
        };
        q.puts = function () {
            global.print(Array.prototype.join.call(arguments, " "));
        };
     // q.read = function (uri) { ... } //- comming soon ???
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
                revive();
            });
        };
        q.puts = function () {
            global.console.log(Array.prototype.join.call(arguments, " "));
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

    a$ply(q.argv, function (index, arg) {
        var flag, matches;
        flag = /^[\-]{0,2}([\w\.\-\/]+)[=]?([\w]*)$/;
        if (flag.test(arg)) {
            arg.replace(flag, function (matches, key, val) {
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

    a$ply(Object.keys(q.flags), function (key, val) {
        if ((/\.js$/).test(val) === true) {
            q.load(val);
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

}(function () {
 // JSLint gets upset that I'm not using ES5 strict mode here, but it's my best
 // solution currently. Node.js and RingoJS cause trouble; see "Notes.txt".
    return (typeof this.global === 'object') ? this.global : this;  // (JSLINT)
}.call(null)));

//- vim:set syntax=javascript:
