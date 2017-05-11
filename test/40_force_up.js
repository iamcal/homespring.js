describe("keyword: force_up", function(){

	// For each downstream salmon that arrived from the second child, move it to the
	// first child unless it is prevented from moving there.
	// Also blocks upstream salmon from moving to the first child

	it("moves salmon from second child", function(){

		var p = new HS.Program('force. up one  two');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('two').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('one').containsSalmon(s)).toBe(true);
	});

	it("doesn't move salmon from first child", function(){

		var p = new HS.Program('force. up one  two');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('force up').containsSalmon(s)).toBe(true);
	});

	it("doesn't move salmon when no second child", function(){

		var p = new HS.Program('force. up one');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('force up').containsSalmon(s)).toBe(true);
	});

	it("doesn't move salmon when first child very blocks", function(){

		var p = new HS.Program('force. up pump  two');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('two').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('force up').containsSalmon(s)).toBe(true);
	});

	it("blocks upstream salmon from first child", function(){

		var p = new HS.Program('force. up one  two');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('force up').fishEnters(s);

		p.tick();

		expect(s.findNode().name).toBe('two');
	});
});

