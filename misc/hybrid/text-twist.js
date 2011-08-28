/** Chassis script ***************************************** >/dev/null 2>&1 #*\

#-  text-twist.js ~~
#
#   This program is an updated version of one I wrote on 29 Dec 2010. It finds
#   single-word anagrams from arbitrary character sets by using the built-in
#   UNIX dictionary as a reference. This program works exceedingly well with
#   Spidermonkey and D8 at the moment, and I hope to get Narwhal, Node.js,
#   Rhino, and RingoJS working shortly. JavaScriptCore doesn't have a 'read'
#   command, which means its blazing speed is totally useless here. Also, the
#   V8 sample shell isn't especially helpful here because, if I am reading its
#   source code correctly, it doesn't actually accept command-line arguments
#   the way its "--help" printout says it does; I have hacked the invocation
#   from Chassis accordingly, haha. Also, because I get in a hurry sometimes,
#   I allow for (some) whitespace mistakes.
#
#   NOTE: This is NOT hardcoded -- try your own arguments :-)
#
#                                                       ~~ (c) SRW, 15 Aug 2011

command -v chassis >/dev/null 2>&1;

if [ $? -eq 0 ]; then

    for each in v8 d8 js; do
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

    q.lib("base");

 // Declarations

    var dictionary, letters, twist;

 // Definitions

    dictionary = read("/usr/share/dict/words");

    letters = q.base$filter(q.argv).using(function (each) {
        var re = /^[A-Za-z]+$/;
        return (re.test(each) === true);
    }).join("").split("");

    twist = function (dictionary, letters) {
        var re, words;
        re = new RegExp('[' + letters.join('') + ']{' + letters.length + '}');
        words = (q.base$trim(dictionary)).split('\n');
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

    if (letters.length === 0) {
        throw new Error("No letters were given.");
    }

    q.puts("[" + letters + "]", "-->", twist(dictionary, letters));

});

//- vim:set syntax=javascript:
