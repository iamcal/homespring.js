#!/usr/bin/node

var fs = require('fs');
var HS = require('./lib/homespring.js');


// parse arguments

	var options = {
		'debug'	: false,
		'trace' : false,
		'pause' : false, // pause between steps
		'limit'	: undefined,
		'nodes' : false,
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
			case "-n":
			case "--nodes":
				options.nodes = true;
				break;
			case "-p":
			case "--pause":
				options.pause = true;
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
		var p = new HS.Program(data, {
			'singleTick' : options.debug,
			'strictmode' : false,
			'traceTicks' : options.trace,
		});
		if (options.debug) p.dumpState();

		if (options.nodes){
			var n = [];
			for (var i in p.nodesUsed) n.push(i);
			n = n.sort();
			console.log("Nodes used:", n);
		}

		var stdin = process.openStdin();
		stdin.setEncoding('utf8');

		stdin.on('data', function(command){
			var input = command.toString();
			input = input.substr(0, input.length-1);

			if (input.length == 0){
				if (options.pause){
					p.tick();
					p.dumpState();
				}
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

		if (options.pause){

			p.maxTicks = options.limit;
			p.tick();
			p.dumpState();
		}else{
			p.run(options.limit);
		}
	}
});
