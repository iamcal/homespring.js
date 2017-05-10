describe("keyword: downstream sense", function(){

	// Blocks the flow of electricity when downstream, mature salmon are present.

	it("blocks electicity with mature downstream salmon", function(){

		var p = new HS.Program('foo downstream. sense powers');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.DOWNSTREAM);

		p.tick();
		p.findFirstNode('downstream sense').fishEnters(s);

		expect(p.findFirstNode('foo').isPowered()).toBe(false);
	});

	it("blocks electicity with mixed salmon (1/2)", function(){

		var p = new HS.Program('foo downstream. sense powers');
		var s1 = new HS.Salmon(p, '', HS.const.MATURE, HS.const.DOWNSTREAM);
		var s2 = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);

		p.tick();
		p.findFirstNode('downstream sense').fishEnters(s1);
		p.findFirstNode('downstream sense').fishEnters(s2);

		expect(p.findFirstNode('foo').isPowered()).toBe(false);
	});

	it("blocks electicity with mixed salmon (2/2)", function(){

		var p = new HS.Program('foo downstream. sense powers');
		var s1 = new HS.Salmon(p, '', HS.const.MATURE, HS.const.DOWNSTREAM);
		var s2 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.tick();
		p.findFirstNode('downstream sense').fishEnters(s1);
		p.findFirstNode('downstream sense').fishEnters(s2);

		expect(p.findFirstNode('foo').isPowered()).toBe(false);
	});

	it("doesn't block electicity with young salmon", function(){

		var p = new HS.Program('foo downstream. sense powers');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.tick();
		p.findFirstNode('downstream sense').fishEnters(s);

		expect(p.findFirstNode('foo').isPowered()).toBe(true);
	});

	it("doesn't block electicity with upstream salmon", function(){

		var p = new HS.Program('foo downstream. sense powers');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);

		p.tick();
		p.findFirstNode('downstream sense').fishEnters(s);

		expect(p.findFirstNode('foo').isPowered()).toBe(true);
	});

	it("doesn't block electicity with no salmon", function(){

		var p = new HS.Program('foo downstream. sense powers');

		p.tick();
		expect(p.findFirstNode('foo').isPowered()).toBe(true);
	});


});

