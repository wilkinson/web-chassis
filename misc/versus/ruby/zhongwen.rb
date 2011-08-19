#-  Ruby source code

#-  zhongwen.rb ~~
#                                                       ~~ (c) SRW, 18 Aug 2011

def main(argv)

    message = [20320, 22909, 21527, 63]
    decoded = message.pack("U" * message.length)

    puts decoded

end

main(ARGV)

#-  vim:set syntax=ruby:
