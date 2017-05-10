#!/usr/bin/node

var HS = require('../lib/homespring.js');

bench(HS.const.TOKENIZE_STR, 'String');
bench(HS.const.TOKENIZE_RX, 'Regular Expression');

function bench(tokenizer, label){

	var src = "Universe bear hatchery Hello. World!.\n Powers   marshy marshy snowmelt a..b";
	var tot = 0;
	var itrs = 100000;

	var t0 = process.hrtime();

	for (var i=0; i<itrs; i++){

		var p = new HS.Program(src, {
			'tokenizer' : tokenizer
		});

		tot += p.tokens.length;
	}

	var t1 = process.hrtime(t0);
	var ms = Math.round((t1[0]*1000) + (t1[1]/1000000));

	console.log(label+": "+ms+"ms ("+tot+" tokens total)");
}
