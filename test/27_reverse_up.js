describe("keyword: reverse_up", function(){

	// For each downstream salmon that arrived from the second child, move it to the
	// first child unless it is prevented from moving there.

	it("moves salmon from second child", function(){

		var p = new HS.Program('reverse. up one  two');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('two').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('one').containsSalmon(s)).toBe(true);
	});

	it("doesn't move salmon from first child", function(){

		var p = new HS.Program('reverse. up one  two');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('reverse up').containsSalmon(s)).toBe(true);
	});

	it("doesn't move salmon when no second child", function(){

		var p = new HS.Program('reverse. up one');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('reverse up').containsSalmon(s)).toBe(true);
	});

	it("doesn't move salmon when first child very blocks", function(){

		var p = new HS.Program('reverse. up pump  two');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('two').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('reverse up').containsSalmon(s)).toBe(true);
	});

	it("test program - allows reverse", function(){

		var code = "universe reverse. up one  hatchery powers two    marshy marshy marshy marshy snowmelt";

		test_code_full(code, {
			'output' : {
				10 : [],
				11 : ['one', 'one', 'two', 'homeless'],
			},
			'terminates' : 11,
		});

	});

	it("test program - blocks reverse", function(){

		var code = "universe reverse. up current one   youth. fountain hatchery powers two     marshy marshy marshy marshy marshy snowmelt";

		test_code_full(code, {
			'output' : {
				9 : [],
				10 : ['homeless', 'two'],
				11 : ['homeless', 'two', 'homeless', 'two'],
				12 : ['homeless', 'two', 'homeless', 'two', 'homeless', 'two'],
				13 : ['homeless', 'two', 'homeless', 'two', 'homeless', 'two', 'homeless', 'two'],
			},
			'terminates' : 13,
		});

	});
});

