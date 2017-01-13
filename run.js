#!/usr/bin/node

var fs = require('fs');
var HS = require('./lib/homespring.js');

var path = process.argv[2];

fs.readFile(path, 'utf8', function(err, data){
	if (err){
		console.log('Unable to read source file: '+err);
	}else{
		var p = new HS.Program(data, false);
		p.dumpState()

		var max = 20;
		var i = 0;

		while (i<max && !p.endThisTick){
			p.tick();
			p.dumpState();
			i++;
		}

		if (p.endThisTick){
			console.log('program terminated');
		}else{
			console.log('stopped run after '+i+' ticks');
		}
	}
});
