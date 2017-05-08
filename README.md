# homespring.js - A JavaScript interpreter for Homespring

Homespring (or HOtMEfSPRIbNG) is the pinnacle of programming language design.
With this interpreter you can finally use Homespring code in your browser to
make any webpage more dynamic.

This JavaScript interpreter aims to be compliant with the 2005 version of the
[language standard](http://bunny.xeny.net/linked/Homespring-Proposed-Language-Standard.pdf).


## Example

Homespring programs are as beautiful as they are effective:

    Universe bear hatchery Hello. World!.
     Powers   marshy marshy snowmelt

We can use the interpreter to model the program:

    var HS = require('./lib/homespring.js');
    var src = 'Universe bear hatchery Hello. World!.\n Powers   marshy marshy snowmelt';
    var program = new HS.Program(src);
    var output = program.runSync();
    console.log(output);

The code (unsurprisingly) outputs `Hello World!\n`, as is appropriate.


## Commandline Usage

A simple node-based CLI wrapper is included:

    ./bin/hs.js examples/hello-1.hs

Several options are available:

    ./bin/hs.js --help


## JavaScript API

### Constructor

    var program = new HS.Program(source[, options]);

The source of the program must be passed when creating a new program object. The source
is tokenized at the river-system built at this time. Exceptions are thrown for invalid
programs. The optional `options` argument must contain a hash of possible options:

  * `strictMode` (bool) : controls whether programs can traverse beyond their root (default: false).
  * `traceTicks` (cool) : controls whether certain debug output is shown, such as start and end of each tick (default: false).


### Execution

    program.runSync([max_ticks]);
    program.run([max_ticks]);
    program.tick();

There are three ways to execute the program.

`runSync()` will run the program to completion and return. This is done completely synchronously. This
method will return when the program terminates, or when `max_ticks` have been reached. In the case of
a non-terminating program, this method will not return unless `max_ticks` was specified. This method
also returns the output as a single string, although the output callback (see below) can also be used.
Any input must be immediaetly available in the input property (see below), so is not suitable for an 
interactive process or one that needs multiple inputs.

`run()` is similar to `runSync()`, but each tick of execution happens using `setTimeout()`. Because of
this, the method will return immediately. You will need to hook up a termination callback (see below)
to watch for program completion. Output is not returned, so the callback must be used.

`tick()` synchronously executes a single tick of the program, then returns. This can be used for
building an interactive debugger. Callbacks must be used for input and output. Termination can
be detected either via a callback or checking the `.terminated` property.


### Callbacks

You can hook up to several optional callbacks to capture certain events during execution:

    program.onOutput = function(str, fish){};
    program.onTerminate = function(){};
    program.onTickStart = function(){};
    program.onTickEnd = function(){};

The output callback is called whenever the program produces output. The first argument is
the string to be ouput, while the second is the fish that created the output.

The terminate callback is called when the program exits, either by reaching the end of
execution (when `universe` is destroyed, etc.) or by hitting `max_ticks` number of ticks.

The tick start and end callbacks are called as each execution step starts and ends.


### Properties

    program.input
    program.terminated
    program.tickNum

The `input` property is used to supply input to the program. See `bin/hs.js` for an
example of how to hook this up to an interactive process.

The `terminated` property is set to true when the program eaches the end of execution
or reaches `max_ticks` number of ticks.

The `tickNum` property identifies the last tick to start. This is set to zero when
a program is created, and increment just before `onTickStart()` is called.


### Nodes and Salmon

TODO...



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
* the snow tick is propogated pre-order, not post-order
* the water tick is propogated pre-order, not post-order
* a double-period creates a blank token without consuming the second period
* a token can't start with a period
* a blank token that would traverse tree-building beyond the root node adds a blank token as a child of the root node instead
* salmon created in the `hatchery` are young, not mature
* the `hatchery` node can be destroyed
* the `young bear` starts eating at the second salmon, not the first
* in the fish up tick, if an upstream salmon name matches the node name, it spawns immediately. this happens only once the salmon
  is ready to leave, so on the second tick after entering a `shallows` or `rapids` node.
* when a node is destroyed by snowmelt, it keeps its name (rather than having the name set to "")
