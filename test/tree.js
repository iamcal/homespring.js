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

	it("throws when the tree backtracks too far", function(){

		expect(function(){

			var p = new HS.Program('a  b');

		}).toThrow();

		expect(function(){

			var p = new HS.Program('a b   c');

		}).toThrow();
	});

});

