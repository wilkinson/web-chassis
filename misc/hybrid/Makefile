#-  GNU Makefile

#-  Makefile ~~
#
#   This contains live instructions for running the programs contained in this
#   directory -- it treats them as POSIX shell scripts, but naturally they are
#   actually written as hybrids that use Chassis as a command-line program.
#   These demonstrate the usefulness of Chassis once you have placed the file
#   somewhere on your ${PATH} and blessed it with executable permissions :-)
#
#                                                       ~~ (c) SRW, 04 Aug 2011

include ../../tools/macros.make

SRC     :=  $(wildcard *.js)

RM      :=  $(call contingent, rm) -rf
TIME    :=  $(call contingent, time)

define run-each
    for each in $(SRC); do $(SHELL) $${each}; done
endef

.PHONY: all clean clobber reset run

all: run

clean: reset

clobber: clean
	@   $(RM) $(filter-out Makefile $(SRC), $(wildcard *))

reset:
	@   $(call contingent, clear)

run:
	@   $(call run-each)

###

%:
	@   $(call alert, 'No target "$@" was found.')

#-  vim:set syntax=make:
