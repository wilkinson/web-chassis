//- JavaScript source code

//- vim-syntax-test.js ~~
//                                                      ~~ (c) SRW, 16 Aug 2011

/*  FIXME NOTE TODO XXX */

//  FIXME NOTE TODO XXX

//  /*
    print("visible 1/8");

//  */
    print("visible 2/8");

//  /*  */
    print("visible 3/8");

/*  //  */
    print("visible 4/8");

/* /* */
    print("visible 5/8");

// /* */ */
    print("visible 6/8");

/* */ // */
    print("visible 7/8");

/*
 *  print("invisible 1/2");             //- this part should be hidden
 */

/**
 *  print("invisible 2/2");             //- this should also be hidden
 */

// /*
    print("visible 8/8");
// */

print('single-quotes');

//- This actually helped me notice a quirk in JavaScript that I can't explain:
//  the JVM-based interpreters print the final ")" in the next line, but the
//  C-based ones don't. I'm really surprised that it's being treated as a NULL
//  character, but I can't find anything about it in the standard ...

print("A tab:(\t), a dollar:($1), and a NULL character \\0:(\0)");

print("Hexcode: E = \x45,", 'F = \x46');
print("Unicode: \ua000, \uA000,", '\u0043, D, ...');

print("\ \
    Multiple\
    line\\\
    test 1/3 ...\
");

print('\
    Multiple\
    line\\\
    test 2/3 ...\
');

print("\
    Multiple\
    'line\
        test'\
    3/3 ...\
");

var x = 5;

switch (typeof x) {
case 'function':
    break;
case 'number':
    break;
default:
    break;
}

while (x < 10) {
    x += 1;
}

print(x);

var f;
f = function (x) {
    return x + 2;
};

print(f(3));

//- vim:set syntax=es5:
