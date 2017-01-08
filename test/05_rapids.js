describe("keyword: rapids", function(){

	// Young salmon take two turns to pass through.

	it("slows young upstream salmon", function(){

		var p = new HS.Program('foo rapids bar');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('foo').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('rapids');
		p.tick();
		expect(s.findNode().name).toBe('rapids');
		p.tick();
		expect(s.findNode().name).toBe('bar');
	});

	it("slows young downstream salmon", function(){

		var p = new HS.Program('foo rapids bar');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('bar').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('rapids');
		p.tick();
		expect(s.findNode().name).toBe('rapids');
		p.tick();
		expect(s.findNode().name).toBe('foo');
	});

	it("does not slow mature upstream salmon", function(){

		var p = new HS.Program('foo rapids bar');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);

		p.findFirstNode('foo').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('rapids');
		p.tick();
		expect(s.findNode().name).toBe('bar');
	});

	it("does not slow mature downstream salmon", function(){

		var p = new HS.Program('foo rapids bar');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.DOWNSTREAM);

		p.findFirstNode('bar').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('rapids');
		p.tick();
		expect(s.findNode().name).toBe('foo');
	});
});

