describe("keyword: shallows", function(){

	// Mature salmon take two turns to pass through.

	it("slows mature upstream salmon", function(){

		var p = new HS.Program('foo shallows bar');
		var s = new HS.Salmon('', HS.const.MATURE, HS.const.UPSTREAM);

		p.findFirstNode('foo').fishEnters(s);

		p.tick();
		expect(p.findFirstNode('shallows').containsSalmon(s)).toBe(true);
		p.tick();
		expect(p.findFirstNode('shallows').containsSalmon(s)).toBe(true);
		p.tick();
		expect(p.findFirstNode('bar').containsSalmon(s)).toBe(true);
	});

	it("slows mature downstream salmon", function(){

		var p = new HS.Program('foo shallows bar');
		var s = new HS.Salmon('', HS.const.MATURE, HS.const.DOWNSTREAM);

		p.findFirstNode('bar').fishEnters(s);

		p.tick();
		expect(p.findFirstNode('shallows').containsSalmon(s)).toBe(true);
		p.tick();
		expect(p.findFirstNode('shallows').containsSalmon(s)).toBe(true);
		p.tick();
		expect(p.findFirstNode('foo').containsSalmon(s)).toBe(true);
	});

	it("does not slow young upstream salmon", function(){

		// TODO
		expect(true).toBe(false);
	});

	it("does not slow young downstream salmon", function(){

		// TODO
		expect(true).toBe(false);
	});
});

