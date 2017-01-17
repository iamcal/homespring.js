describe("keyword: switch", function(){

	// Blocks electricity unless mature salmon are present

	it("blocks power with no salmon", function(){

		var p = new HS.Program('switch');

		expect(p.findFirstNode('switch').blocksPower()).toBe(true);
	});

	it("blocks power with young salmon", function(){

		var p = new HS.Program('switch');

		p.findFirstNode('switch').fishEnters(new HS.Salmon(p, 'mu', HS.const.YOUNG, HS.const.UPSTREAM));

		expect(p.findFirstNode('switch').blocksPower()).toBe(true);
	});

	it("doesn't block power with mature salmon", function(){

		var p = new HS.Program('switch');

		p.findFirstNode('switch').fishEnters(new HS.Salmon(p, 'mu', HS.const.MATURE, HS.const.UPSTREAM));

		expect(p.findFirstNode('switch').blocksPower()).toBe(false);
	});

	it("doesn't block power with mixed salmon", function(){

		var p = new HS.Program('switch');

		p.findFirstNode('switch').fishEnters(new HS.Salmon(p, 'mu', HS.const.YOUNG, HS.const.UPSTREAM));
		p.findFirstNode('switch').fishEnters(new HS.Salmon(p, 'mu', HS.const.MATURE, HS.const.UPSTREAM));

		expect(p.findFirstNode('switch').blocksPower()).toBe(false);
	});

});

