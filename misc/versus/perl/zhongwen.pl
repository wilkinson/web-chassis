#-  Perl 5.x source code

#-  zhongwen.pl ~~
#                                                       ~~ (c) SRW, 09 Aug 2011

(sub {
    use strict;
    use warnings;

    use charnames ':full';
    binmode(STDOUT, ":utf8");

    my (@message) = (20320, 22909, 21527, 63);
    my (@decoded) = map(chr, @message);

    print(@decoded, "\n");

}->(@ARGV));

#-  vim:set syntax=perl:
