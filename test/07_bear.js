describe("keyword: bear", function(){

	// Eats mature salmon.

	it("eats mature upstream salmon", function(){

		var p = new HS.Program('foo bear bar');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);

		p.findFirstNode('foo').fishEnters(s);

		p.tick();
		expect(s.findNode()).toBe(null);
	});

	it("eats mature downstream salmon", function(){

		var p = new HS.Program('foo bear bar');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.DOWNSTREAM);

		p.findFirstNode('bar').fishEnters(s);

		p.tick();
		expect(s.findNode()).toBe(null);
	});

	it("does not eat young upstream salmon", function(){

		var p = new HS.Program('foo bear bar');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('foo').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('bear');
		p.tick();
		expect(s.findNode().name).toBe('bar');
	});

	it("does not eat young downstream salmon", function(){

		var p = new HS.Program('foo bear bar');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('bar').fishEnters(s);

		p.tick();
		expect(s.findNode().name).toBe('bear');
		p.tick();
		expect(s.findNode().name).toBe('foo');
	});
});

