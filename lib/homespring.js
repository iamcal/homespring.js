
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
	self.tree = self.build_tree(self.tokens);

	self.tickNum = 0;
	self.endThisTick = false;

	return self;
}

HS.Program.prototype.build_tree = function(tokens){
	var self = this;

	if (!tokens.length) return null;

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

	return {
		'root'	: root,
		'nodes'	: nodes
	};
}

HS.Program.prototype.create_node = function(uid, name, parent){

	var lname = name.toLowerCase().replace(/ /g, '_');
	if (HS.NodeDefs[lname]){
		return new HS.NodeDefs[lname](uid, name, parent);
	}
	return new HS.Node(uid, name, parent);
}

// TODO: factor this out since we'll define each node as a 'class'
HS.Program.prototype.reservedList = {
	'hatchery'			: 1,
	'hydro power'			: 1,
	'snowmelt'			: 1,
	'shallows'			: 1,
	'rapids'			: 1,
	'append down'			: 1,
	'bear'				: 1,
	'force field'			: 1,
	'sense'				: 1,
	'clone'				: 1,
	'young bear'			: 1,
	'bird'				: 1,
	'upstream killing device'	: 1,
	'waterfall'			: 1,
	'universe'			: 1,
	'powers'			: 1,
	'marshy'			: 1,
	'insulated'			: 1,
	'upstream sense'		: 1,
	'downstream sense'		: 1,
	'evaporates'			: 1,
	'youth fountain'		: 1,
	'oblivion'			: 1,
	'pump'				: 1,
	'range sense'			: 1,
	'fear'				: 1,
	'reverse up'			: 1,
	'reverse down'			: 1,
	'time'				: 1,
	'lock'				: 1,
	'inverse lock'			: 1,
	'young sense'			: 1,
	'switch'			: 1,
	'young switch'			: 1,
	'narrows'			: 1,
	'append up'			: 1,
	'young range sense'		: 1,
	'net'				: 1,
	'force down'			: 1,
	'force up'			: 1,
	'spawn'				: 1,
	'power invert'			: 1,
	'current'			: 1,
	'bridge'			: 1,
	'split'				: 1,
	'range switch'			: 1,
	'young range switch'		: 1
};


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

	// special node flags
	self.prev_snow = false; // used by "marshy"
	self.was_bridge = false; // used by "bridge"

	return self;
}

HS.Node.prototype.isSpring = function(){
	var self = this;

	// TODO: switch this to use the nodeDefs list once it's complete
	return HS.Program.prototype.reservedList[self.lname] ? false : true;
}

HS.Node.prototype.generatesPower = function(){
	return false;
}

HS.Node.prototype.blocksPower = function(){
	return false;
}

HS.Node.prototype.isPowered = function(){
	var self = this;

	// to determine is a node is powered:
	// 1) does it generate power? return true
	// 2) does it block power? return false
	// 3) check children - if a child has isPowered()=true, return true
	// 4) return false

	if (self.generates_power) return true;
	if (self.blocksPower()) return false;



	var name = self.lname;


	// check for blocking power


	if (name == 'insulated'){
		return false;
	}

	if (name == 'upstream sense'){
		if (self.hasMatureUpstreamSalmon()){
			return false;
		}
	}

	if (name == 'downstream sense'){
		if (self.hasMatureDownstreamSalmon()){
			return false;
		}
	}


	if (name == 'sense'){
		if (self.hasMatureSalmon()){
			return false;
		}
	}

	if (name == 'young sense'){
		if (self.hasYoungSalmon()){
			return false;
		}
	}


	if (name == 'range sense'){
		if (self.hasMatureSalmon() || self.hasMatureSalmonUpstream()){
			return false;
		}
	}

	if (name == 'young range sense'){
		if (self.hasYoungSalmon() || self.hasYoungSalmonUpstream()){
			return false;
		}
	}


	if (name == 'switch'){
		if (!self.hasMatureSalmon()){
			return false;
		}
	}
	
	if (name == 'young switch'){
		if (!self.hasYoungSalmon()){
			return false;
		}
	}


	if (name == 'range switch'){
		if (!self.hasMatureSalmon() && !self.hasMatureSalmonUpstream()){
			return false;
		}
	}

	if (name == 'young range switch'){
		if (!self.hasYoungSalmon() && !self.hasYoungSalmonUpstream()){
			return false;
		}
	}


	// power invert is a special case

	if (name == 'power invert'){

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

HS.Node.prototype.canFishLeave = function(fish){
	var self = this;

	// TODO

	return true;
}

HS.Node.prototype.canFishEnter = function(fish){
	var self = this;

	// TODO

	return true;
}

HS.Node.prototype.fishEnters = function(fish){
	var self = this;

	// TODO

	self.salmon.unshift(fish);
}

// represents a salmon swiming through the river system

HS.Salmon = function(name){
	var self = this;
	self.name = name;
	self.age = null;
	self.direction = null;
	return self;
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

	var destroyed_by_snowmelt = {
		"hydro power"	: 1,
		"universe"	: 1,
		"oblivion"	: 1,
		"power invert"	: 1,
		"bridge"	: 1
	};

	self.postOrder(function(n){
		var name = n.lname;

		// special case - snowmelt starts the snow every tick
		if (name == 'snowmelt'){
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
		if (name == 'marshy'){
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

		if (name == 'force field' || name == 'evaporates' || name == 'lock'){
			if (n.is_powered){
				n.is_snowy = false;
				return;
			}
		}

		if (name == 'inverse lock'){
			if (!n.is_powered){
				n.is_snowy = false;
				return;
			}
		}

		if (name == '' && n.was_bridge){
			n.is_snowy = false;
			return;
		}


		// snowmelt spreads

		n.is_snowy = true;		

		if (name == 'universe'){
			self.endThisTick = true;
		}

		if (name == 'bridge'){
			n.was_bridge = true;
		}

		if (destroyed_by_snowmelt[name]){
			n.old_name = n.name;
			n.old_lname = n.lname;

			n.name = '';
			n.lname = '';
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
		var name = n.lname;

		// springs create water all by themselves
		if (n.isSpring()){
			n.is_watered = true;
			return;
		}

		// do any of the children of this node have water?
		var has_watered_children = false;
		for (var j=0; j<n.kids.length; j++){
			if (n.kids[j].is_watered){
				has_watered_children = true;
				break;
			}
		}

		// if we don't have any watered children, and we're not a spring,
		// we are not watered.
		if (!has_watered_children){
			n.is_watered = false;
			return;
		}


		// we have watered children, so check if we're a special water blocker
		if (name == 'force field' || name == 'evaporates'){
			if (n.is_powered){
				n.is_watered = false;
				return;
			}
		}

		if (name == '' && n.was_bridge){
			n.is_watered = false;
			return;
		}

		n.is_watered = true;
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

		var name = n.lname;

		var remain = [];

		for (var j=0; j<n.salmon.length; j++){
			var s = n.salmon[j];

			var can_move = s.direction == HS.const.DOWNSTREAM;
			if (can_move) can_move = n.canFishLeave(s);
			if (can_move && n.parent) can_move = n.parent.canFishEnter(s);

			if (can_move){
				if (n.parent){
					n.parent.fishEnters(s);
				}else{
					self.debug("salmon made it out to world: "+s.name);
				}
			}else{
				remain.push(s);
			}
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

	// TODO
}

HS.Program.prototype.fishTickHatch = function(){
	var self = this;
	self.debug('starting fish tick hatch #'+self.tickNum);

	// This tick activates hatcheries. It propagates in a pre-order fashion.

	// Hatchery, when powered, creates a mature, upstream salmon named "homeless". Operates
	// during the fish tick hatch step.

	self.preOrder(function(n){

		if (n.lname == 'hatchery' && n.isPowered()){
			var s = new HS.Salmon("homeless");
			s.age = HS.const.MATURE;
			s.direction = HS.const.UPSTREAM;

			n.salmon.unshift(s);
		}
	});
}

HS.Program.prototype.preOrder = function(callback){
	var self = this;

	for (var i=0; i<self.tree.nodes.length; i++){
		callback(self.tree.nodes[i]);
	}
}

HS.Program.prototype.postOrder = function(callback){
	var self = this;

	for (var i=self.tree.nodes.length-1; i>=0; i--){
		callback(self.tree.nodes[i]);
	}
}

HS.Program.prototype.dumpFish = function(){
	var self = this;

	self.preOrder(function(n){

		for (var j=0; j<n.salmon.length; j++){
			var s = n.salmon[j];

			var age = '?';
			var direction = '?';

			if (s.age == HS.const.YOUNG) age = 'young';
			if (s.age == HS.const.MATURE) age = 'mature';

			if (s.direction == HS.const.UPSTREAM) direction = 'upstream';
			if (s.direction == HS.const.DOWNSTREAM) direction = 'downstream';

			self.debug("node "+n.lname+": salmon \""+s.name+"\", "+age+", "+direction);
		}
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

	// TODO
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

HS.Nodes.insulated = {
	blocksPower : function(){ return true; }
};

HS.Nodes.upstream_sense = {
	blocksPower : function(){ return this.hasMatureUpstreamSalmon(); }
};

HS.Nodes.hydro_power = {
	generatesPower : function(){ return this.is_watered; }
};

HS.Nodes.powers = {
	generatesPower : function(){ return true; }
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

