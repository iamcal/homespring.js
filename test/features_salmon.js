describe("feature: salmon", function(){

	// This part of the fish tick only affects downstream salmon. Each downstream
	// salmon is moved to the parent of its current node if it is not blocked from doing
	// so. If its current node is the mouth of the river, the salmon is removed from the
	// river system and its name is printed to the terminal.
	// This tick propagates in a pre-order fashion.

	it("down tick - downstream fish move to parent node when not blocked", function(){

		var p = new HS.Program('one two');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('two').fishEnters(s);

		p.tick();

		expect(s.findNode().name).toBe('one');
	});

	it("down tick - downstream fish stay put when blocked", function(){

		var p = new HS.Program('one pump two');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('two').fishEnters(s);

		p.tick();

		expect(s.findNode().name).toBe('two');
	});

	it("down tick - fish gets output when it reaches the ocean", function(){

		var p = new HS.Program('one two');
		var s = new HS.Salmon(p, 'test', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('two').fishEnters(s);

		var out = p.runSync(5);

		expect(s.dead).toBe(true);
		expect(out).toBe('test');
	});


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


	it("up tick - moves towards named node (first)", function(){

		var p = new HS.Program('one two  three');
		var s = new HS.Salmon(p, 'two', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('two');
	});

	it("up tick - moves towards named node (non-first)", function(){

		var p = new HS.Program('one two  three');
		var s = new HS.Salmon(p, 'three', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('three');
	});

	it("up tick - moves towards named node (deep)", function(){

		var p = new HS.Program('one two three   four five  six');
		var s = new HS.Salmon(p, 'six', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('four');

		p.tick();
		expect(s.findNode().name).toBe('six');
	});

	it("up tick - moves towards first non-blocked match", function(){

		var p = new HS.Program('one pump target   two  three target');
		var s = new HS.Salmon(p, 'target', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('three');

		p.tick();
		expect(s.findNode().name).toBe('target');
	});

	it("up tick - moves into first child", function(){

		var p = new HS.Program('one two  three');
		var s = new HS.Salmon(p, 'test', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('two');
	});

	it("up tick - moves into first allowed child", function(){

		var p = new HS.Program('one pump two   three  four');
		var s = new HS.Salmon(p, 'test', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('three');
	});

	it("up tick - spawns if unable to move", function(){

		var p = new HS.Program('one');
		var s = new HS.Salmon(p, 'test', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('one');

		expect(s.direction).toBe(HS.const.DOWNSTREAM);
		expect(s.age).toBe(HS.const.MATURE);

		expect(p.nodes[0].salmon.length).toBe(2);
		expect(p.nodes[0].salmon[1]).toBe(s);

		var s2 = p.nodes[0].salmon[0];
		expect(s2.direction).toBe(HS.const.DOWNSTREAM);
		expect(s2.age).toBe(HS.const.YOUNG);
		expect(s2.name).toBe('one');
	});

	it("up tick - spawns if name matches", function(){

		var p = new HS.Program('one two');
		var s = new HS.Salmon(p, 'one', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('one');
		expect(s.direction).toBe(HS.const.DOWNSTREAM);
		expect(s.age).toBe(HS.const.MATURE);
	});
});

