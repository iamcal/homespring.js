
// helpers for writing tests

HS.Program.prototype.findFirstNode = function(name){

	for (var i=0; i<this.tree.nodes.length; i++){

		if (this.tree.nodes[i].name.toLowerCase() == name) return this.tree.nodes[i];
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
