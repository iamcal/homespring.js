describe("keyword: force down", function(){

	// For each downstream salmon that arrived from the first child, move it to the
	// second child unless it is prevented from moving there.
	// Also blocks upstream salmon from moving to the last child.

	it("moves salmon from first child", function(){

		var p = new HS.Program('force. down one  two');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('two').containsSalmon(s)).toBe(true);
	});

	it("doesn't move salmon from second child", function(){

		var p = new HS.Program('force. down one  two');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('two').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('force down').containsSalmon(s)).toBe(true);
	});

	it("doesn't move salmon when no second child", function(){

		var p = new HS.Program('force. down one');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('force down').containsSalmon(s)).toBe(true);
	});

	it("doesn't move salmon when second child very blocks", function(){

		var p = new HS.Program('force. down one pump');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('force down').containsSalmon(s)).toBe(true);
	});

	it("blocks upstream salmon from last child", function(){

		var p = new HS.Program('force. down one  two');

		var s = new HS.Salmon(p, 'two', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('force down').fishEnters(s);

		p.tick();

		expect(s.findNode().name).toBe('one');
	});
});

