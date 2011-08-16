#-  Ruby source code

#-  blastoff.rb ~~
#
#   A port of 'blastoff.js' into Ruby that uses my "onload" pattern :-)
#
#                                                           ~~ SRW, 21 Jun 2011

def main(argv)

    def countdown(n)
        (n <= 0) ? "Blastoff!" : n.to_s + " ... " + countdown(n - 1)
    end

    puts countdown(10)

end

main(ARGV)

#-  vim:set syntax=ruby:
