//- Go source code

//- blastoff.go ~~
//                                                      ~~ (c) SRW, 09 Aug 2011

package main

import (
    "flag"
    "fmt"
)

func countdown (n int) string {
    if n == 0 {
        return "Blastoff!"
    }
    return fmt.Sprintf("%d ... %s", n, countdown(n - 1))
}

func main() {
    flag.Parse()
    fmt.Printf("%s\n", countdown(10))
}

//- vim:set syntax=go:
