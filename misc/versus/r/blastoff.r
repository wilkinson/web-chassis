#-  R source code

#-  blastoff.r ~~
#                                                       ~~ (c) SRW, 09 Aug 2011

(function(argv) {

  countdown <- function(n) {
    if (n == 0) {
      return("Blastoff!")
    } else {
      return(paste(n, "...", countdown(n - 1)))
    }
  }

  cat(countdown(10), "\n", sep = " ")

})(commandArgs())

#-  vim:set syntax=r:
