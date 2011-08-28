/** Chassis script ***************************************** >/dev/null 2>&1 #*\

#-  fortune2json.js ~~
#
#   This is a simple program that converts the [non-offensive] fortune database
#   into a JSON object I can inline into JavaScript. I wrote and tested this on
#   Snow Leopard with Spidermonkey, having installed 'fortune' via HomeBrew :-)
#
#                                                       ~~ (c) SRW, 03 Aug 2011

for each in brew chassis fortune; do
    command -v ${each} >/dev/null 2>&1;
    if [ $? -ne 0 ]; then
        echo "Could not find '${each}'." >&2;
        exit 1;
    fi
done

FORTUNE_DBS="`brew --cellar`/fortune/9708/share/games/fortunes/*";

for each in d8 js; do
    command -v ${each} >/dev/null 2>&1;
    if [ $? -eq 0 ]; then
      # Although it seems pointless to grab the absolute path to 'chassis' in
      # the middle of the invocation, the korn shell won't work correctly ...
        JS=${each} `command -v chassis` $0 "${FORTUNE_DBS}" > fortunes.json;
        echo 'Created "fortunes.json" succesfully.';
        exit 0;
    fi
done

echo "No suitable JavaScript interpreter could be found." >&2;

exit 1; #**********************************************************************/

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base");

 // Declarations

    var basename, files, text;

 // Definitions

    basename = function (pathname) {
        return pathname.split('/').pop();
    };

    files = q.base$filter(q.argv).using(function (each) {
        var temp = basename(each);
        return (!(/.(dat|js)$/).test(temp) && (temp !== "off"));
    });

    text = q.base$map(files).using(function (each) {
     // This is the troublesome part, because I haven't written a portable
     // "read" analog yet; this does work in Spidermonkey and D8, though.
        return read(each).split("\n%\n");
    });

 // Invocations

    q.puts(JSON.stringify(Array.prototype.concat.apply([], text)));

});

//- vim:set syntax=javascript:
