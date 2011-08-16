//- Go source code

//- zhongwen.go ~~
//                                                      ~~ (c) SRW, 09 Aug 2011

package main

import (
    "flag"
    "fmt"
)

func main() {

    flag.Parse()

    message := [...]int {20320, 22909, 21527, 63}
    decoded := ""

    for _, val := range message {
        decoded += fmt.Sprintf("%c", val)
    }

    print(decoded, "\n")

}

//- vim:set syntax=go:
