describe("keyword: sense", function(){

	// Blocks electricity when mature salmon are present.

	it("blocks electicity with mature salmon", function(){

		var p = new HS.Program('foo sense powers');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);

		p.findFirstNode('sense').fishEnters(s);

		p.tick();
		expect(p.findFirstNode('foo').isPowered()).toBe(false);
	});

	it("blocks electicity with mixed salmon", function(){

		var p = new HS.Program('foo sense powers');

		var s1 = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);
		p.findFirstNode('sense').fishEnters(s1);

		var s2 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.DOWNSTREAM);
		p.findFirstNode('sense').fishEnters(s2);

		p.tick();
		expect(p.findFirstNode('foo').isPowered()).toBe(false);
	});

	it("doesn't block electicity with young salmon", function(){

		var p = new HS.Program('foo sense powers');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('sense').fishEnters(s);

		p.tick();
		expect(p.findFirstNode('foo').isPowered()).toBe(true);
	});

	it("doesn't block electicity with no salmon", function(){

		var p = new HS.Program('foo sense powers');

		p.tick();
		expect(p.findFirstNode('foo').isPowered()).toBe(true);
	});


});

