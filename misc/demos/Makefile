#-  GNU Makefile

#-  Makefile ~~
#
#   This contains live instructions for running the standalone demonstrations
#   in this directory using the project tree's version of Web Chassis. The
#   project's most up-to-date libraries are also loaded for each demonstration.
#   The reason I have chosen to run each demonstration separately, even though
#   running a bunch of files simultaneously is a major strength of Web Chassis,
#   is because running things separately proves each demo stands alone :-)
#
#                                                       ~~ (c) SRW, 18 Aug 2011

include ../../tools/macros.make

CHASSIS :=  $(SHELL) ../../bin/web-chassis.js $(wildcard ../../lib/*.js)
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
