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
* Mirror of Jeff Binder's original distribution: https://github.com/iamcal/Homespring
* Joe Neeman's homepage: http://xeny.net/Homespring
* Joe Neeman's Ocaml version: https://github.com/jneem/homespring
* Quin Kennedy's NodeJS version: https://github.com/quinkennedy/Homespring
* Alternative syntax processor: https://github.com/benibela/home-river
* My (partial) Perl implementation: http://search.cpan.org/dist/Language-Homespring/Homespring.pm


## Differences from spec

The updated spec (http://xeny.net/Homespring) contains some mistakes or omissions.
To allow this interpreter to correctly run example code, several changes and clatifications needed to be made:

* `reverse_down` changes salmon direction to upstream
* `split` adds the new fish to the bottom of the list, so `['ab', 'cd']` becomes `['a','b','c','d']`
* spring nodes don't produce water until the end of the water tick
* the snow tick is propogated pre-order, not post-order
* the water tick is propogated pre-order, not post-order
* a double-period creates a blank token without consuming the second period
* a token can't start with a period
* a blank token that would traverse tree-building beyond the root node adds a blank token as a child of the root node instead
* salmon created in the `hatchery` are young, not mature
* the `hatchery` node can be destroyed
