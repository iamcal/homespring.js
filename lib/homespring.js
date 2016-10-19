
var HS = {};

HS.Exception = function(message){
	this.message = message;
	this.name = "HS.Exception";
}

HS.Program = function(source){
	var self = this;

	self.tokens = self.tokenize(source);
	self.tree = self.build_tree(self.tokens);

	self.tickNum = 0;
	self.endThisTick = false;

	return self;
}

HS.Program.prototype.build_tree = function(tokens){

	if (!tokens.length) return null;

	var c = 1;

	var root = new HS.Node(c++, tokens[0]);
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
			var n = new HS.Node(c++, tokens[i], current);
			nodes.push(n);
			current = n;
		}
	}

	return {
		'root'	: root,
		'nodes'	: nodes
	};
}

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
	self.parent = parent;
	self.kids = [];
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

	return HS.Program.prototype.reservedList[self.name.toLowerCase()] ? false : true;
}

HS.Node.prototype.isPowered = function(){
	var self = this;

	// to determine is a node is powered:
	// 1) does it generate power? return true
	// 2) does it block power? return false
	// 3) check children - if a child has isPowered()=true, return true
	// 4) return false

	if (self.generates_power) return true;

	var name = self.name.toLowerCase();


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


// represents a salmon swiming through the river system

HS.Salmon = function(){
	var self = this;
	self.name = name;
	self.age = null;
	self.direction = null;
	return self;
}


HS.Program.prototype.tokenize = function(str){

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
				console.log('parser error - unexpected period followewd by ' + chars[i+1]);
				return [];
			}
		}else{
			next += chars[i];
		}
	}
	if (next.length) tokens.push(next);

	return tokens;
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
	console.log('starting snow tick #'+self.tickNum);

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

	for (var i=self.tree.nodes.length-1; i>=0; i--){
		var n = self.tree.nodes[i];
		var name = n.name.toLowerCase();

		// special case - snowmelt starts the snow every tick
		if (name == 'snowmelt'){
			n.is_snowy = true;
			continue;
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
			continue;
		}


		// if none of the children are snowy, we can't be snowy
		if (!has_snowy_children){
			n.is_snowy = false;
			continue;
		}

		// at least one child is snowy, determine if this node is
		// currently blocking snowmelt

		if (name == 'force field' || name == 'evaporates' || name == 'lock'){
			if (n.is_powered){
				n.is_snowy = false;
				continue;
			}
		}

		if (name == 'inverse lock'){
			if (!n.is_powered){
				n.is_snowy = false;
				continue;
			}
		}

		if (name == '' && n.was_bridge){
			n.is_snowy = false;
			continue;
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
			n.name = '';
		}
	}
}

HS.Program.prototype.waterTick = function(){
	var self = this;
	console.log('starting water tick #'+self.tickNum);

	// In the water tick, the water state of each node is updated. A node becomes
	// watered if it is not currently blocking water and if one of its children is watered.
	// The water tick is propagated in a post-order fashion.

	for (var i=self.tree.nodes.length-1; i>=0; i--){
		var n = self.tree.nodes[i];
		var name = n.name.toLowerCase();

		// springs create water all by themselves
		if (n.isSpring()){
			n.is_watered = true;
			continue;
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
			continue;
		}


		// we have watered children, so check if we're a special water blocker
		if (name == 'force field' || name == 'evaporates'){
			if (n.is_powered){
				n.is_watered = false;
				continue;
			}
		}

		if (name == '' && n.was_bridge){
			n.is_watered = false;
			continue;
		}

		n.is_watered = true;
	}
}

HS.Program.prototype.powerTick = function(){
	var self = this;
	console.log('starting power tick #'+self.tickNum);

	for (var i=0; i<self.tree.nodes.length; i++){
		var n = self.tree.nodes[i];
		var name = n.name.toLowerCase();

		n.generates_power = false;

		if (name == 'hydro power'){
			if (n.is_watered){
				n.generates_power = true;
			}
			continue;
		}

		if (name == 'powers'){
			n.generates_power = true;
			continue;
		}
	}
}

HS.Program.prototype.fishTick = function(){
	var self = this;
	console.log('starting fish tick #'+self.tickNum);

	// TODO
}

HS.Program.prototype.miscTick = function(){
	var self = this;
	console.log('starting misc tick #'+self.tickNum);

	if (self.endThisTick){
		console.log('program exits!');
	}

	// TODO
}

HS.Program.prototype.inputTick = function(){
	var self = this;
	console.log('starting input tick #'+self.tickNum);

	// TODO
}

HS.Program.prototype.tickSnow = function(){
	var self = this;
	self.tick();

	for (var i=0; i<self.tree.nodes.length; i++){
		var n = self.tree.nodes[i];
		if (n.name == 'marshy'){
			console.log(n.name+' -> '+(n.is_snowy ? 'YES' : '-')+(n.prev_snow ? ' / (YES)' : ' / (-)'));
		}else{
			console.log(n.name+' -> '+(n.is_snowy ? 'YES' : '-'));
		}
	}
}

HS.Program.prototype.tickWater = function(){
	var self = this;
	self.tick();

	for (var i=0; i<self.tree.nodes.length; i++){
		var n = self.tree.nodes[i];
		console.log(n.name+' -> '+(n.is_watered ? 'YES' : '-'));
	}
}
