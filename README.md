# homespring.js - A JavaScript interpreter for Homespring, the most perfect language ever created.

Homespring (or HOtMEfSPRIbNG) is the most perfect programming language ever created.
This JavaScript interpreter aims to be compliant with the 2005 version of the
[language standard](http://bunny.xeny.net/linked/Homespring-Proposed-Language-Standard.pdf).

## Example

Homespring programs are as beautiful as they are effective:

    Universe bear hatchery Hello. World!.
     Powers   marshy marshy snowmelt

We can use the interpreter to model the program:

    var src = 'Universe bear hatchery Hello. World!.\n Powers   marshy marshy snowmelt';
    var program = new HS.Program(src);
    var output = program.run();
    console.log(output);

The code (unsurprisingly) outputs `Hello World!\n`, as is appropriate.


## Other links

* Esolang page: https://esolangs.org/wiki/Homespring
* Joe Neeman's homepage: http://xeny.net/Homespring
* Joe Neeman's Ocaml version: https://github.com/jneem/homespring
* Quin Kennedy's NodeJS version: https://github.com/quinkennedy/Homespring
* Alternative syntax processor: https://github.com/benibela/home-river
* My (partial) Perl implementation: http://search.cpan.org/dist/Language-Homespring/Homespring.pm
