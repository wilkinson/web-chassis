#-  POSIX shell script

#-  install.sh ~~
#
#   This interactive script copies the Web Chassis framework into a specified
#   directory as a standalone "executable". Although our goal as developers of
#   the Web Computer is to supplant installation entirely by the higher-level
#   abstraction of "disposable computing", this script does make things pretty
#   darn convenient for development on current systems ;-)
#
#                                                       ~~ (c) SRW, 14 Aug 2011

#-  First, we ensure as much POSIX adherence as possible.

if test -n "${ZSH_VERSION+set}" && (emulate sh) >/dev/null 2>&1; then
    emulate sh;
elif test -n "${BASH_VERSION+set}" && (set -o posix) >/dev/null 2>&1; then
    set -o posix;
fi

#-  Announce that we have entered the installer :-)

WCI_titlebar=' Web Chassis Installer ';
WCI_termcols=`tput cols`;

while [ `expr ${#WCI_titlebar} + 2` -lt ${WCI_termcols} ]; do
    WCI_titlebar="-${WCI_titlebar}-";
done

if [ ${#WCI_titlebar} -lt ${WCI_termcols} ]; then
    WCI_titlebar="${WCI_titlebar}-";
fi

printf '%s\n' "${WCI_titlebar}";

#-  We need to grab the path to "web-chassis.js" correctly, no matter what the
#   current directory is, because relative paths are easy to script with but
#   bad news for deployment -- never assume users will follow your directions!
#   We will assume, however, that this script is located in the project tree.

if [ "${0}" = "${0#\/}" ]; then
    WCI_scriptpath="`pwd`/$0";          #-  user ran this from a relative path
else
    WCI_scriptpath="$0";                #-  user ran this from an absolute path
fi

WCI_chassisjs="${WCI_scriptpath%\/*}/../bin/web-chassis.js"

#-  Now, we'll simply ask for input at the prompt and act accordingly. There's
#   no real reason for sophisticated privileges checks or failsafes, because
#   any user who runs this script will probably know enough about their system
#   to try again with 'sudo' or the appropriate permissions elevator. If they
#   already have 'chassis' installed on their PATH, though, I will assume that
#   they would like to replace the existing one, and I will use the existing
#   path as the default target destination :-)

command -v chassis >/dev/null 2>&1;
if [ $? -eq 0 ]; then
    WCI_jstarget="`command -v chassis`";
else
    WCI_jstarget="/usr/local/bin/chassis";
fi

printf '%s' "Target destination [${WCI_jstarget}]: ";
read RESPONSE;

cp -f "${WCI_chassisjs}" \
        "${RESPONSE:=${WCI_jstarget}}" >/dev/null 2>&1;

if [ $? -eq 0 ]; then
    chmod u+x "${RESPONSE}";
    if [ $? -eq 0 ]; then
        printf '\033[1;32m%s\n\033[1;0m' 'Installation succeeded.';
    else
        printf '\033[1;31m%s\n\033[1;0m' 'Installation failed.';
    fi
else
    printf '\033[1;31m%s\n\033[1;0m' 'Installation failed.';
fi

#-  Finally, we'll draw a nice bar again to help give us a sense of closure :-P

WCI_titlebar='';
while [ ${#WCI_titlebar} -lt ${WCI_termcols} ]; do
    WCI_titlebar="${WCI_titlebar}-";
done

printf '%s\n' "${WCI_titlebar}";

#-  vim:set syntax=sh:
