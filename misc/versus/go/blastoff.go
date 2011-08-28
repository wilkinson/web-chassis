//- Go source code

//- blastoff.go ~~
//                                                      ~~ (c) SRW, 09 Aug 2011

package main

import (
    "flag"
    "fmt"
)

func main() {

    flag.Parse()                        //- yes, it's useless, but it's fair!

    var countdown = func (n int) string {
        return ""
    }

    countdown = func (n int) string {
        if n == 0 {
            return "Blastoff!"
        }
        return fmt.Sprintf("%d ... %s", n, countdown(n - 1))
    }

    fmt.Printf("%s\n", countdown(10))

}

//- vim:set syntax=go:
