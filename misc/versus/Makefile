#-  GNU Makefile

#-  Makefile ~~
#
#   This contains live instructions for running arbitrary JavaScript programs
#   with the Web Chassis framework preloaded. As you can see, any valid JS
#   program runs exactly as it would have anyway, but you get some advantages
#   in portability, automatic dependency resolution, and generic programming.
#   The programs in each directory implement a common set of "kata" to enable
#   side-by-side comparison. For instance, the Go language claims compilation
#   is so fast that "compile-and-run" feels like a scripting language's "run";
#   these tests help investigate such claims.
#
#   To make things more portable across POSIX shells, I will eventually replace
#   the use of named pipes with GNU Make macros that expand in the Makefile.
#   The macros are significantly harder to work with, because I demand that
#   they fail gracefully when the programs they correspond to cannot be found.
#   For now, though, these tests work pretty well :-)
#
#                                                       ~~ (c) SRW, 18 Aug 2011

include ../../tools/macros.make

SHELL   :=  $(call contingent, bash)

CHASSIS :=  $(SHELL) $(PWD)/../../bin/web-chassis.js $(PWD)/../../lib/base.js

GOCOMP  :=  $(call contingent, 6g)
GOLINK  :=  $(call contingent, 6l)

FALCON  :=  $(call contingent, falcon) -M   #-  suppresses creation of *.fam
PERL    :=  $(call contingent, perl)
PYTHON  :=  $(call contingent, python)
R       :=  $(call contingent, Rscript) #-  [faster] headless interface
RUBY    :=  $(call contingent, ruby)
TCL     :=  $(call contingent, tclsh)

CAT     :=  $(call contingent, cat)
RM      :=  $(call contingent, rm) -rf
TIME    :=  $(call contingent, time)

define run-Falcon
    $(FALCON) <($(CAT) $(wildcard ./falcon/*.fal))
endef

define run-Go
    for each in $(wildcard ./go/*.go); do                                   \
        $(GOCOMP) -o $${each%go}6 $${each}                              ;   \
        $(GOLINK) -o $${each%go}exe $${each%go}6                        ;   \
        $${each%go}exe                                                  ;   \
    done
endef

define run-JavaScript
    JS=jsc $(CHASSIS) $(wildcard ./javascript/*.js)
endef

define run-Perl
    $(PERL) <($(CAT) $(wildcard ./perl/*.pl))
endef

define run-Python
    $(PYTHON) <($(CAT) $(wildcard ./python/*.py))
endef

define run-R
    $(R) <($(CAT) $(wildcard ./r/*.r))
endef

define run-Ruby
    $(RUBY) <($(CAT) $(wildcard ./ruby/*.rb))
endef

define run-Tcl
    $(TCL) <($(CAT) $(wildcard ./tcl/*.tcl))
endef

define run-with-banner
    $(strip \
        $(call hilite, "$(strip $(1)) ...")                             ;   \
        $(TIME) $(call run-$(strip $(1)))                                   \
    )
endef

define run-tests
    $(strip \
        $(call run-with-banner, $(1)) >/dev/null 2>&1 || \
            $(call alert, "(badness)")                                      \
    )
endef

.PHONY: all clean clobber reset run

all: run

clean:
	@   $(strip $(RM) ./falcon/*.fam ./go/*.6 ./go/*.exe)

clobber: clean reset

reset:
	@   $(call contingent, clear)

run:
	@   $(call run-with-banner, Falcon)                             ;   \
            $(call run-with-banner, JavaScript)                         ;   \
            $(call run-with-banner, Perl)                               ;   \
            $(call run-with-banner, Python)                             ;   \
            $(call run-with-banner, Ruby)

###

.PHONY: test

test: clean
	@   $(call run-with-banner, Falcon)
	@   $(call run-with-banner, Go)
	@   $(call run-with-banner, JavaScript)
	@   $(call run-with-banner, Perl)
	@   $(call run-with-banner, Python)
	@   $(call run-with-banner, R)
	@   $(call run-with-banner, Ruby)
	@   $(call run-with-banner, Tcl)
	@   $(MAKE) clean

###

%:
	@   $(call alert, 'No target "$@" was found.')

#define run-python
#    $(PYTHON) -c \
#        'import $(PYSRC:%.py=%,) sys; $(PYSRC:%.py=%.main(sys.argv$;);)';   \
#    $(RM) $(PYSRC:%.py=%.pyc)
#endef

#define run-ruby
#    $(RUBY) -e '$(RBSRC:%.rb=require "./%";)'
#endef

#-  vim:set syntax=make:
