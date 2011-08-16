#-  POSIX shell script

#-  terminal-tests.sh ~~
#                                                           ~~ SRW, 20 Jul 2011

ARGS="$*"
CHASSIS="bin/web-chassis.js"
INTERPRETERS=""
SHELLS=""

alert() {
    printf "\033[1;31m--> %s\033[1;0m\n" "$*" >&2
    return $?
}

aside() {
    printf "\033[1;30m--> %s\033[1;0m\n" "$*"
    return $?
}

hilite() {
    printf "\033[1;36m--> %s\033[1;0m\n" "$*"
    return $?
}

gauntlet() {
    BADNESS="false"
    for sh in ${SHELLS}; do
        for js in ${INTERPRETERS}; do
            aside "JS=${js}, SHELL=${sh}"
            env JS=${js} SHELL=${sh} ${sh} ${CHASSIS} $*
            if [ $? -eq 0 ]; then
                :                       #-  all is well
            else
                alert "TEST FAILED: ${sh} ${js} ${flag}"
                BADNESS="true"
            fi
        done
    done
    if [ "${BADNESS}" = "false" ]; then
        hilite "All tests passed: $*";
        return 0
    else
        return 1
    fi
}

for each in "`sed -ne 's/.*(available ${JS} \(.*\));/\1/p' ${CHASSIS}`"; do
    INTERPRETERS="${INTERPRETERS} `command -v ${each}`"
done

for each in "bash dash ksh sh zsh"; do
    SHELLS="${SHELLS} `command -v ${each}`"
done

gauntlet "${ARGS}"

#-  Also, I need to test Chassis's ability to load as a CommonJS module ...

#-  vim:set syntax=sh:
