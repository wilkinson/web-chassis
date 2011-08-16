#-  GNU Makefile

#-  Makefile ~~
#
#   This contains live instructions to aid development with the Web Chassis
#   framework. Using GNU Make to script workflows other than builds may be a
#   peculiar idea to some, but I have found it to be an extremely effective
#   tool for almost every scripting task because Make excels at both sorting
#   dependencies and parallelizing targets automatically. Yes, there are many
#   other build tools out there, but the GNU toolchain comes pre-installed on
#   almost every machine I care to use -- why should I go to the trouble of
#   installing Yet Another Build Tool, when the point is to make things easy?
#
#   That said, I have recently begun porting many of my most useful macros to
#   POSIX-compatible shells (instead of just Bash). I'll get the new wrinkles
#   ironed out before too much longer :-)
#
#                                                           ~~ SRW, 13 Aug 2011

include tools/macros.make

CHASSIS     :=  ./bin/web-chassis.js
QFLAGS      :=  #
LIBS        :=  $(wildcard lib/*.js)
SANDBOX     :=  $(wildcard sandbox/*.js)
JSTESTS     :=  $(wildcard tests/*.js)
SHTESTS     :=  $(wildcard tests/*.sh)

HTML5GEN    :=  ./tools/webpage.rb
HTML        :=  index.html

JSDEBUG     :=  $(call contingent, js-debug)    #-  NOTE: this is not included!

CHMOD       :=  $(call contingent, gchmod chmod)
OPEN        :=  $(call contingent, gnome-open open)
RUBY        :=  $(call contingent, ruby jruby)
TIME        :=  $(call contingent, time)
YES         :=  $(call contingent, yes)

define run-experiments
    $(SHELL) $(CHASSIS) $(QFLAGS) $(LIBS) $(SANDBOX)
endef

define run-js-tests
    $(SHELL) $(CHASSIS) $(QFLAGS) $(LIBS) $(JSTESTS)
endef

define run-sh-tests
    $(SHELL) $(SHTESTS) $(1)
endef

.PHONY: all clean clobber install reset run
.SILENT: ;

all: run

clean: reset

clobber: clean
	@   $(strip \
                $(RM) $(HTML) .d8_history                               ;   \
                $(CHMOD) -x $(CHASSIS)                                      \
            )

install:
	@   $(SHELL) ./tools/install.sh

reset:
	@   $(call contingent, clear)

run:
	@   $(strip $(TIME) $(call run-experiments))

###

.PHONY: browse check test

browse: $(HTML)
	@   $(strip $(YES) | $(OPEN) $(HTML))

check:
	@   $(strip                                                         \
                $(TIME) $(call run-sh-tests, "-h")                      ;   \
                $(TIME) $(call run-sh-tests, "--help")                  ;   \
                $(TIME) $(call run-sh-tests, "-v")                      ;   \
                $(TIME) $(call run-sh-tests, "--version")               ;   \
                $(TIME) $(call run-sh-tests, $(LIBS) $(JSTESTS))            \
            )

test:
	@   $(strip $(TIME) $(call run-js-tests))

###

#-  This target is interesting because it enables verbose mode in Make, the
#   shell, the JS interpreter, and Web Chassis, all at the same time :-)

.PHONY: debug

debug:
	@   $(MAKE) test --debug=v QFLAGS=--debug SHELL="$(strip $(SHELL))"

###

$(HTML): $(CHASSIS) $(LIBS) $(SANDBOX) $(JSTESTS)
	@   $(RUBY) $(HTML5GEN) -o $@ $^

###

%:
	@   $(call alert, 'No target "$@" was found.')

#-  vim:set syntax=make:
