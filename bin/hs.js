#!/usr/bin/node

var fs = require('fs');
var HS = require('../lib/homespring.js');


// parse arguments

var options = {
	'debug'	: false,	// output state after each tick
	'trace' : false,	// show debug output as we run
	'pause' : false,	// pause between each tick, until enter is pressed
	'limit'	: undefined,	// limit max execution ticks
	'nodes' : false,	// dump the special nodes used in this program
};

var args = process.argv.slice(2);
for (var i=0; i<args.length; i++){

	if (args[i].substring(0,1) != '-'){
		break;
	}

	if (args[i] == '--'){
		i++;
		break;
	}


	switch (args[i]){
			
		case "-h":
		case "--help":
			printHelp();
			return;
		case "-d":
		case "--debug":
			options.debug = true;
			break;
		case "-t":
		case "--trace":
			options.trace = true;
			break;
		case "-l":
			options.limit = args[++i];
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
			console.log("Unknown flag: " + args[i]);
			console.log("");
			printHelp();
			return;
	}
}

function printHelp(){
	console.log("usage: ./hs.js [options] filename.hs");
	console.log("  -h|--help    : show this information");
	console.log("  -d|--debug   : dump tree state on each tick");
	console.log("  -d|--trace   : show the phases of each tick");
	console.log("  -p|--pause   : pause execution after each tick, waitring for input/enter key");
	console.log("  -d|--nodes   : dump special nodes used before execution");
	console.log("  -l|--limit n : limit execution to n ticks");
}

if (i >= args.length){
	console.log("No input file specified");
	console.log("");
	printHelp();
	return;
}

var path = process.argv[process.argv.length - 1];

fs.readFile(path, 'utf8', function(err, data){
	if (err){
		console.log('Unable to read source file: '+err);
	}else{
		var p = new HS.Program(data, {
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

		if (options.debug){
			p.onTickEnd = function(){
				p.dumpState();
			};
		}

		if (options.pause){

			p.maxTicks = options.limit;
			p.tick();
		}else{
			p.run(options.limit);
		}
	}
});
