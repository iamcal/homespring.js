# Building Joe Neem's Ocaml version

These instructions are for Ubuntu 14.04.4.

Install a million packages:

    apt-get -y install ocaml
    apt-get -y install ocaml-devel
    apt-get -y install ocaml-interp
    apt-get -y install ocaml-source
    apt-get -y install liblablgtk2-ocaml
    apt-get -y install liblablgtk2-ocaml-dev
    apt-get -y install liblablgtk2-gnome-ocaml-dev

Before running configure, you need to update locatedb:

    updatedb
    ./configure
    make

You can then run the interpreter:

    ./src/hsrun_opt $FILENAME
