//- JavaScript source code

//- hello.js ~~
//
//  The obligatory first program in any language, shown here as a JavaScript
//  program that runs correctly in both the browser and the terminal :-)
//
//                                                      ~~ (c) SRW, 15 Aug 2011

var puts;

puts = function () {

    if (this.console) {

        puts = function () {
            console.log.apply(console, arguments);
        };

    } else {

        puts = (this.window) ? alert : print;

    }

    puts.apply(this, arguments);

};

puts("Hello world!");

//- vim:set syntax=javascript:
