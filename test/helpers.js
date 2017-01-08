
// helpers for writing tests

HS.Program.prototype.findFirstNode = function(name){

	for (var i=0; i<this.nodes.length; i++){

		if (this.nodes[i].lname == name) return this.nodes[i];
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

HS.Salmon.prototype.justSpawned = function(){
	var self = this;

	// When a salmon spawns, it becomes mature and its direction becomes downstream.
	// A new salmon is created at the current node. The new salmon is young,
	// downstream and its name is the name of the current node.

	if (self.age != HS.const.MATURE) return false;
	if (self.direction != HS.const.DOWNSTREAM) return false;

	var n = self.findNode();
	if (!n) return false;

	for (var i=0; i<n.salmon.length; i++){
		if (self == n.salmon[i]) continue;
		if (n.salmon[i].age != HS.const.YOUNG) continue;
		if (n.salmon[i].direction != HS.const.DOWNSTREAM) continue;
		if (n.salmon[i].name != self.name) continue;
		return true;
	}

	return false;
};
