#-  Tcl source code

#-  zhongwen.tcl ~~
#                                                       ~~ (c) SRW, 09 Aug 2011

proc main argv {

    package require Tcl 8.3
    package require unicode 1.0

    set message {20320 22909 21527 63}
    set decoded [::unicode::tostring $message]

    puts $decoded

}

main argv

#-  vim:set syntax=tcl:
