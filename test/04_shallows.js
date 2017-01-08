describe("keyword: shallows", function(){

	// Mature salmon take two turns to pass through.

	it("slows mature upstream salmon", function(){

		var p = new HS.Program('foo shallows bar');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);

		p.findFirstNode('foo').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('shallows');
		p.tick();
		expect(s.findNode().name).toBe('shallows');
		p.tick();
		expect(s.findNode().name).toBe('bar');
	});

	it("slows mature downstream salmon", function(){

		var p = new HS.Program('foo shallows bar');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.DOWNSTREAM);

		p.findFirstNode('bar').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('shallows');
		p.tick();
		expect(s.findNode().name).toBe('shallows');
		p.tick();
		expect(s.findNode().name).toBe('foo');
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

