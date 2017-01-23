"use strict";

;(function() {
var root = this;


var HS = {};

HS.const = {
	'YOUNG' 	: 1,
	'MATURE'	: 2,
	'UPSTREAM'	: 3,
	'DOWNSTREAM'	: 4
}

HS.Exception = function(message){
	this.message = message;
	this.name = "HS.Exception";
}

HS.Program = function(source, debugMode, strictMode){
	var self = this;

	self.debugMode = !!debugMode;
	self.strictMode = !!strictMode;

	self.nodesUsed = {};

	self.tokens = self.tokenize(source);
	self.nodes = self.build_tree(self.tokens);
	self.root = self.nodes.length ? self.nodes[0] : null;

	self.preOrderList = [];
	if (self.root) self.preOrderPopulate(self.root);

	self.postOrderList = [];
	if (self.root) self.postOrderPopulate(self.root);

	self.endThisTick = false;
	self.salmon_uid = 1;

	self.tickNum = 0;
	self.terminated = false;
	self.input = null;

	return self;
}

HS.Program.prototype.build_tree = function(tokens){
	var self = this;

	if (!tokens.length) return [];

	var c = 1;

	var root = self.create_node(c++, tokens[0]);
	var current = root;
	var nodes = [root];

	for (var i=1; i<tokens.length; i++){
		if (tokens[i] == ''){
			if (current.parent){
				current = current.parent;
			}else{
				if (self.strictMode){
					throw new HS.Exception('Illegal program - traversed beyond root');
					return null;
				}

				var n = self.create_node(c++, '', current);
				nodes.push(n);
				current = n;
			}
		}else{
			var n = self.create_node(c++, tokens[i], current);
			nodes.push(n);
			current = n;
		}
	}

	return nodes;
}

HS.Program.prototype.create_node = function(uid, name, parent){

	var lname = name.toLowerCase().replace(/ /g, '_');
	if (HS.NodeDefs[lname]){
		this.nodesUsed[lname] = 1;
		return new HS.NodeDefs[lname](this, uid, name, parent);
	}
	return new HS.SpringNode(this, uid, name, parent);
}

HS.Program.prototype.preOrderPopulate = function(node){
	this.preOrderList.push(node);
	for (var i=0; i<node.kids.length; i++) this.preOrderPopulate(node.kids[i]);
}

HS.Program.prototype.postOrderPopulate = function(node){
	for (var i=0; i<node.kids.length; i++) this.postOrderPopulate(node.kids[i]);
	this.postOrderList.push(node);
}

HS.Program.prototype.onOutput = function(str){}
HS.Program.prototype.onTerminate = function(){}
HS.Program.prototype.onTickEnd = function(){}


// represents a node in the river system

HS.Node = function(program, uid, name, parent){
	var self = this;
	self.program = program;
	self.uid = uid;
	self.name = name;
	self.lname = name.toLowerCase();
	self.parent = parent;
	self.kids = [];
	self.salmon = [];
	if (parent){
		parent.kids.push(self);
		self.childIndex = parent.kids.length;
	}

	// general node state
	self.is_snowy = null;
	self.is_watered = null;
	self.generates_power = null;
	self.is_destroyed = false;

	// special node flags
	self.prev_snow = false; // used by "marshy"

	return self;
}

HS.Node.prototype.toString = function(){
	return this.uid+':'+this.safeName();
}

HS.Node.prototype.safeName = function(){
	var name = this.is_destroyed ? this.old_name+'(destroyed)' : this.name;
	return name.replace(/\n/g,'\\n');
}

// stub methods to be overridden by individual node classes

HS.Node.prototype.generatesPower = function(){ return false; }
HS.Node.prototype.blocksPower = function(){ return false; }
HS.Node.prototype.blocksWater = function(){ return false; }
HS.Node.prototype.blocksSnowmelt = function(){ return false; }
HS.Node.prototype.canFishLeave = function(fish){ return true; }
HS.Node.prototype.canFishEnter = function(fish){ return true; }
HS.Node.prototype.canBeDestroyed = function(){ return false; }
HS.Node.prototype.isSpring = function(){ return false; }
HS.Node.prototype.onFishEnters = function(fish){}
HS.Node.prototype.onMiscTick = function(){}


HS.Node.prototype.isPowered = function(){
	var self = this;

	// to determine is a node is powered:
	// 1) does it generate power? return true
	// 2) does it block power? return false
	// 3) check children - if a child has isPowered()=true, return true
	// 4) return false

	if (self.generates_power) return true;
	if (self.blocksPower()) return false;



	// power invert is a special case
	// TODO: move to a class method

	if (self.lname == 'power invert'){

		if (self.is_destroyed) return false;

		for (var i=0; i<self.kids.length; i++){
			if (self.kids[i].isPowered()){
				return false;
			}
		}

		return true;
	}


	// now check children	

	for (var i=0; i<self.kids.length; i++){
		if (self.kids[i].isPowered()){
			return true;
		}
	}

	return false;
}

HS.Node.prototype.fishEnters = function(fish){
	var self = this;

	self.onFishEnters(fish);

	self.salmon.unshift(fish);
	//console.log('moved fish into node', self);
}

HS.Node.prototype.canFindNamedNode = function(name){
	var self = this;

	if (self.name == name) return true;
	for (var i=0; i<self.kids.length; i++){
		if (self.kids[i].canFindNamedNode(name)) return true;
	}

	return false;
}

HS.Node.prototype.filterSalmon = function(callback){
	var self = this;

	var remains = [];
	for (var i=0; i<this.salmon.length; i++){
		callback(this.salmon[i], remains);
	}
	this.salmon = remains;
}

HS.Node.prototype.matchSalmon = function(callback){
	for (var i=0; i<this.salmon.length; i++){
		if (callback(this.salmon[i])) return true;
	}
	return false;
}

HS.Node.prototype.matchSalmonUpstream = function(callback){
	// used for the `range` nodes
	for (var i=0; i<this.salmon.length; i++){
		if (callback(this.salmon[i])) return true;
	}
	for (var i=0; i<this.kids.length; i++){
		if (this.kids[i].matchSalmonUpstream(callback)) return true;
	}
	return false;
}

//TODO: remove this and use matchSalmon instead
HS.Node.prototype.hasMatureSalmon = function(){
	for (var i=0; i<this.salmon.length; i++){
		if (this.salmon[i].age == HS.const.MATURE) return true;
	}
	return false;
}

HS.Node.prototype.spawnAllUpstream = function(){
	var self = this;
//	for (var i=0; i<self.kids.length; i++){
//		self.kids[i].filterSalmon(function(s, remain){
//			remain.unshift(s.spawn(self.kids[i]));
//			remain.push(s);
//		});
//		self.kids[i].spawnAllUpstream();
//	}

	self.filterSalmon(function(s, remain){
		remain.unshift(s.spawn(self));
		remain.push(s);
	});
	for (var i=0; i<self.kids.length; i++){
		self.kids[i].spawnAllUpstream();
	}
}

// the spring node is used for every non-special node

HS.SpringNode = function(){ HS.Node.apply(this, arguments); }
HS.SpringNode.prototype = Object.create(HS.Node.prototype);

HS.SpringNode.prototype.isSpring = function(){ return true; }


// represents a salmon swiming through the river system

HS.Salmon = function(program, name, age, direction){
	var self = this;
	self.program = program;
	self.uid = program.salmon_uid++;
	self.name = name;
	self.age = age;
	self.direction = direction;
	self.childFrom = -1;
	self.justSpawned = false;
	self.spawnChild = null;
	self.ready = true;
	self.dead = false;
	return self;
}

HS.Salmon.prototype.safeName = function(){
	return this.name.replace(/\n/g, '\\n');
}

HS.Salmon.prototype.toString = function(){

	var dir = '';
	if (this.direction == HS.const.DOWNSTREAM) dir = ':down';
	if (this.direction == HS.const.UPSTREAM) dir = ':up';

	var age = '';
	if (this.age == HS.const.YOUNG) age = ':young';
	if (this.age == HS.const.MATURE) age = ':mature';

	return this.safeName()+age+dir;
}

HS.Salmon.prototype.spawn = function(node){
	var self = this;

	self.age = HS.const.MATURE;
	self.direction = HS.const.DOWNSTREAM;

	var ns = new HS.Salmon(self.program, node.name, HS.const.YOUNG, HS.const.DOWNSTREAM);

	self.justSpawned = true;
	self.spawnChild = ns;

	return ns;
}

HS.Program.prototype.debug = function(str){
	var self = this;

	if (self.debugMode) console.log(str);
}

HS.Program.prototype.tokenize = function(str){
	var self = this;

	// illegal stuff

	if (str.indexOf('\t') >= 0){
		throw new HS.Exception('Illegal program - contains tabs');
		return [];
	}

	if (str.indexOf(' . ') >= 0){
		throw new HS.Exception('Illegal program - contains space-dot-space');
		return [];
	}

	if (str.indexOf('. .') >= 0){
		throw new HS.Exception('Illegal program - contains dot-space-dot');
		return [];
	}


	// tokenizing is super annoying to do via regexp or splits,
	// so we'll just go linearly through the string producing tokens.

	var tokens = [];

	var chars = str.split('');
	var next = '';
	var len = chars.length;

	for (var i=0; i<len; i++){
		if (chars[i] == ' '){
			// " ." is a literal period, else this terminates the token.
			// seems like you can't start a token with a period either.
			if (chars[i+1] == '.' && next != ''){
				next += '.';
				i++;
			}else{
				tokens.push(next);
				next = '';
			}
		}else if (chars[i] == '\n'){
			// \n counts as whitespace, unless it's preceeded by a period
			// which is handled below
			tokens.push(next);
			next = '';
		}else if (chars[i] == '.'){
			if (chars[i+1] == ' '){
				next += ' ';
				i++;
			}else if (chars[i+1] == '\n'){
				next += '\n';
				tokens.push(next);
				next = '';
				i++;
			}else if (chars[i+1] == '.'){
				tokens.push(next);
				next = '';
				//i++;
			}else{
				self.debug('parser error - unexpected period followewd by ' + chars[i+1]);
				return [];
			}
		}else{
			next += chars[i];
		}
	}
	if (next.length) tokens.push(next);

	return tokens;
}

HS.Program.prototype.run = function(amax){
	var self = this;

	self.maxTicks = amax;

	if (self.debugMode){
		setTimeout(self.tick.bind(self), 0);
	}else{
		this.intervalId = setInterval(self.tick.bind(self), 0);
	}
}

HS.Program.prototype.tick = function(){
	var self = this;

	if (self.terminated){
		return;
	}

	if (!self.root){
		self.onOutput("In Homespring, the null program is not a quine.\n");
		self.terminate();
		return;
	}

	if (self.maxTicks != undefined && self.tickNum >= self.maxTicks){
		self.debug('stopped run after maxTicks ('+self.maxTicks+') ticks');
		self.terminate();
		return;
	}

	if (self.endThisTick){
		self.terminate();
		return;
	}

	self.tickNum++;
	self.startTick();
	self.snowTick();
	self.waterTick();
	self.powerTick();
	self.fishTick();
	self.miscTick();
	if (!self.endThisTick) self.inputTick();

	if (self.onTickEnd) self.onTickEnd();

	if (self.endThisTick){
		self.terminate();
	}
}

HS.Program.prototype.terminate = function(){
	var self = this;

	self.terminated = true;

	if (self.intervalId != undefined){
		clearInterval(this.intervalId);
		self.intervalId = undefined;
	}

	// TODO: cleanup input handler here
	if (self.onTerminate) self.onTerminate();
}

HS.Program.prototype.snowTick = function(){
	var self = this;
	self.debug('starting snow tick #'+self.tickNum);

	// In the snow tick, the snow state of each node is updated. A node becomes snowy
	// if it is not currently blocking snowmelts and if one of its children is snowy. The
	// snow tick is propagated in a post-order fashion.

	// Certain nodes will be destroyed when snowmelt reaches them. A node that
	// is destroyed loses its abilities and its name (its name becomes "").

	self.preOrder(function(n){

		// special case - snowmelt starts the snow every tick
		// TODO: move to class method
		if (n.lname == 'snowmelt'){
			n.is_snowy = true;
			return;
		}

		// do any of the children of this node have snow?
		var has_snowy_children = false;
		for (var j=0; j<n.kids.length; j++){
			if (n.kids[j].is_snowy){
				has_snowy_children = true;
				break;
			}
		}

		// special case - marshy propogates its previous state
		// TODO: move this into a node method somehow
		if (n.lname == 'marshy'){
			n.is_snowy = n.prev_snow;
			n.prev_snow = has_snowy_children;
			return;
		}


		// if none of the children are snowy, we can't be snowy
		if (!has_snowy_children){
			n.is_snowy = false;
			return;
		}

		// at least one child is snowy, determine if this node is
		// currently blocking snowmelt

		if (n.blocksSnowmelt()){
			n.is_snowy = false;
			return;
		}


		// snowmelt spreads

		n.is_snowy = true;

		if (!n.is_destroyed && n.canBeDestroyed()){

			self.debug('destroying node '+n);

			n.old_name = n.name;
			n.old_lname = n.lname;

			n.name = '';
			n.lname = '';

			n.is_destroyed = true;
		}
	});
}

HS.Program.prototype.waterTick = function(){
	var self = this;
	self.debug('starting water tick #'+self.tickNum);

	// In the water tick, the water state of each node is updated. A node becomes
	// watered if it is not currently blocking water and if one of its children is watered.
	// The water tick is propagated in a post-order fashion.

	self.postOrder(function(n){

		// does this node block water?
		if (n.blocksWater()){
			n.is_watered = false;
			return;
		}

		// springs are always watered, but we update their state
		// in the second loop, below.
		if (n.isSpring()){
			return;
		}


		// do any of the children of this node have water?
		for (var j=0; j<n.kids.length; j++){
			if (n.kids[j].is_watered){
				n.is_watered = true;
				return;
			}
		}

		n.is_watered = false;
	});


	// it seems that most implementations don't have a spring create water
	// until _after_ the wate tick is propogated. the main outcome from
	// this is that hatcheries wont start working until tick 2 is they have
	// a spring upstream from them

	self.postOrder(function(n){

		if (n.isSpring()){
			n.is_watered = true;
		}
	});
}

HS.Program.prototype.powerTick = function(){
	var self = this;
	self.debug('starting power tick #'+self.tickNum);

	self.preOrder(function(n){
		n.generates_power = n.generatesPower();
	});
}

HS.Program.prototype.fishTick = function(){
	var self = this;
	self.debug('starting fish tick #'+self.tickNum);

	self.fishTickDown();
	self.fishTickUp();
	self.fishTickHatch();
}

HS.Program.prototype.fishTickDown = function(){
	var self = this;
	self.debug('starting fish tick down #'+self.tickNum);

	// This part of the fish tick only affects downstream salmon. Each downstream
	// salmon is moved to the parent of its current node if it is not blocked from doing
	// so. If its current node is the mouth of the river, the salmon is removed from the
	// river system and its name is printed to the terminal.
	// This tick propagates in a pre-order fashion.

	self.preOrder(function(n){
		n.filterSalmon(function(s, remain){

			if (s.direction != HS.const.DOWNSTREAM){
				remain.push(s);
				return;
			}

			if (!s.ready){
				remain.push(s);
				s.ready = true;
				return;
			}

			if (!n.canFishLeave(s)){
				remain.push(s);
				//self.debug('fish '+s.toString()+' can\'t leave '+n);
				return;
			}

			if (!n.parent){
				//self.debug("salmon made it out to world: "+s.name);
				self.onOutput(s.name);
				return;
			}

			if (!n.parent.canFishEnter(s)){
				remain.push(s);
				//self.debug('fish '+s.toString()+' blocked from moving downstream to '+n.parent.toString());
				return;
			}

			//self.debug('fish '+s.toString()+' moved downstream to '+n.parent.toString());
			s.childFrom = n.childIndex;
			n.parent.fishEnters(s);
		});
	});
}

HS.Program.prototype.fishTickUp = function(){
	var self = this;
	self.debug('starting fish tick up #'+self.tickNum);

	// This part of the fish tick only affects upstream salmon. For each upstream
	// salmon, an in-order search of the river system is conducted in order to find
	// a river node with the same name as the salmon. If there is such a node and
	// the salmon is not prevented from moving towards it, the salmon moves towards
	// that node. If there is no such node or if the salmon is prevented from moving
	// towards that node, the salmon will attempt to move (in order) to each child of
	// the current node. If the salmon cannot move to any child of the current node
	// or if there are no children of the current node, the salmon will spawn at the
	// current node.
	// When a salmon spawns, it becomes mature and its direction becomes downstream.
	// A new salmon is created at the current node. The new salmon is young,
	// downstream and its name is the name of the current node.
	// This tick propagates in a post-order fashion.

	
	self.postOrder(function(n){
		n.filterSalmon(function(s, remain){

			if (s.direction != HS.const.UPSTREAM){
				remain.push(s);
				return;
			}

			if (!s.ready){
				remain.push(s);
				s.ready = true;
				return;
			}

			if (!n.canFishLeave(s)){
				remain.unshift(s.spawn(n));
				remain.unshift(s);
				//self.debug('fish '+s.toString()+' spawned at '+n.toString()+' since we can\'t leave');
				//self.debug('new fish is '+remain[remain.length-1].toString());
				return;
			}

			// find a matching name upstream
			for (var k=0; k<n.kids.length; k++){
				if (n.kids[k].canFindNamedNode(s.name)){
					if (n.kids[k].canFishEnter(s)){
						//self.debug('fish '+s.toString()+' moved upstream towards name match '+n.kids[k].toString());
						n.kids[k].fishEnters(s);
						return;
					}
				}
			}

			// find any node we can move into
			for (var k=0; k<n.kids.length; k++){
				if (n.kids[k].canFishEnter(s)){
					//self.debug('fish '+s.toString()+' moved upstream to first available child '+n.kids[k].toString());
					n.kids[k].fishEnters(s);
					return;
				}
			}

			// time to spawn
			remain.unshift(s.spawn(n));
			remain.unshift(s);
			//self.debug('fish '+s.toString()+' spawned at '+n.toString()+' due to nowhere to go to');
			//self.debug('new fish is '+remain[remain.length-1].toString());
		});
	});
}

HS.Program.prototype.fishTickHatch = function(){
	var self = this;
	self.debug('starting fish tick hatch #'+self.tickNum);

	// This tick activates hatcheries. It propagates in a pre-order fashion.

	// Hatchery, when powered, creates a mature, upstream salmon named "homeless". Operates
	// during the fish tick hatch step.

	self.preOrder(function(n){

		if (n.lname == 'hatchery' && n.isPowered()){
			var s = new HS.Salmon(self, "homeless", HS.const.YOUNG, HS.const.UPSTREAM);

			n.salmon.unshift(s);
		}
	});
}

HS.Program.prototype.preOrder = function(callback){
	var self = this;

	for (var i=0; i<self.preOrderList.length; i++){
		callback(self.preOrderList[i]);
	}
}

HS.Program.prototype.postOrder = function(callback){
	var self = this;

	for (var i=0; i<self.postOrderList.length; i++){
		callback(self.postOrderList[i]);
	}
}

HS.Program.prototype.preOrderSalmon = function(callback){
	var self = this;

	self.preOrder(function(n){

		for (var j=0; j<n.salmon.length; j++){
			callback(n, n.salmon[j]);
		}
	});
}

HS.Program.prototype.dumpFish = function(){
	var self = this;

	self.preOrderSalmon(function(n, s){

		self.debug(n+' - '+s);
	});
}

HS.Program.prototype.miscTick = function(){
	var self = this;
	self.debug('starting misc tick #'+self.tickNum);

	// All other nodes that need to perform some action perform it in this tick, which
	// propagates in a pre-order fashion

	self.preOrder(function(n){
		n.onMiscTick();
	});
}

HS.Program.prototype.startTick = function(){
	var self = this;

	// this is run before the tick starts. we can use
	// this to reset state used for testing

	self.preOrderSalmon(function(n, s){
		s.justSpawned = false;
	});
}

HS.Program.prototype.inputTick = function(){
	var self = this;
	self.debug('starting input tick #'+self.tickNum);

	// If any input is available on the terminal, an upstream, mature fish is created at
	// the mouth of the river with the input text as its name.

	if (self.input != null && self.input != undefined){

		var s = new HS.Salmon(self, self.input, HS.const.MATURE, HS.const.UPSTREAM);
		self.root.salmon.unshift(s);

		self.input = null;
	}
}

HS.Program.prototype.tickSnow = function(){
	var self = this;
	self.tick();

	self.preOrder(function(n){

		if (n.name == 'marshy'){
			self.debug(n.name+' -> '+(n.is_snowy ? 'YES' : '-')+(n.prev_snow ? ' / (YES)' : ' / (-)'));
		}else{
			self.debug(n.name+' -> '+(n.is_snowy ? 'YES' : '-'));
		}
	});
}

HS.Program.prototype.tickWater = function(){
	var self = this;
	self.tick();

	self.preOrder(function(n){
		self.debug(n.name+' -> '+(n.is_watered ? 'YES' : '-'));
	});
}

HS.Program.prototype.dumpState = function(){
	var self = this;

	console.log('');
	console.log('## World state after tick '+self.tickNum);

	for (var i=0; i<self.nodes.length; i++){

		var n = self.nodes[i];

		// get depth
		var depth = 0;
		var p = n;
		while (p.parent){
			depth++;
			p = p.parent;
		}

		var salmon = [];
		for (var j=0; j<n.salmon.length; j++){
			salmon.push(n.salmon[j].toString());
		}
		salmon = '['+salmon.join(',')+']';

		var state = '';
		if (n.generates_power) state += ':P';
		if (n.isPowered()) state += ':p';

		if (n.is_snowy) state += ':s';
		if (n.is_watered) state += ':w';
		if (n.blocksPower()) state += ':BP';
		if (n.blocksWater()) state += ':BW';
		if (n.blocksSnowmelt()) state += ':BSn';
		if (!n.canFishLeave()) state += ':BSl';
		if (!n.canFishEnter()) state += ':VBSl';

		console.log(("  ".repeat(depth))+'"'+self.nodes[i].safeName()+'"'+state+salmon);
	}
}



// node definitions

HS.Nodes = {};

HS.Nodes.append_down = {
	onMiscTick : function(){
		var self = this;
		self.filterSalmon(function(s, remain){
			if (s.direction == HS.const.DOWNSTREAM && s.childFrom != 1){
				s.dead = true;
				for (var i=0; i<self.salmon.length; i++){
					if (self.salmon[i].direction == HS.const.DOWNSTREAM && self.salmon[i].childFrom == 1){
						self.salmon[i].name += s.name;
					}
				}
			}else{
				remain.push(s);
			}
		});
	}
};

HS.Nodes.append_up = {
	onMiscTick : function(){
		var self = this;
		self.filterSalmon(function(s, remain){
			if (s.direction == HS.const.DOWNSTREAM && s.childFrom != 1){
				s.dead = true;
				for (var i=0; i<self.salmon.length; i++){
					if (self.salmon[i].direction == HS.const.UPSTREAM){
						self.salmon[i].name += s.name;
					}
				}
			}else{
				remain.push(s);
			}
		});
	}
};

HS.Nodes.bear = {
	onMiscTick : function(){
		var self = this;
		this.filterSalmon(function(s, remain){
			if (s.age == HS.const.MATURE){
				s.dead = true;
				//self.program.debug('fish '+s+' got eaten by '+self);
			}else{
				remain.push(s);
			}
		});
	}
};

HS.Nodes.bird = {
	onMiscTick : function(){
		var self = this;
		this.filterSalmon(function(s, remain){
			if (s.age == HS.const.YOUNG){
				s.dead = true;
				//self.program.debug('fish '+s+' got eaten by '+self);
			}else{
				remain.push(s);
			}
		});
	}
};

HS.Nodes.bridge = {
	blocksWater : function(){ return this.is_destroyed; },
	blocksSnowmelt : function(){ return this.is_destroyed; },
	canFishEnter : function(s){ return !this.is_destroyed; },
	canBeDestroyed : function(){ return true; }
};

HS.Nodes.clone = {
	onMiscTick : function(){
		var self = this;
		var n = this.salmon.length;
		var born = [];
		for (var i=0; i<n; i++){
			born.unshift(new HS.Salmon(self.program, this.salmon[i].name, HS.const.YOUNG, HS.const.DOWNSTREAM));
		}
		for (var i=0; i<n; i++){
			born.push(this.salmon[i]);
		}
		this.salmon = born;
	}
};

HS.Nodes.current = {
	canFishEnter : function(s){ return s.age != HS.const.YOUNG; }
};

HS.Nodes.downstream_sense = {
	blocksPower : function(){
		return this.matchSalmon(function(s){
			return s.age == HS.const.MATURE && s.direction == HS.const.DOWNSTREAM;
		});
	}
};

HS.Nodes.evaporates = {
	blocksWater : function(){ return this.isPowered(); },
	blocksSnowmelt : function(){ return this.isPowered(); }
};

HS.Nodes.fear = {
	canFishEnter : function(){ return !this.isPowered(); }
};

HS.Nodes.force_down = {
	// onMiscTick overridden below
	canFishLeave : function(){
		// TODO: we need to know which node it's heading _to_
		return true;
	}
};

HS.Nodes.force_field = {
	blocksWater : function(){ return this.isPowered(); },
	blocksSnowmelt : function(){ return this.isPowered(); },
	canFishLeave : function(){ return !this.isPowered(); }
};

HS.Nodes.force_up = {
	// onMiscTick overridden below
	canFishLeave : function(){
		// TODO: we need to know which node it's heading _to_
		return true;
	}
};

HS.Nodes.hatchery = {
};

HS.Nodes.hydro_power = {
	generatesPower : function(){ return this.is_watered && !this.is_destroyed; },
	canBeDestroyed : function(){ return true; }
};

HS.Nodes.insulated = {
	blocksPower : function(){ return true; }
};

HS.Nodes.inverse_lock = {
	blocksSnowmelt : function(){ return !this.isPowered(); },
	canFishEnter : function(fish){
		return this.isPowered() || fish.direction != HS.const.DOWNSTREAM;
	}
};

HS.Nodes.lock = {
	blocksSnowmelt : function(){ return this.isPowered(); },
	canFishEnter : function(fish){
		return !(this.isPowered() && fish.direction == HS.const.DOWNSTREAM);
	}
};

HS.Nodes.marshy = {
};

HS.Nodes.narrows = {
	canFishEnter : function(fish){ return this.salmon.length == 0; }
};

HS.Nodes.net = {
	canFishEnter : function(s){ return s.age != HS.const.MATURE; }
};

HS.Nodes.oblivion = {
	canBeDestroyed : function(){ return true; },
	onMiscTick : function(){
		if (this.isPowered() && !this.is_destroyed){
			this.filterSalmon(function(s, remain){
				s.name = '';
				remain.push(s);
			});
		}
	}
};

HS.Nodes.power_invert = {
	canBeDestroyed : function(){ return true; }
};

HS.Nodes.powers = {
	generatesPower : function(){ return true; }
};

HS.Nodes.pump = {
	canFishEnter : function(fish){ return this.isPowered(); }
};

HS.Nodes.range_sense = {
	blocksPower : function(){
		return this.matchSalmonUpstream(function(f){
			return f.age == HS.const.MATURE;
		});
	}
};

HS.Nodes.range_switch = {
	blocksPower : function(){
		return !this.matchSalmonUpstream(function(f){
			return f.age == HS.const.MATURE;
		});
	}
};

HS.Nodes.rapids = {
	onFishEnters : function(fish){ if (fish.age == HS.const.YOUNG) fish.ready = false; }
};

HS.Nodes.reverse_down = {
	onMiscTick : function(){
		var self = this;
		this.filterSalmon(function(s, remain){
			if (s.direction == HS.const.DOWNSTREAM && s.childFrom == 1 && self.kids.length > 1 && self.kids[1].canFishEnter(s)){
				s.direction = HS.const.UPSTREAM;
				self.kids[1].fishEnters(s);
			}else{
				remain.push(s);
			}
		});
	}
};

HS.Nodes.reverse_up = {
	onMiscTick : function(){
		var self = this;
		this.filterSalmon(function(s, remain){
			if (s.direction == HS.const.DOWNSTREAM && s.childFrom == 2 && self.kids[0].canFishEnter(s)){
				s.direction = HS.const.UPSTREAM;
				self.kids[0].fishEnters(s);
			}else{
				remain.push(s);
			}
		});
	}
};

HS.Nodes.sense = {
	blocksPower : function(){ 
		if (this.hasMatureSalmon()) this.program.debug('sense node now blocks!');
		return this.hasMatureSalmon(); }
};

HS.Nodes.shallows = {
	onFishEnters : function(fish){ if (fish.age == HS.const.MATURE) fish.ready = false; }
};

HS.Nodes.snowmelt = {
};

HS.Nodes.spawn = {
	onMiscTick : function(){ if (this.isPowered()) this.spawnAllUpstream(); }
};

HS.Nodes.split = {
	onMiscTick : function(){
		var self = this;
		this.filterSalmon(function(s, remain){
			s.dead = true;
			var chars = s.name.split('');
			for (var i=0; i<chars.length; i++){
				remain.push(new HS.Salmon(self.program, chars[i], s.age, s.direction));
			}
		});
	}
};

HS.Nodes.switch = {
	blocksPower : function(){ return !this.hasMatureSalmon(); }
};

HS.Nodes.time = {
	onMiscTick : function(){
		this.filterSalmon(function(s, remain){
			s.age = HS.const.MATURE;
			remain.push(s);
		});
	}
};

HS.Nodes.universe = {
	canBeDestroyed : function(){ return true; },
	onMiscTick : function(){
		if (this.is_destroyed){
			this.program.endThisTick = true;
			this.program.debug('universe has been destroyed - program exits!')
		}
	}
};

HS.Nodes.upstream_killing_device = {
	onMiscTick : function(){
		if (this.isPowered() && this.kids.length > 1){
			this.kids[this.kids.length-1].filterSalmon(function(s, remain){
				s.dead = true;
			});
		}
	}
};

HS.Nodes.upstream_sense = {
	blocksPower : function(){
		return this.matchSalmon(function(f){
			return f.age == HS.const.MATURE && f.direction == HS.const.UPSTREAM;
		});
	}
};

HS.Nodes.waterfall = {
};

HS.Nodes.young_bear = {
	onMiscTick : function(){
		var self = this;
		var young = [];
		var survive = [];
		var kill_me = true;
		for (var i=0; i<self.salmon.length; i++){
			if (self.salmon[i].age == HS.const.MATURE){
				if (kill_me){
					self.salmon[i].dead = true;
				}else{
					survive.push(self.salmon[i]);
				}
				kill_me = !kill_me;
			}else{
				young.push(self.salmon[i]);
			}
		}
		self.salmon = young.concat(survive);
	}
};

HS.Nodes.young_range_sense = {
	blocksPower : function(){
		return this.matchSalmonUpstream(function(f){
			return f.age == HS.const.YOUNG;
		});
	}
};

HS.Nodes.young_range_switch = {
	blocksPower : function(){
		return !this.matchSalmonUpstream(function(f){
			return f.age == HS.const.YOUNG;
		});
	}
};

HS.Nodes.young_sense = {
	blocksPower : function(){
		return this.matchSalmon(function(f){
			return f.age == HS.const.YOUNG;
		});
	}
};

HS.Nodes.young_switch = {
	blocksPower : function(){
		return !this.matchSalmon(function(f){
			return f.age == HS.const.YOUNG;
		});
	}
};

HS.Nodes.youth_fountain = {
	onMiscTick : function(){
		this.filterSalmon(function(s, remain){
			s.age = HS.const.YOUNG;
			remain.push(s);
		});
	}
};

HS.Nodes.force_down.onMiscTick = HS.Nodes.reverse_down.onMiscTick;
HS.Nodes.force_up.onMiscTick = HS.Nodes.reverse_up.onMiscTick;


// this code sets up the classes for each node definition.
// this is ugly, but it means we can avoid a ton of boilerplate for each node 'class'

HS.NodeDefs = {};
for (var i in HS.Nodes){
	HS.NodeDefs[i] = function(){ HS.Node.apply(this, arguments); }
	HS.NodeDefs[i].prototype = Object.create(HS.Node.prototype);
	for (var j in HS.Nodes[i]){
		HS.NodeDefs[i].prototype[j] = HS.Nodes[i][j];
	}
}




	// export
	if (typeof exports !== 'undefined'){
		if (typeof module !== 'undefined' && module.exports){
			exports = module.exports = HS;
		}
		exports.HS = HS;
	}else if (typeof define === 'function' && define.amd){
		define(function() { return HS; })
	}else{
		root.HS = HS;
	}

}).call(function(){
	return this || (typeof window !== 'undefined' ? window : global);
}());
