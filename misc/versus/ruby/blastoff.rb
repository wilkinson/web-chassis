#-  Ruby source code

#-  blastoff.rb ~~
#                                                       ~~ (c) SRW, 18 Aug 2011

lambda { |argv|

    def countdown(n)
        (n <= 0) ? "Blastoff!" : n.to_s + " ... " + countdown(n - 1)
    end

    puts countdown(10)

}.call(ARGV)

#-  vim:set syntax=ruby:
