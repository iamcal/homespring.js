describe("keyword: split", function(){

	// Splits each salmon into a new salmon for each letter in the original salmon's
	// name. The original salmon are destroyed.

	it("splits", function(){

		var p = new HS.Program('foo split bar');

		var s1 = new HS.Salmon(p, 'abc', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('bar').fishEnters(s1);

		p.tick();

		var n = p.findFirstNode('split');

		expect(n.salmon.length).toBe(3);
		expect(n.salmon[0].name).toBe('a');
		expect(n.salmon[1].name).toBe('b');
		expect(n.salmon[2].name).toBe('c');
	});

});

