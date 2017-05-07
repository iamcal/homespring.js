describe("tree builder", function(){

	it("builds a simple tree", function(){

		var p = new HS.Program('a b c');
		expect(p.findFirstNode('a').dumpChildren()).toBe('b');
		expect(p.findFirstNode('b').dumpChildren()).toBe('c');
		expect(p.findFirstNode('c').dumpChildren()).toBe('');
	});

	it("builds a branching tree", function(){

		var p = new HS.Program('a b  c');
		expect(p.findFirstNode('a').dumpChildren()).toBe('b,c');
		expect(p.findFirstNode('b').dumpChildren()).toBe('');
		expect(p.findFirstNode('c').dumpChildren()).toBe('');
	});

	it("throws when the tree backtracks too far in strict mode", function(){

		expect(function(){

			var p = new HS.Program('a  b', {
				'strictMode' : true
			});

		}).toThrow();

		expect(function(){

			var p = new HS.Program('a b   c', {
				'strictMode' : true
			});

		}).toThrow();
	});

	it("inserts a blank child when the tree backtracks too far in non-strict mode", function(){

		// creates a tree "a" -> "" -> "b"

		var p = new HS.Program('a  b');
		expect(p.findFirstNode('a').dumpChildren()).toBe('');
		expect(p.findFirstNode('').dumpChildren()).toBe('b');
	});

});

