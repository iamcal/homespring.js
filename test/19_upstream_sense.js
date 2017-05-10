describe("keyword: upstream sense", function(){

	// Blocks the flow of electricity when upstream, mature salmon are present.

	it("blocks electicity with mature upstream salmon", function(){

		var p = new HS.Program('foo upstream. sense powers');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);

		p.tick();
		p.findFirstNode('upstream sense').fishEnters(s);

		expect(p.findFirstNode('foo').isPowered()).toBe(false);
	});

	it("blocks electicity with mixed salmon (1/2)", function(){

		var p = new HS.Program('foo upstream. sense powers');
		var s1 = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, '', HS.const.MATURE, HS.const.DOWNSTREAM);

		p.tick();
		p.findFirstNode('upstream sense').fishEnters(s1);
		p.findFirstNode('upstream sense').fishEnters(s2);

		expect(p.findFirstNode('foo').isPowered()).toBe(false);
	});

	it("blocks electicity with mixed salmon (2/2)", function(){

		var p = new HS.Program('foo upstream. sense powers');
		var s1 = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);

		p.tick();
		p.findFirstNode('upstream sense').fishEnters(s1);
		p.findFirstNode('upstream sense').fishEnters(s2);

		expect(p.findFirstNode('foo').isPowered()).toBe(false);
	});

	it("doesn't block electicity with young salmon", function(){

		var p = new HS.Program('foo upstream. sense powers');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);

		p.tick();
		p.findFirstNode('upstream sense').fishEnters(s);

		expect(p.findFirstNode('foo').isPowered()).toBe(true);
	});

	it("doesn't block electicity with downstream salmon", function(){

		var p = new HS.Program('foo upstream. sense powers');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.DOWNSTREAM);

		p.tick();
		p.findFirstNode('upstream sense').fishEnters(s);

		expect(p.findFirstNode('foo').isPowered()).toBe(true);
	});

	it("doesn't block electicity with no salmon", function(){

		var p = new HS.Program('foo upstream. sense powers');

		p.tick();
		expect(p.findFirstNode('foo').isPowered()).toBe(true);
	});


});

