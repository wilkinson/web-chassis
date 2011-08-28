#-  R source code

#-  zhongwen.r ~~
#                                                       ~~ (c) SRW, 09 Aug 2011

(function(argv) {

  message <- c(20320, 22909, 21527, 63)
  decoded <- intToUtf8(message, multiple = TRUE)

  cat(decoded, "\n", sep = "")

})(commandArgs())

#-  vim:set syntax=r:
