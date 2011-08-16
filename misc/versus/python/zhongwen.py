#-  Python source code

#-  zhongwen.py ~~
#                                                       ~~ (c) SRW, 09 Aug 2011

import sys

def main(argv):

    message = [20320, 22909, 21527, 63]
    decoded = map(lambda each: unichr(each), message)

    print("".join(decoded))

if __name__ == "__main__":
    main(sys.argv)

#-  vim:set syntax=python:
