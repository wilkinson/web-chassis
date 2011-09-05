#-  GNU Makefile

#-  Makefile ~~
#
#   This contains live instructions for running arbitrary JavaScript programs
#   with the Web Chassis framework preloaded. As you can see, any valid JS
#   program runs exactly as it would have anyway, but you get some advantages
#   in portability, automatic dependency resolution, and generic programming.
#   The programs in each directory implement a common set of "kata" to enable
#   side-by-side comparison, but I have deliberately removed the performance
#   tests -- a programmer's choice of higher-level language usually has more
#   to do with features, functionality, and convenience than with performance.
#   I say this because those who choose a language primarily for its speed
#   should choose low-level languages.
#
#   Of course, I have included Google's Go language here to throw a wrench into
#   that argument. It's the only systems language I have encountered that can
#   rival the convenience of a scripting language in any true sense. Its key
#   advantage, though, is its speed the _second_ time you need it, which once
#   again shows why a standing-start single-run performance test is useless.
#
#   NOTE: I do still plan to remove named pipes, for POSIX compatibility ...
#
#   NOTE: The next program I'd like to add is Monte Carlo approximation of pi.
#
#                                                       ~~ (c) SRW, 04 Sep 2011

include ../../tools/macros.make

SHELL   :=  $(call contingent, bash)

CHASSIS :=  $(SHELL) $(PWD)/../../bin/web-chassis.js $(PWD)/../../lib/base.js

GOCOMP  :=  $(call contingent, 6g)
GOLINK  :=  $(call contingent, 6l)

FALCON  :=  $(call contingent, falcon)
HASKELL :=  $(call contingent, runhaskell)  #-  nope, we're not compiling ;-)
PERL    :=  $(call contingent, perl)
PYTHON  :=  $(call contingent, python)
R       :=  $(call contingent, Rscript)     #-  use the faster interface
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

define run-Haskell
    for each in $(wildcard ./haskell/*.hs); do                              \
        $(HASKELL) $${each}                                             ;   \
    done
endef

define run-JavaScript
    $(CHASSIS) $(wildcard ./javascript/*.js)
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
        $(call hilite, "$(strip $(1))")                                 ;   \
        $(call run-$(strip $(1)))                                           \
    )
endef

define run-tests
    $(strip \
        $(call run-with-banner, $(1)) >/dev/null 2>&1 || \
            $(call alert, "(badness)")                                      \
    )
endef

.PHONY: all clean clobber reset run
.NOTPARALLEL: ;

all: run

clean:
	@   $(strip $(RM) ./falcon/*.fam ./go/*.6 ./go/*.exe)

clobber: clean reset

reset:
	@   $(call contingent, clear)

run: clean
	@   $(call run-with-banner, JavaScript)                         ;   \
            $(call run-with-banner, Perl)                               ;   \
            $(call run-with-banner, Python)                             ;   \
            $(call run-with-banner, Ruby)                               ;   \
            $(MAKE) clean

###

.PHONY: test

test: clean
	@   $(call run-with-banner, Falcon)                             ;   \
            $(call run-with-banner, Go)                                 ;   \
            $(call run-with-banner, Haskell)                            ;   \
            $(call run-with-banner, JavaScript)                         ;   \
            $(call run-with-banner, Perl)                               ;   \
            $(call run-with-banner, Python)                             ;   \
            $(call run-with-banner, R)                                  ;   \
            $(call run-with-banner, Ruby)                               ;   \
            $(call run-with-banner, Tcl)                                ;   \
            $(MAKE) clean

###

%:
	@   $(call alert, 'No target "$@" was found.')

#-  vim:set syntax=make:
