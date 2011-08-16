/** Chassis script ***************************************** >/dev/null 2>&1 #*\

#-  text-twist.js ~~
#
#   This program is an updated version of one I wrote on 29 Dec 2010. It finds
#   single-word anagrams from arbitrary character sets by using the built-in
#   UNIX dictionary as a reference. This program works exceedingly well with
#   Spidermonkey and D8 at the moment, and I hope to get Narwhal, Node.js,
#   Rhino, and Ringo working shortly. JavaScriptCore doesn't have a 'read'
#   command, which means its blazing speed is totally useless here. Also, the
#   V8 sample shell isn't especially helpful here because, if I am reading its
#   source code correctly, it doesn't actually accept command-line arguments
#   the way its "--help" printout says it does; I have hacked the invocation
#   from Chassis accordingly, haha.
#
#   NOTE: This is NOT hardcoded -- try your own arguments :-)
#
#                                                       ~~ (c) SRW, 15 Aug 2011

command -v chassis >/dev/null 2>&1;

if [ $? -eq 0 ]; then

    for each in d8 js v8; do
        command -v ${each} >/dev/null 2>&1;
        if [ $? -eq 0 ]; then
          # Although it seems pointless to grab the absolute path to
          # 'chassis' in the middle of the invocation, the korn shell
          # won't work correctly otherwise -- I'm not sure why yet.
            JS=${each} exec `command -v chassis` $0 ${*:-'a b e i l l'} ;
        fi
    done

    echo "No suitable JavaScript interpreter was located." >&2;

else

    echo "Chassis is not installed." >&2;

fi

exit 1; #**********************************************************************/

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base") || q.die();

 // Declarations

    var main, twist;

 // Definitions

    main = function (argv) {
        var dictionary, letters, re;
        re = /^[A-Za-z]+$/;
        letters = q.base$filter(argv).using(function (each) {
            return (re.test(each) === true);
        });
        if (letters.length > 0) {
         // Because I get in a hurry sometimes, I allow for some whitespace
         // mistakes to occur during entry -- after joining and splitting,
         // everything will be right as rain anyway :-)
            letters = letters.join('').split('');
         // This part unfortunately relies on a native 'read' command right
         // now, which is why I can't use just any old interpreter [yet] ...
            dictionary = read("/usr/share/dict/words");
         // Finally, compute the results and output them to stdout.
            q.puts("[" + letters + "]", "-->", twist(letters, dictionary));
        } else {
            throw new Error("No letters were given.");
        }
    };

    twist = function (letters, text) {
        var re, words;
        re = new RegExp('[' + letters.join('') + ']{' + letters.length + '}');
        words = (q.base$trim(text)).split('\n');
        return q.base$filter(words).using(function (word) {
            var str;
         // Are A and B the same dimension?
            if (word.length === letters.length) {
             // Is A contained in B?
                if (re.test(word) === true) {
                 // Start eliminating characters one at a time.
                    str = word;
                    q.base$ply(letters).by(function (key, val) {
                        str = str.replace(val, '');
                    });
                 // Was B contained in A?
                    return (str.length === 0);
                }
            }
        });
    };

 // Invocations

    main(q.argv);

});

//- vim:set syntax=javascript:
