#-  Ruby source code

#-  zhongwen.rb ~~
#                                                       ~~ (c) SRW, 18 Aug 2011

lambda { |argv|

    message = [20320, 22909, 21527, 63]
    decoded = message.pack("U" * message.length)

    puts decoded

}.call(ARGV)

#-  vim:set syntax=ruby:
