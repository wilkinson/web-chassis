#-  Python 2.x/3.x source code

#-  blastoff.py ~~
#                                                       ~~ (c) SRW, 09 Aug 2011

import sys

def main(argv):

    def countdown(n):
        if (n <= 0):
            return "Blastoff!"
        else:
            return str(n) + " ... " + countdown(n - 1)

    print(countdown(10))

if __name__ == "__main__":
    main(sys.argv)

#-  vim:set syntax=python:
