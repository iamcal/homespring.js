// helpers for writing tests

HS.Program.prototype.findFirstNode = function(name){

	for (var i=0; i<this.nodes.length; i++){

		if (this.nodes[i].lname == name) return this.nodes[i];
		if (this.nodes[i].old_lname == name) return this.nodes[i];
	}

	return null;
};

HS.Node.prototype.dumpChildren = function(){

	var names = [];

	for (var i=0; i<this.kids.length; i++){
		names.push(this.kids[i].name);
	}

	return names.join(',');
};

HS.Node.prototype.containsSalmon = function(s){

	for (var i=0; i<this.salmon.length; i++){
		if (this.salmon[i] == s) return true;
	}

	return false;
};

HS.Salmon.prototype.findNode = function(){
	var self = this;

	for (var i=0; i<self.program.nodes.length; i++){
		var n = self.program.nodes[i];

		for (var j=0; j<n.salmon.length; j++){
			if (n.salmon[j] == self) return n;
		}
	}

	return null;
};

function test_example(filename){

	var code = '';
	$.ajax({
		async: false, // must be synchronous to guarantee that no tests are run before fixture is loaded
		cache: false,
		url: 'base/examples/'+filename,
		//dataType: 'html',
		success: function (data, status, $xhr){
			code = $xhr.responseText
		}
	}).fail(function ($xhr, status, err){
		throw new Error('Fixture could not be loaded: ' + url + ' (status: ' + status + ', message: ' + err.message + ')')
	});

	var p = new HS.Program(code);

	p.output = [];

	p.onOutput = function(str){
		p.output.push(str);
	};

	p.test = function(maxTicks){
		for (var i=0; i<maxTicks; i++){
			p.tick();
			if (p.terminated) break;
		}
	}

	return p;
}

function test_example_full(filename, config){

	var p = test_example(filename);

	p.onTickStart = function(){
		if (config.input && typeof config.input[p.tickNum] != 'undefined'){
			p.input = config.input[p.tickNum];
		}
	}

	p.onTickEnd = function(){
		if (config.output && typeof config.output[p.tickNum] != 'undefined'){
			expect(p.output).toEqual(config.output[p.tickNum]);
		}
	}

	if (config.terminates){
		p.test(config.terminates+1);
		expect(p.terminated).toBe(true);
		expect(p.tickNum).toBe(config.terminates);
	}else if (config.run){
		p.test(config.run);
		expect(p.terminated).toBe(false);
		expect(p.tickNum).toBe(config.run);
	}else{
		expect('').toBe('define config.terminates or config.run!');
	}
}
