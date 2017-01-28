describe("keyword: young_bear", function(){

	// Eats every other mature salmon (the first mature salmon gets eaten, the second
	// one doesn't, etc.). Young salmon are moved to the beginning of the list because
	// they don't have to take the time to evade the bear.

	it("eats every other mature salmon and re-orders", function(){

		var p = new HS.Program('young. bear');

		var s1 = new HS.Salmon(p, 'y_a', HS.const.YOUNG, HS.const.DOWNSTREAM);
		var s2 = new HS.Salmon(p, 'y_b', HS.const.YOUNG, HS.const.DOWNSTREAM);
		var s3 = new HS.Salmon(p, 'm_a', HS.const.MATURE, HS.const.DOWNSTREAM);
		var s4 = new HS.Salmon(p, 'm_b', HS.const.MATURE, HS.const.DOWNSTREAM);
		var s5 = new HS.Salmon(p, 'm_c', HS.const.MATURE, HS.const.DOWNSTREAM);
		var s6 = new HS.Salmon(p, 'm_d', HS.const.MATURE, HS.const.DOWNSTREAM);

		p.root.fishEnters(s1);
		p.root.fishEnters(s2);
		p.root.fishEnters(s3);
		p.root.fishEnters(s4);
		p.root.fishEnters(s5);
		p.root.fishEnters(s6);

		p.miscTick();

		// the order of fish in the node before the tick is 6,5,4,3,2,1
		// after filtering out young, we have 6,5,4,3
		// the spec says the first gets eaten, but in fact the second does
		// so we filter down to 6,4 (5 & 3 are killed)
		// the young ones go at the top of the list, so we're left with 2,1,6,4

		expect(p.root.salmon[0]).toBe(s2);
		expect(p.root.salmon[1]).toBe(s1);
		expect(p.root.salmon[2]).toBe(s6);
		expect(p.root.salmon[3]).toBe(s4);

		expect(s3.dead).toBe(true);
		expect(s5.dead).toBe(true);
	});

	it("test program", function(){

		var code = "universe young. bear hatchery powers one    hatchery powers two   hatchery powers three   marshy marshy marshy snowmelt";

		test_code_full(code, {
			'output' : {
				8 : [],
				9 : ['homeless', 'one', 'two'],
				10 : ['homeless', 'one', 'two', 'homeless', 'homeless', 'one', 'three', 'two'],
				11 : ['homeless', 'one', 'two', 'homeless', 'homeless', 'one', 'three', 'two', 'homeless', 'homeless', 'one', 'three', 'two'],
			},
			'terminates' : 11,
		});

	});
});

