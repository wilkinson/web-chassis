#-  GNU Makefile

#-  Makefile ~~
#
#   This contains live instructions for running the standalone demonstrations
#   in this directory using the project tree's version of Web Chassis :-)
#
#                                                       ~~ (c) SRW, 15 Aug 2011

include ../../tools/macros.make

CHASSIS :=  $(SHELL) ../../bin/web-chassis.js
SRC     :=  $(wildcard *.js)

define run-each
    for each in $(SRC); do                                                  \
        $(call aside, "$${each}")                                       ;   \
        $(CHASSIS) $${each}                                             ;   \
    done
endef

.PHONY: all clean clobber reset run

all: run

clean: reset

clobber: clean

reset:
	@   $(call contingent, clear)

run:
	@   $(call run-each)

###

%:
	@   $(call alert, 'No target "$@" was found.')

#-  vim:set syntax=make:
