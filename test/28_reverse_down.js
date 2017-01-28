describe("keyword: reverse_down", function(){

	// For each downstream salmon that arrived from the first child, move it to the
	// second child unless it is prevented from moving there.

	it("moves salmon from first child", function(){

		var p = new HS.Program('reverse. down one  two');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('two').containsSalmon(s)).toBe(true);
	});

	it("doesn't move salmon from second child", function(){

		var p = new HS.Program('reverse. down one  two');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('two').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('reverse down').containsSalmon(s)).toBe(true);
	});

	it("doesn't move salmon when no second child", function(){

		var p = new HS.Program('reverse. down one');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('reverse down').containsSalmon(s)).toBe(true);
	});

	it("doesn't move salmon when second child very blocks", function(){

		var p = new HS.Program('reverse. down one pump');

		var s = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('one').fishEnters(s);

		p.tick();

		expect(p.findFirstNode('reverse down').containsSalmon(s)).toBe(true);
	});

	it("test program - allows reverse", function(){

		var code = "universe reverse. down hatchery powers one    two  marshy marshy marshy marshy snowmelt";

		test_code_full(code, {
			'output' : {
				10 : [],
				11 : ['two', 'two', 'one', 'homeless'],
			},
			'terminates' : 11,
		});

	});

	it("test program - blocks reverse", function(){

		var code = "universe reverse. down youth. fountain hatchery powers one     current two   marshy marshy marshy marshy marshy snowmelt";

		test_code_full(code, {
			'output' : {
				9 : [],
				10 : ['homeless', 'one'],
				11 : ['homeless', 'one', 'homeless', 'one'],
				12 : ['homeless', 'one', 'homeless', 'one', 'homeless', 'one'],
				13 : ['homeless', 'one', 'homeless', 'one', 'homeless', 'one', 'homeless', 'one'],
			},
			'terminates' : 13,
		});

	});
});

