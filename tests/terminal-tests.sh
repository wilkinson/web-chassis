#-  POSIX shell script

#-  terminal-tests.sh ~~
#                                                       ~~ (c) SRW, 18 Aug 2011

ARGS="$*";
CHASSIS="bin/web-chassis.js";
INTERPRETERS="";
SHELLS="";

alert() {
    printf "\033[1;31m--> %s\033[1;0m\n" "$*" >&2;
    return $?;
}

aside() {
    printf "\033[1;30m--> %s\033[1;0m\n" "$*";
    return $?;
}

hilite() {
    printf "\033[1;36m--> %s\033[1;0m\n" "$*";
    return $?;
}

gauntlet() {
    BADNESS="false";
    for sh in ${SHELLS}; do
        for js in ${INTERPRETERS}; do
            aside "JS=${js}, SHELL=${sh}";
            env JS=${js} SHELL=${sh} ${sh} ${CHASSIS} $*;
            if [ $? -ne 0 ]; then
                alert "TEST FAILED: ${sh} ${js} ${flag}";
                BADNESS="true";
                return 1;
            fi
        done
    done
    if [ ${BADNESS} = false ]; then
        hilite "All tests passed: $*";
        return 0;
    fi
}

for each in "`sed -ne 's/.*(available ${JS} \(.*\));/\1/p' ${CHASSIS}`"; do
    command -v ${each} >/dev/null 2>&1;
    if [ $? -eq 0 ]; then
        INTERPRETERS="${INTERPRETERS} `which -a ${each}`";
    fi
done

for each in "bash dash ksh sh zsh"; do
    command -v ${each} >/dev/null 2>&1;
    if [ $? -eq 0 ]; then
        SHELLS="${SHELLS} `which -a ${each}`";
    fi
done

gauntlet "${ARGS}";

#-  Also, I need to test Chassis's ability to load as a CommonJS module ...

#-  vim:set syntax=sh:
