#-  Tcl source code

#-  blastoff.tcl ~~
#                                                       ~~ (c) SRW, 09 Aug 2011

proc main argv {

    proc countdown n {
        if {$n == 0} {
            return "Blastoff!"
        } else {
            set x [countdown [expr {$n - 1}]]
            return "$n ... $x"
        }
    }

    puts [countdown 10]

}

main argv

#-  vim:set syntax=tcl:
