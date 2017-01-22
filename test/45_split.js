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

	it("test program - split one", function(){

		var p = new HS.Program('foo split bear hatchery powers abc     universe marshy marshy marshy marshy snowmelt');

		var output = [];
		p.onOutput = function(str){ output.push(str); }

		for (var i=0; i<20; i++) p.tick();

		expect(p.terminated).toBe(true);
		expect(p.tickNum).toBe(10);
		expect(output).toEqual(['c', 'b', 'a']);
	});

	it("test program - split two", function(){

		var p = new HS.Program('foo split bear hatchery powers abc     bear hatchery powers def     universe marshy marshy marshy marshy snowmelt');

		var output = [];
		p.onOutput = function(str){ output.push(str); }

		for (var i=0; i<20; i++) p.tick();

		expect(p.terminated).toBe(true);
		expect(p.tickNum).toBe(10);
		expect(output).toEqual(['c', 'b', 'a', 'f', 'e', 'd']);
	});
});

