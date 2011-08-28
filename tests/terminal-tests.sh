#-  POSIX shell script

#-  terminal-tests.sh ~~
#                                                       ~~ (c) SRW, 27 Aug 2011

main() {

    ARGV="$*";
    CHASSIS="bin/web-chassis.js";
    COMMONJSTESTS="${TMPDIR}/commonjs-module-test.js";
    JSTESTS="sandbox/*.js tests/*.js";

    KNOWN_COMMONJS="narwhal node ringo";
    KNOWN_INTERPRETERS="${KNOWN_COMMONJS} d8 js jsc rhino v8";
    KNOWN_SHELLS="bash dash ksh sh zsh";

    COMMONJS="";
    INTERPRETERS="";
    SHELLS="";

    COMMONJSTESTS="${TMPDIR}/commonjs-module-test.js";
    JSOUTPUT="${TMPDIR}/jsoutput.txt";
    STANDARD="${TMPDIR}/standard.txt";

    alert() {
        printf "\033[1;31m--> %s\033[1;0m\n" "$*" >&2;
        return $?;
    }

    cleanup() {
        rm -f "${COMMONJSTESTS}" "${JSOUTPUT}" "${STANDARD}";
        return $?;
    }

    gauntlet() {
        BADNESS="false";
        rm -f ${JSOUTPUT} ${STANDARD};
        for sh in ${SHELLS}; do
            for js in ${INTERPRETERS}; do
                INVOCATION="JS=${js} SHELL=${sh} ${sh} ${CHASSIS} ${ARGV} $*";
                progress "${INVOCATION}";
                eval "${INVOCATION}" >${JSOUTPUT} 2>&1;
                if [ $? -ne 0 ]; then
                    alert "X (failed execution)";
                    cleanup;
                    exit 1;
                fi
                if [ ! -f ${STANDARD} ]; then
                    sort ${JSOUTPUT} > ${STANDARD};
                fi
                if [ "`sort ${JSOUTPUT}`" != "`cat ${STANDARD}`" ]; then
                    alert "X (different output)";
                    cleanup;
                    exit 1;
                fi
                okay;
            done
        done
        rm -f ${JSOUTPUT} ${STANDARD};
        return 0;
    }

    get_all_paths_to() {
        for each in `printf '%s\n' $* | sort -u`; do
            command -v ${each} >/dev/null 2>&1;
            if [ $? -eq 0 ]; then
                which -a ${each};
            fi
        done
        return $?;
    }

    hilite() {
        printf "\033[1;36m--> %s\033[1;0m\n" "$*";
        return $?;
    }

    okay() {
        printf "\033[1;32m%s\033[1;0m\n\n" "OK";
        return $?;
    }

    progress() {
        printf "\033[1;30m%s \033[1;0m" '-->' $* '...';
        return $?;
    }

  # Now, we will create a simple script to test Web Chassis's ability to load
  # as a CommonJS module. I will try to write this as a "regular" test soon ...

    printf "%s\n" "

        var q = require('${PWD}/${CHASSIS}').init();
        q.puts('Hello world!');

    " >${COMMONJSTESTS} 2>&1;

  # Now, compute absolute paths to all instances of given program names after
  # first alphabetizing their unique entries.

    COMMONJS="`get_all_paths_to ${KNOWN_COMMONJS}`";
    INTERPRETERS="`get_all_paths_to ${KNOWN_INTERPRETERS}`";
    SHELLS="`get_all_paths_to ${KNOWN_SHELLS}`";

  # Run the tests using the "gauntlet" function as the main body each time.
  # Each line runs all the given JavaScript interpreters against all known
  # shells and feeds in the command-line arguments shown on the right. Since
  # Web Chassis is designed to relax sequentiality requirments, it is possible
  # that the output won't match from interpreter to interpreter. Thus, we sort
  # the output (inside "gauntlet") before comparison. If the output from a run
  # deviates from the norm, the entire program will exit with an error message.

    INTERPRETERS="${INTERPRETERS}"  gauntlet -h;
    INTERPRETERS="${INTERPRETERS}"  gauntlet --help;
    INTERPRETERS="${INTERPRETERS}"  gauntlet -v;
    INTERPRETERS="${INTERPRETERS}"  gauntlet --version;
    INTERPRETERS="${INTERPRETERS}"  gauntlet ${JSLIBS} ${JSTESTS};
    INTERPRETERS="${INTERPRETERS}"  gauntlet ${JSTESTS} ${JSLIBS};
    INTERPRETERS="${COMMONJS}"      gauntlet ${COMMONJSTESTS};

  # Now we'll just clean up after ourselves a little bit ...

    cleanup;

  # If it has reached this point, everything passed :-)

    hilite "All tests passed :-)";
    return 0;

}

main $*;

exit $?;

#-  vim:set syntax=sh:
