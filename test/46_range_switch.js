describe("keyword: range switch", function(){

	// Blocks electricity unless mature salmon are here or upstream.

	it("doesn't block electicity with mature salmon", function(){

		var p = new HS.Program('foo range. switch powers');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);

		p.tick();
		p.findFirstNode('range switch').fishEnters(s);

		expect(p.findFirstNode('foo').isPowered()).toBe(true);
	});

	it("doesn't block electicity with mixed salmon", function(){

		var p = new HS.Program('foo range. switch powers');
		var s1 = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.tick();
		p.findFirstNode('range switch').fishEnters(s1);
		p.findFirstNode('range switch').fishEnters(s2);

		expect(p.findFirstNode('foo').isPowered()).toBe(true);
	});

	it("blocks electicity with young salmon", function(){

		var p = new HS.Program('foo range. switch powers');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);

		p.tick();
		p.findFirstNode('range switch').fishEnters(s);

		expect(p.findFirstNode('foo').isPowered()).toBe(false);
	});

	it("blocks electicity with no salmon", function(){

		var p = new HS.Program('foo range. switch powers');

		p.tick();
		expect(p.findFirstNode('foo').isPowered()).toBe(false);
	});

	it("doesn't block electicity with mature salmon in upstream nodes", function(){

		var p = new HS.Program('foo range. switch powers');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);

		p.tick();
		p.findFirstNode('powers').fishEnters(s);

		expect(p.findFirstNode('foo').isPowered()).toBe(true);
	});

	it("doesn't block electicity with mixed salmon in upstream nodes", function(){

		var p = new HS.Program('foo range. switch powers');
		var s1 = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.tick();
		p.findFirstNode('powers').fishEnters(s1);
		p.findFirstNode('powers').fishEnters(s2);

		expect(p.findFirstNode('foo').isPowered()).toBe(true);
	});

	it("blocks electicity with young salmon in upstream nodes", function(){

		var p = new HS.Program('foo range. switch powers');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);

		p.tick();
		p.findFirstNode('powers').fishEnters(s);

		expect(p.findFirstNode('foo').isPowered()).toBe(false);
	});

	it("blocks electicity with no salmon in upstream nodes", function(){

		var p = new HS.Program('foo range. switch powers');

		p.tick();
		expect(p.findFirstNode('foo').isPowered()).toBe(false);
	});
});

