#-  R source code

#-  blastoff.r ~~
#                                                       ~~ (c) SRW, 09 Aug 2011

(function(argv) {

  countdown <- function(n) {
    ifelse(n == 0, "Blastoff!", paste(n, "...", countdown(n - 1)))
  }

  cat(countdown(10), "\n", sep = " ")

})(commandArgs())

#-  vim:set syntax=r:
