#!/usr/bin/node

var fs = require('fs');
var HS = require('./lib/homespring.js');

var path = process.argv[2];

fs.readFile(path, 'utf8', function(err, data){
	if (err){
		console.log('Unable to read source file: '+err);
	}else{
		var p = new HS.Program(data, true);
		p.run(50);
	}
});
