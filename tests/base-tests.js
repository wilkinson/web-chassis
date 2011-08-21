//- JavaScript source code

//- base-tests.js ~~
//
//  This is a collection of regression tests for the Web Chassis framework.
//  Because Chassis allows us to run functions out of order, we actually get a
//  nice bonus: we can append tests to the end a huge collection of tests and
//  then just write with a scripting style. Moreover, because Chassis actually
//  embeds a shell script, and because everything is written in a conservative
//  subset of ES, the tests are as universal as Chassis itself :-)
//
//                                                      ~~ (c) SRW, 18 Aug 2011

/*jslint indent: 4, maxlen: 80 */
/*global chassis: true */

chassis(function (q) {
    "use strict";

 // Library test: base library

    q.lib("base");
    q.lib("test");

    var alo, aof, aon, aor, aos, fo, ro, se, sn, ss, u,
        composeTest, filterTest, genericTest, hasTypedPropertyTest,
        isArrayLikeTest, mapTest, plyTest, reduceTest, zipTest;

    alo = {0: 1, 1: 2, length: 2};

    aof = [
        function (x) {
            return x + 2;
        },
        function (x) {
            return x / 2;
        }
    ];

    aon = [3, 4, 5];

    aor = [(/ll/), (/o/)];

    aos = ["Hello", "world!"];

    fo = function () {};
    fo.a = 6;
    fo.b = 7;
    fo.c = 8;

    ro = {a: 9, b: 10, c: 11};

    se = new Error("I am a simple error.");
    sn = 12;
    ss = "Hello world!";

    composeTest = function (f, x) {
        return q.base$compose(f)(x);
    };

    filterTest = function (x, pred) {
     // I'm using JSON here because it is standardized across browsers ...
        return JSON.stringify(q.base$filter(x).using(pred));
    };

    genericTest = function () {
        var f, result;
        f = q.base$generic();
        try {
            f.apply(this, arguments).def = function () {
                return;
            };
        } catch (err) {
            result = err.message;
        }
        return result;
    };

    hasTypedPropertyTest = function (x, type, name) {
        return q.base$duck(x).has(type, name);
    };

    isArrayLikeTest = function (x) {
        return q.base$duck(x).isArrayLike();
    };

    mapTest = function (x) {
        var temp, y;
        temp = q.base$map(x).using(function (each) {
            return each + "!";
        });
        y = plyTest(temp);
        return y;
    };

    plyTest = function (x) {
        var y = "";
        q.base$ply(x).by(function (key, val) {
            y = val.toString() + y;     //- NOTE: This _reverses_ the order :-)
        });
        return y;
    };

    reduceTest = function (x) {
        return q.base$reduce(x).using(function (a, b) {
            return a + b;
        });
    };

    zipTest = function (x, y) {
        return q.base$zip([x, y]).using(function (a, b) {
            return a + b;
        });
    };

    q.test$run("base", [
        {
            args:   [aof, 2],
            answer: "3",
            func:   composeTest,
            name:   "compose: Array of Functions"
        },
        {
            args:   [[1, 2, 3], "function", "slice"],
            answer: "true",
            func:   hasTypedPropertyTest,
            name:   "duck -- Duck.has: slice method of Array"
        },
        {
            args:   [arguments, "number", "length"],
            answer: "true",
            func:   hasTypedPropertyTest,
            name:   "duck -- Duck.has: length property of arguments object"
        },
        {
            args:   [[]],
            answer: "true",
            func:   isArrayLikeTest,
            name:   "duck -- Duck.isArrayLike: empty Array"
        },
        {
            args:   [arguments],
            answer: "true",
            func:   isArrayLikeTest,
            name:   "duck -- Duck.isArrayLike: arguments object"
        },
        {
            args:   [[1, 2, 3]],
            answer: "true",
            func:   isArrayLikeTest,
            name:   "duck -- Duck.isArrayLike: Array of Numbers"
        },
        {
            args:   [5],
            answer: "false",
            func:   isArrayLikeTest,
            name:   "duck -- Duck.isArrayLike: single Number"
        },
        {
            args:   [null],
            answer: "false",
            func:   isArrayLikeTest,
            name:   "duck -- Duck.isArrayLike: null Object"
        },
        {
            args:   [function () {}],
            answer: "false",
            func:   isArrayLikeTest,
            name:   "duck -- Duck.isArrayLike: Function"
        },
        {
            args:   [function Bar() {}],
            answer: "Unregistered type",
            func:   genericTest,
            name:   "generic: detection of unregistered type (single argument)"
        },
        {
            args:   [function Foo() {}, function Bar() {}],
            answer: "Unregistered types",
            func:   genericTest,
            name:   "generic: detection of unregistered types (multiple)"
        },
        {
            args:   [[]],
            answer: "",
            func:   plyTest,
            name:   "ply: Empty Array"
        },
        {
            args:   [alo],
            answer: "21",
            func:   plyTest,
            name:   "ply: Array-Like Object"
        },
        {
            args:   [aon],
            answer: "543",
            func:   plyTest,
            name:   "ply: Array of Numbers"
        },
        {
            args:   [aos],
            answer: "world!Hello",
            func:   plyTest,
            name:   "ply: Array of Strings"
        },
        {
            args:   [fo],
            answer: "876",
            func:   plyTest,
            name:   "ply: Function Object"
        },
        {
            args:   [ro],
            answer: "11109",
            func:   plyTest,
            name:   "ply: regular Object"
        },
     // I'm not sure yet how I should test this part ...
     /*
        {
            args:   [se],
            answer: "I am a simple error.",
            func:   plyTest,
            name:   "ply: simple Error object"
        },
     */
        {
            args:   [sn],
            answer: "12",
            func:   plyTest,
            name:   "ply: single Number"
        },
        {
            args:   [ss],
            answer: "!dlrow olleH",
            func:   plyTest,
            name:   "ply: single String"
        },
     // ply(undefined) ???
     // FILTER TESTS
        {
            args:   [["Hello", "world"], /ll/],
            answer: '["Hello"]',
            func:   filterTest,
            name:   "filter: Array of Strings through a bare RegExp"
        },
        {
            args:   [ro, function (x) { return (x > 10); }],
            answer: '{"c":11}',
            func:   filterTest,
            name:   "filter: regular Object through a regular Function"
        },
     // MAP TESTS
        {
            args:   [alo],
            answer: "2!1!",
            func:   mapTest,
            name:   "map: Array-Like Object"
        },
        {
            args:   [aon],
            answer: "5!4!3!",
            func:   mapTest,
            name:   "map: Array of Numbers"
        },
        {
            args:   [aos],
            answer: "world!!Hello!",
            func:   mapTest,
            name:   "map: Array of Strings"
        },
        {
            args:   [fo],
            answer: "8!7!6!",
            func:   mapTest,
            name:   "map: Function Object"
        },
        {
            args:   [sn],
            answer: "!21",
            func:   mapTest,
            name:   "map: single Number"
        },
        {
            args:   [ss],
            answer: "!!d!l!r!o!w! !o!l!l!e!H!",
            func:   mapTest,
            name:   "map: single String"
        },
     // REDUCE TESTS
        {
            args:   [alo],
            answer: "3",
            func:   reduceTest,
            name:   "reduce: Array-Like Object"
        },
        {
            args:   [aon],
            answer: "12",
            func:   reduceTest,
            name:   "reduce: Array of Numbers"
        },
        {
            args:   [aos],
            answer: "Helloworld!",
            func:   reduceTest,
            name:   "reduce: Array of Strings"
        },
        {
            args:   [fo],
            answer: "21",
            func:   reduceTest,
            name:   "reduce: Function Object"
        },
        {
            args:   [ro],
            answer: "30",
            func:   reduceTest,
            name:   "reduce: regular Object"
        },
        {
            args:   [sn],
            answer: "12",
            func:   reduceTest,
            name:   "reduce: single Number"
        },
        {
            args:   [ss],
            answer: "Hello world!",
            func:   reduceTest,
            name:   "reduce: single String"
        },
        {
            args:   [[], []],
            answer: "",
            func:   zipTest,
            name:   "zip: two empty Arrays"
        },
        {
            args:   [aon, aon],
            answer: "6,8,10",
            func:   zipTest,
            name:   "zip: two Arrays of Numbers"
        },
        {
            args:   [aon, aos],
            answer: "3Hello,4world!",
            func:   zipTest,
            name:   "zip: Array of Numbers and Array of Strings"
        }
    ]);

});

chassis(function (q, global) {
    "use strict";

 // Library test: base library -- DOM-specific tests

    q.lib("base");
    q.lib("test");

    if (q.detects("window") === false) {
        return;
    }

    var divs, killDiv, makeDiv;

    killDiv = q.test$killDiv;
    makeDiv = q.test$makeDiv;

    makeDiv("base-dom-tests", "Running the DOM-based tests for 'base' ...");

 // Now, let's check q.base$ply's fallback function using a NodeList, which is
 // a DOM type I frequently encounter. We will create a div, retrieve it in
 // a NodeList, and then remove the div. If it's still visible after the
 // test has run, then we will know that the test has failed.

    makeDiv("nodelist-test", "Running NodeList test ...");
    divs = global.document.getElementsByTagNames("div");
    q.base$ply(divs).by(function (key, val) {
        if (val.id === "nodelist-test") {
            killDiv("nodelist-test");
        }
    });

 // Now, we'll load jQuery from Google's content delivery network :-)

    makeDiv("jquery-from-cdn", "Loading jQuery ...");
    q.load("https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.js");

    q(function (q) {

        q.lib("test");

        if (typeof global.jQuery !== 'function') {
            q.die();
        }

        q.test$killDiv("jquery-from-cdn");

    });

    killDiv("base-dom-tests");

});

//- vim:set syntax=javascript:
