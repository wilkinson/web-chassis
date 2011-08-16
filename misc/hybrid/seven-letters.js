/** Chassis script ***************************************** >/dev/null 2>&1 #*\

#-  seven-letter.js ~~
#
#   This is a simple hybrid program to find and list all seven letter words
#   listed in the "traditional" Unix dictionary file. I have quoted the word
#   "traditional" because there is always a dictionary file there, but its
#   exact content is not standardized. I wrote this program on Snow Leopard,
#   and I have extended Chassis itself to allow server-side distributions to
#   read the file in as portable a manner as possible.
#
#                                                       ~~ (c) SRW, 08 Aug 2011

command -v chassis >/dev/null 2>&1;
if [ $? -eq 0 ]; then
    CHASSIS=`command -v chassis`;
else
    echo 'Could not find "chassis".' >&2;
    exit 1;
fi

for each in d8 js v8; do
    command -v ${each} >/dev/null 2>&1;
    if [ $? -eq 0 ]; then
      # Although it seems pointless to grab the absolute path to
      # 'chassis' in the middle of the invocation, the korn shell
      # won't work correctly otherwise -- I'm not sure why yet.
        JS=${each} ${CHASSIS} $0 /usr/share/dict/words > seven-letters.json;
        echo 'Created "seven-letters.json" successfully.';
        exit 0;
    fi
done

echo "No suitable JavaScript interpreter could be found." >&2;

exit 1; #**********************************************************************/

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base") || q.die();

    q.include("base");

 // Declarations

    var basename, files, words;

 // Definitions

    basename = function (pathname) {
        return pathname.split('/').pop();
    };

    files = q.filter(q.argv).using(function (each) {
        var temp = basename(each);
        return !(/.js$/).test(temp);
    });

    words = [];

 // Invocations

    q.ply(files).by(function (i, file) {
        var text = read(file).split("\n");
        q.ply(text).by(function (j, line) {
            if (line.length === 7) {
                words.push(line);       //- format is one word per line :-)
            }
        });
    });

    q.puts(JSON.stringify(words));

});

//- vim:set syntax=javascript: