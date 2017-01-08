
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

HS.Program = function(source, debugMode){
	var self = this;

	self.debugMode = !!debugMode;

	self.tokens = self.tokenize(source);
	self.nodes = self.build_tree(self.tokens);
	self.root = self.nodes.length ? self.nodes[0] : null;

	self.tickNum = 0;
	self.endThisTick = false;

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
			current = current.parent;
			if (!current){
				throw new HS.Exception('Illegal program - traversed beyond root');
				return null;
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
		return new HS.NodeDefs[lname](uid, name, parent);
	}
	return new HS.SpringNode(uid, name, parent);
}


// represents a node in the river system

HS.Node = function(uid, name, parent){
	var self = this;
	self.uid = uid;
	self.name = name;
	self.lname = name.toLowerCase();
	self.parent = parent;
	self.kids = [];
	self.salmon = [];
	if (parent) parent.kids.push(self);

	// general node state
	self.is_snowy = null;
	self.is_watered = null;
	self.generates_power = null;
	self.is_destroyed = false;

	// special node flags
	self.prev_snow = false; // used by "marshy"

	return self;
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

		for (var i=0; i<self.kids; i++){
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


// the spring node is used for every non-special node

HS.SpringNode = function(){ HS.Node.apply(this, arguments); }
HS.SpringNode.prototype = Object.create(HS.Node.prototype);

HS.SpringNode.prototype.isSpring = function(){ return true; }


// represents a salmon swiming through the river system

HS.Salmon = function(program, name, age, direction){
	var self = this;
	self.program = program;
	self.name = name;
	self.age = age;
	self.direction = direction;
	self.justSpawned = false;
	self.spawnChild = null;
	self.ready = true;
	return self;
}

HS.Salmon.prototype.spawn = function(){
	var self = this;

	self.age = HS.const.MATURE;
	self.direction = HS.const.DOWNSTREAM;

	var ns = new HS.Salmon(self.program, self.name,  HS.const.YOUNG, HS.const.DOWNSTREAM);

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
			// " ." is a literal period, else this terminates the token
			if (chars[i+1] == '.'){
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

	var max = amax || 10;
	var i = 0;

	while (i<max && !self.endThisTick){
		self.tick();
		i++;
	}

	if (self.endThisTick){
		self.debug('program terminated');
	}else{
		self.debug('stopped run after '+i+' ticks');
	}
}

HS.Program.prototype.tick = function(){
	var self = this;
	self.tickNum++;
	self.startTick();

	self.snowTick();
	self.waterTick();
	self.powerTick();
	self.fishTick();
	self.miscTick();
	self.inputTick();
}

HS.Program.prototype.snowTick = function(){
	var self = this;
	self.debug('starting snow tick #'+self.tickNum);

	// In the snow tick, the snow state of each node is updated. A node becomes snowy
	// if it is not currently blocking snowmelts and if one of its children is snowy. The
	// snow tick is propagated in a post-order fashion.

	// Certain nodes will be destroyed when snowmelt reaches them. A node that
	// is destroyed loses its abilities and its name (its name becomes "").

	self.postOrder(function(n){

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
			false;
		}


		// snowmelt spreads

		n.is_snowy = true;

		if (n.lname == 'universe'){
			self.endThisTick = true;
		}

		if (n.canBeDestroyed()){

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

		// springs create water all by themselves
		if (n.isSpring()){
			n.is_watered = true;
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

		var remain = [];

		for (var j=0; j<n.salmon.length; j++){
			var s = n.salmon[j];

			if (s.direction != HS.const.DOWNSTREAM){
				remain.push(s);
				continue;
			}

			if (!s.ready){
				remain.push(s);
				s.ready = true;
				continue;
			}

			if (!n.canFishLeave(s)){
				remain.push(s);
				continue;
			}

			if (!n.parent){
				self.debug("salmon made it out to world: "+s.name);
				continue;
			}

			if (!n.parent.canFishEnter(s)){
				remain.push(s);
				continue;
			}

			n.parent.fishEnters(s);
		}

		n.salmon = remain;
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

		var remain = [];

		for (var j=0; j<n.salmon.length; j++){
			var s = n.salmon[j];

			if (s.direction != HS.const.UPSTREAM){
				remain.push(s);
				continue;
			}

			if (!s.ready){
				remain.push(s);
				s.ready = true;
				continue;
			}

			if (!n.canFishLeave(s)){
				remain.push(s);
				remain.push(s.spawn());
				continue;
			}

			var found = false;

			// find a matching name upstream
			for (var k=0; k<n.kids.length; k++){
				if (n.kids[k].canFindNamedNode(s.name)){
					if (n.kids[k].canFishEnter(s)){
						n.kids[k].fishEnters(s);
						found = true;
						break;
					}
				}
			}
			if (found) continue;

			// find any node we can move into
			for (var k=0; k<n.kids.length; k++){
				if (n.kids[k].canFishEnter(s)){
					n.kids[k].fishEnters(s);
					found = true;
					break;
				}
			}
			if (found) continue;

			// time to spawn
			remain.push(s);
			remain.push(s.spawn());
		}

		n.salmon = remain;
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
			var s = new HS.Salmon(self, "homeless", HS.const.MATURE, HS.const.UPSTREAM);

			n.salmon.unshift(s);
		}
	});
}

HS.Program.prototype.preOrder = function(callback){
	var self = this;

	for (var i=0; i<self.nodes.length; i++){
		callback(self.nodes[i]);
	}
}

HS.Program.prototype.postOrder = function(callback){
	var self = this;

	for (var i=self.nodes.length-1; i>=0; i--){
		callback(self.nodes[i]);
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

		var age = '?';
		var direction = '?';

		if (s.age == HS.const.YOUNG) age = 'young';
		if (s.age == HS.const.MATURE) age = 'mature';

		if (s.direction == HS.const.UPSTREAM) direction = 'upstream';
		if (s.direction == HS.const.DOWNSTREAM) direction = 'downstream';

		self.debug("node "+n.lname+": salmon \""+s.name+"\", "+age+", "+direction);
	});
}

HS.Program.prototype.miscTick = function(){
	var self = this;
	self.debug('starting misc tick #'+self.tickNum);

	// All other nodes that need to perform some action perform it in this tick, which
	// propagates in a pre-order fashion

	if (self.endThisTick){
		self.debug('program exits!');
	}

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

	// if the universe was destroyed, we skip the final input tick
	if (self.endThisTick){
		return;
	}

	// TODO
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



// node definitions

HS.Nodes = {};

HS.Nodes.append_down = {
};

HS.Nodes.append_up = {
};

HS.Nodes.bear = {
	onMiscTick : function(){
		var remains = [];
		for (var i=0; i<this.salmon.length; i++){
			if (this.salmon[i].age == HS.const.MATURE){
				this.salmon[i].dead = true;
			}else{
				remains.push(this.salmon[i]);
			}
		}
		this.salmon = remains;
	}
};

HS.Nodes.bird = {
};

HS.Nodes.bridge = {
	blocksWater : function(){ return this.is_destroyed; },
	blocksSnowmelt : function(){ return this.is_destroyed; },
	canBeDestroyed : function(){ return true; }
};

HS.Nodes.clone = {
};

HS.Nodes.current = {
};

HS.Nodes.downstream_sense = {
	blocksPower : function(){ return this.hasMatureDownstreamSalmon(); }
};

HS.Nodes.evaporates = {
	blocksWater : function(){ return this.isPowered(); },
	blocksSnowmelt : function(){ return this.isPowered(); }
};

HS.Nodes.fear = {
};

HS.Nodes.force_down = {
};

HS.Nodes.force_field = {
	blocksWater : function(){ return this.isPowered(); },
	blocksSnowmelt : function(){ return this.isPowered(); },
	canFishLeave : function(){ return !this.isPowered(); }
};

HS.Nodes.force_up = {
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
	blocksSnowmelt : function(){ return !this.isPowered(); }
};

HS.Nodes.lock = {
	blocksSnowmelt : function(){ return this.isPowered(); }
};

HS.Nodes.marshy = {
};

HS.Nodes.narrows = {
};

HS.Nodes.net = {
};

HS.Nodes.oblivion = {
	canBeDestroyed : function(){ return true; }
};

HS.Nodes.power_invert = {
	canBeDestroyed : function(){ return true; }
};

HS.Nodes.powers = {
	generatesPower : function(){ return true; }
};

HS.Nodes.pump = {
};

HS.Nodes.range_sense = {
	blocksPower : function(){ return this.hasMatureSalmon() || this.hasMatureSalmonUpstream(); }
};

HS.Nodes.range_switch = {
	blocksPower : function(){ return !this.hasMatureSalmon() && !this.hasMatureSalmonUpstream(); }
};

HS.Nodes.rapids = {
	onFishEnters : function(fish){ if (fish.age == HS.const.YOUNG) fish.ready = false; }
};

HS.Nodes.reverse_down = {
};

HS.Nodes.reverse_up = {
};

HS.Nodes.sense = {
	blocksPower : function(){ return this.hasMatureSalmon(); }
};

HS.Nodes.shallows = {
	onFishEnters : function(fish){ if (fish.age == HS.const.MATURE) fish.ready = false; }
};

HS.Nodes.snowmelt = {
};

HS.Nodes.spawn = {
};

HS.Nodes.split = {
};

HS.Nodes.switch = {
	blocksPower : function(){ return !this.hasMatureSalmon(); }
};

HS.Nodes.time = {
};

HS.Nodes.universe = {
	canBeDestroyed : function(){ return true; }
};

HS.Nodes.upstream_killing_device = {
};

HS.Nodes.upstream_sense = {
	blocksPower : function(){ return this.hasMatureUpstreamSalmon(); }
};

HS.Nodes.waterfall = {
};

HS.Nodes.young_bear = {
};

HS.Nodes.young_range_sense = {
	blocksPower : function(){ return this.hasYoungSalmon() || this.hasYoungSalmonUpstream(); }
};

HS.Nodes.young_range_switch = {
	blocksPower : function(){ return !this.hasYoungSalmon() && !this.hasYoungSalmonUpstream(); }
};

HS.Nodes.young_sense = {
	blocksPower : function(){ return this.hasYoungSalmon(); }
};

HS.Nodes.young_switch = {
	blocksPower : function(){ return !this.hasYoungSalmon(); }
};

HS.Nodes.youth_fountain = {
};


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


