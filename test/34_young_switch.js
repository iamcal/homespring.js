describe("keyword: young switch", function(){

	// Blocks electricity unless young salmon are present

	it("blocks power with no salmon", function(){

		var p = new HS.Program('young. switch');

		expect(p.findFirstNode('young switch').blocksPower()).toBe(true);
	});

	it("blocks power with mature salmon", function(){

		var p = new HS.Program('young. switch');

		p.findFirstNode('young switch').fishEnters(new HS.Salmon(p, 'mu', HS.const.MATURE, HS.const.UPSTREAM));

		expect(p.findFirstNode('young switch').blocksPower()).toBe(true);
	});

	it("doesn't block power with young salmon", function(){

		var p = new HS.Program('young. switch');

		p.findFirstNode('young switch').fishEnters(new HS.Salmon(p, 'mu', HS.const.YOUNG, HS.const.UPSTREAM));

		expect(p.findFirstNode('young switch').blocksPower()).toBe(false);
	});

	it("doesn't block power with mixed salmon", function(){

		var p = new HS.Program('young. switch');

		p.findFirstNode('young switch').fishEnters(new HS.Salmon(p, 'mu', HS.const.YOUNG, HS.const.UPSTREAM));
		p.findFirstNode('young switch').fishEnters(new HS.Salmon(p, 'mu', HS.const.MATURE, HS.const.UPSTREAM));

		expect(p.findFirstNode('young switch').blocksPower()).toBe(false);
	});

});

