//- JavaScript source code

//- octal-weirdness.js ~~
//                                                          ~~ SRW, 03 Aug 2011

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base") || q.die();

 // Declarations

    var temp, x;

 // Definitions

    temp = q.flags.digits;
    x = "09";

 // Temporary global parameter change for outputting numbers

    q.flags.digits = 1;

 // Demonstration

    q.puts(parseInt(x));                //> 0
    q.puts(parseFloat(x));              //> 9

 // Revert the global parameter to its previous state.

    q.flags.digits = temp;

});

//- vim:set syntax=javascript:
