describe("keyword: append_up", function(){

	// For each downstream salmon that did not arrive from the first child, destroy
	// that salmon and append its name to each upstream salmon.

	it("appends names", function(){

		var p = new HS.Program('foo append. up first  second');

		var s1 = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);
		var s2 = new HS.Salmon(p, 'b', HS.const.YOUNG, HS.const.DOWNSTREAM);
		var s3 = new HS.Salmon(p, 'c', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('first').fishEnters(s1);
		p.findFirstNode('second').fishEnters(s2);
		p.findFirstNode('foo').fishEnters(s3);

		p.tick();

		expect(s1.name).toBe('a');
		expect(s2.dead).toBe(true);
		expect(s3.name).toBe('cb');
	});

	it("leaves first children untouched", function(){

		var p = new HS.Program('foo append. up first  second');

		var s1 = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('first').fishEnters(s1);

		p.tick();

		expect(s1.name).toBe('a');
		expect(s1.dead).toBe(false);
	});

	it("kills second children", function(){

		var p = new HS.Program('foo append. up first  second');

		var s2 = new HS.Salmon(p, 'b', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('second').fishEnters(s2);

		p.tick();

		expect(s2.dead).toBe(true);
	});

	it("test program one - single append", function(){

		var code = "universe hatchery powers append. up child1  bear hatchery powers child2     marshy marshy marshy marshy marshy snowmelt";

		test_code_full(code, {
			'output' : {
				9 : [],
				10 : ['child1', 'homeless'],
				11 : ['child1', 'homeless', 'child1', 'homeless'],
				12 : ['child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless'],
				13 : ['child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless'],
				14 : ['child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless'],
				15 : ['child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless', 'child1', 'homelesschild2'],
			},
			'terminates' : 15,
		});		
	});

	it("test program one - multi append", function(){

		var code = "universe hatchery powers append. up child1  bear hatchery powers child2    hatchery powers child3     marshy marshy marshy marshy marshy snowmelt";

		test_code_full(code, {
			'output' : {
				9 : [],
				10 : ['child1', 'homeless'],
				11 : ['child1', 'homeless', 'child1', 'homeless'],
				12 : ['child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless'],
				13 : ['child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless'],
				14 : ['child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless'],
				15 : ['child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless', 'child1', 'homeless', 'child1', 'homelesschild2child3'],
			},
			'terminates' : 15,
		});		
	});
});

