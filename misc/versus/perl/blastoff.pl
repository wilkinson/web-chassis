#-  Perl 5.x source code

#-  blastoff.pl ~~
#                                                       ~~ (c) SRW, 09 Aug 2011

(sub {

    use strict;
    use warnings;

    sub countdown {
        my ($n) = @_;
        return ($n == 0) ? "Blastoff!\n" : "$n ... " . countdown($n - 1);
    }

    print(countdown(10));

})->(@ARGV);

#-  vim:set syntax=perl:
