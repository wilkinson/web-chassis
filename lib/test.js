//- JavaScript source code

//- test.js ~~
//
//  This module contains higher-order functions for regression testing my other
//  modules. Some tests run in all environments, but some run only in the DOM;
//  the latter are particularly useful for concurrency-based tests :-)
//
//                                                      ~~ (c) SRW, 18 Aug 2011

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base");

 // Module definition

    q.test = function () {

        if (q.detects("window")) {

            q.test$killDiv = function (id) {
                var d = document.getElementById(id);
                d.style.color = "";
                d.style.textDecoration = "line-through";
                d = null;
            };

            q.test$makeDiv = function (id, message) {
                var d = document.createElement("div");
                d.id = id;
                d.innerHTML += message.toString();
                d.style.color = "red";
                document.body.appendChild(d);
                d = null;
            };

        }

        q.test$run = function (libname, list) {
            var lhs, rhs, passed, failed, results, summary;
            passed = 0;
            failed = 0;
            lhs = "[SUMMARY]" + " " + libname + " ";
            rhs = " ";
            q.base$ply(list).by(function (key, o) {
                results = o.func.apply(q, o.args);
                if (results.toString() === o.answer.toString()) {
                    passed += 1;
                } else {
                    q.puts("Test failed: '", libname + "$" + o.name, "'.");
                    q.puts("-->", results.toString());
                    failed += 1;
                }
            });
            if (failed === 0) {
                rhs += "All tests passed :-)";
            } else {
                rhs += failed + "/" + (passed + failed) + " failures.";
            }
            while ((lhs + rhs).length < 80) {
                lhs += ".";
            }
            q.puts(lhs + rhs);
        };

    };

});

//- vim:set syntax=javascript:
