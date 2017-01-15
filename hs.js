#!/usr/bin/node

var fs = require('fs');
var HS = require('./lib/homespring.js');


// parse arguments

	var options = {
		'debug'	: false,
		'trace' : false,
		'pause' : false, // pause between steps
		'limit'	: undefined,
	};

	//look at all but the last flag. the last one is the file name to open
	for (var i=2; i<process.argv.length-1; i++){
		switch (process.argv[i]){
			case "-h":
			case "--help":
				printHelp();
				break;
			case "-d":
			case "--debug":
				options.debug = true;
				break;
			case "-t":
			case "--trace":
				options.trace = true;
				break;
			case "-l":
				options.limit = process.argv[++i];
				break;
			default:
				console.log("unknown flag: " + process.argv[i]);
				console.log("use --help to see usage");
				return;
		}
	}

	if (i >= process.argv.length){
		console.log("incorrectly formatted arguments");
		console.log("use --help to see usage");
		return;
	}

var path = process.argv[process.argv.length - 1];

fs.readFile(path, 'utf8', function(err, data){
	if (err){
		console.log('Unable to read source file: '+err);
	}else{
		var p = new HS.Program(data, options.trace);
		if (options.debug) p.dumpState();

		var stdin = process.openStdin();
		stdin.setEncoding('utf8');

		stdin.on('data', function(command){
			var input = command.toString();
			input = input.substr(0, input.length-1);

			if (input.length == 0){
			//	if (h.debug){
			//		setTimeout(h.step.bind(h), 0);
			//	}
			}else{
				p.input = input;
				//console.log('set p.input at tick '+p.tickNum);
			}
		});

		p.onOutput = function(str){
			process.stdout.write(str);
		};

		p.onTerminate = function(){
			//console.log('p.onTerminate() called at tick '+p.tickNum);
			stdin.destroy();
		};

		if (options.debug){
			p.debugMode = true;
			p.run(options.limit);
			p.dumpState();

			while (!p.terminated){
				p.tick();
				p.dumpState();
			}
		}else{
			p.run(options.limit);
		}
	}
});
