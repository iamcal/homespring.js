# Example code

These examples in this directory are taken from multiple sources.
The table below shows which interpreters are able to run which examples:

| Example       | Source                | Cal | Jeff | Joe | Quin |
| ------------- | --------------------- | ----| ---- | --- | ---- |
| add.hs        | Jeff Binder           | yes | yes  | yes | yes  |
| cat.hs        | Jeff Binder           | yes | yes  | yes | yes  |
| first.hs      | Jeff Binder           | yes | yes  | yes | yes  |
| hello-1.hs    | Jeff Binder           | yes | yes  | yes | yes  |
| hello-2.hs    | Jeff Binder           | yes | yes  | yes | yes  |
| hello-3.hs    | Jeff Binder           | yes | yes  | yes | yes  |
| hi.hs         | Jeff Binder           | yes | yes  | yes | yes  |
| name.hs       | Jeff Binder           | yes | -    | yes | -    |
| null.hs       | Jeff Binder           | yes | yes  | yes | yes  |
| quiz.hs       | Jeff Binder           | yes | yes  | yes | yes  |
| simple.hs     | Jeff Binder           | yes | yes  | yes | yes  |
| flipflop.hs   | Joe Neeman            | yes | -    | yes | -    |
| tic.hs        | Joe Neeman            | yes | -    | yes | -    |
| clock.hs      | Benito van der Zander | yes | -    | yes | yes  |
| count-1.hs    | Benito van der Zander | yes | -    | yes | yes  |
| count-2.hs    | Benito van der Zander | yes | -    | yes | -    |
| count-3.hs    | Benito van der Zander | yes | -    | yes | -    |
| count-4.hs    | Benito van der Zander | yes | -    | yes | -    |
| count-5.hs    | Benito van der Zander | yes | -    | yes | yes  |
| count-6.hs    | Benito van der Zander | yes | -    | yes | yes  |
| fizzbuzz-1.hs | Benito van der Zander | yes | -    | -   | -    |
| fizzbuzz-2.hs | Benito van der Zander | yes | -    | -   | -    |
| fizzbuzz-3.hs | Benito van der Zander | yes | -    | yes | -    |
| hello-4.hs    | Benito van der Zander | yes | -    | yes | yes  |

There are also 4 example files from Quin Kennedy's JS interpreter repo.
Unfortunately all of these examples rely on bugs in that particular interpreter,
so will not run correctly on a correct implementation.

| Example       | Source                | Status |
| ------------- | --------------------- | ------ |
| reverse-1.hs  | Quin Kennedy          | Broken |
| reverse-2.hs  | Quin Kennedy          | Broken |
| reverse-3.hs  | Quin Kennedy          | Broken |
| split.hs      | Quin Kennedy          | Broken |

The `reverse*.hsg` examples rely on the `force up` node allowing upstream salmon
to move to the first child, which it should be blocking.

The `split.hsg` example relies on an incorrect implementation of `append up` where
the appending logic is supposed to run in the misc tick, but instead runs in the
fish tick down, before any upstream salmon have had a chance to arrive (or leave,
from the previous tick).


## Legend

* Cal: 2017 JavaScript, This repo
* Jeff: 2003 Scheme, https://github.com/iamcal/Homespring
* Joe: 2005 OCaml, https://github.com/jneem/homespring
* Quin: 2012 JavaScript, https://github.com/quinkennedy/Homespring
* Benito: HomeSpringTree compiler, https://github.com/benibela/home-river
