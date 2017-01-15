
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
