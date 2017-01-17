describe("keyword: bird", function(){

	// Eats young salmon.

	it("eats young upstream salmon", function(){

		var p = new HS.Program('foo bird bar');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('foo').fishEnters(s);

		p.tick();
		expect(s.findNode()).toBe(null);
	});

	it("eats young downstream salmon", function(){

		var p = new HS.Program('foo bird bar');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('bar').fishEnters(s);

		p.tick();
		expect(s.findNode()).toBe(null);
	});

	it("does not eat mature upstream salmon", function(){

		var p = new HS.Program('foo bird bar');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);

		p.findFirstNode('foo').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('bird');
		p.tick();
		expect(s.findNode().name).toBe('bar');
	});

	it("does not eat mature downstream salmon", function(){

		var p = new HS.Program('foo bird bar');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.DOWNSTREAM);

		p.findFirstNode('bar').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('bird');
		p.tick();
		expect(s.findNode().name).toBe('foo');
	});
});

