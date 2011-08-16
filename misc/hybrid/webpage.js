/** Chassis script ***************************************** >/dev/null 2>&1 #*\

#-  webpage.js ~~
#
#   This is the planned successor to my "webpage.rb" script. The other one is
#   working just fine, but I think it would be much better for Chassis to be
#   able to generate the HTML5 it needs to run in the browser directly so that
#   I can bundle things without requiring the user to have Ruby installed.
#
#                                                       ~~ (c) SRW, 10 Aug 2011

command -v chassis >/dev/null 2>&1;

if [ $? -eq 0 ]; then
  # Although it seems pointless to grab the absolute path to 'chassis', I am
  # having trouble getting the Korn shell to cooperate otherwise ...
    CHASSIS=`command -v chassis`;
else
    echo 'Could not find "chassis".' >&2;
    exit 1;
fi

${CHASSIS} $0 $* > index.html;

if [ $? -eq 0 ]; then
    echo 'Created "index.html" successfully.';
    exit 0;
else
    echo 'Failed to create "index.html".' >&2;
    exit 1;
fi

#******************************************************************************/

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base") || q.die();

 // Declarations

 // Definitions

 // Invocations

    q.puts("<html><head></head><body>" + q.argv.join(" ") + "</body></html>");

});

//- vim:set syntax=javascript:
