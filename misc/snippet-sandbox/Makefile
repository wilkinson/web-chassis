#-  GNU Makefile

#-  Makefile ~~
#
#   This is a very general set of instructions for rapidly testing snippets of
#   JavaScript code using all available [known] server-side interpreters. It
#   is immensely useful, for example, when trying to edit the auto-detections
#   in the ever-changing world of JavaScript ... argh :-P
#
#                                                       ~~ (c) SRW, 14 Aug 2011

include $(shell pwd)/../../tools/macros.make

SHELL   :=  $(call contingent, dash sh)

JS      :=  $(call available, js jsc v8 d8 node rhino ringo narwhal)
SRC     :=  $(wildcard *.js)

RM      :=  $(call contingent, rm) -rf

define run-each
    for file in $(SRC); do                                                  \
        for exe in $(JS); do                                                \
            $(call aside, "$${exe} $${file}")                           ;   \
            $${exe} $${file}                                            ;   \
            if [ $$? -eq 0 ]; then                                          \
                $(call aside, "OK.")                                    ;   \
            else                                                            \
                $(call alert, "ERROR: $$?.")                            ;   \
            fi                                                          ;   \
            printf '\n' ''                                              ;   \
        done                                                            ;   \
    done
endef

.PHONY: all clean clobber reset run

all: run

clean: reset
	@   $(RM) .d8_history

clobber: clean

reset:
	@   $(call contingent, clear)

run:
	@   $(strip $(call run-each))

###

%:
	@   $(call alert, 'No target "$@" found.')

#-  vim:set syntax=make:
