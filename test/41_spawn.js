describe("keyword: spawn", function(){

	// When powered, makes all salmon upstream spawn.

	it("spawns all upstream salmon", function(){

		var p = new HS.Program('spawn one two powers');

		var s1 = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, 'b', HS.const.MATURE, HS.const.UPSTREAM);
		var s3 = new HS.Salmon(p, 'c', HS.const.YOUNG, HS.const.DOWNSTREAM);
		var s4 = new HS.Salmon(p, 'd', HS.const.MATURE, HS.const.DOWNSTREAM);

		p.findFirstNode('spawn').fishEnters(s1);
		p.findFirstNode('one').fishEnters(s2);
		p.findFirstNode('one').fishEnters(s3);
		p.findFirstNode('two').fishEnters(s4);

		p.tick();

		expect(p.findFirstNode('spawn').containsSalmon(s3)).toBe(true);
		expect(p.findFirstNode('one').containsSalmon(s1)).toBe(true);
		expect(p.findFirstNode('one').containsSalmon(s4)).toBe(true);
		expect(p.findFirstNode('two').containsSalmon(s2)).toBe(true);

		expect(p.findFirstNode('spawn').salmon.length).toBe(2);
		expect(p.findFirstNode('one').salmon.length).toBe(4);
		expect(p.findFirstNode('two').salmon.length).toBe(2);

		expect(p.findFirstNode('spawn').salmon[0].name).toBe('spawn');
		expect(p.findFirstNode('spawn').salmon[1].name).toBe('c');

		expect(p.findFirstNode('one').salmon[0].name).toBe('one');
		expect(p.findFirstNode('one').salmon[1].name).toBe('one');
		expect(p.findFirstNode('one').salmon[2].name).toBe('a');
		expect(p.findFirstNode('one').salmon[3].name).toBe('d');

		expect(p.findFirstNode('two').salmon[0].name).toBe('two');
		expect(p.findFirstNode('two').salmon[1].name).toBe('b');
	});

	it("spawns nothing when unpowered", function(){

		var p = new HS.Program('spawn one two');

		var s1 = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, 'b', HS.const.MATURE, HS.const.UPSTREAM);
		var s3 = new HS.Salmon(p, 'c', HS.const.YOUNG, HS.const.DOWNSTREAM);
		var s4 = new HS.Salmon(p, 'd', HS.const.MATURE, HS.const.DOWNSTREAM);

		p.findFirstNode('spawn').fishEnters(s1);
		p.findFirstNode('one').fishEnters(s2);
		p.findFirstNode('one').fishEnters(s3);
		p.findFirstNode('two').fishEnters(s4);

		p.tick();

		expect(p.findFirstNode('spawn').containsSalmon(s3)).toBe(true);
		expect(p.findFirstNode('one').containsSalmon(s1)).toBe(true);
		expect(p.findFirstNode('one').containsSalmon(s4)).toBe(true);
		expect(p.findFirstNode('two').containsSalmon(s2)).toBe(true);

		expect(p.findFirstNode('spawn').salmon.length).toBe(1);
		expect(p.findFirstNode('one').salmon.length).toBe(2);
		expect(p.findFirstNode('two').salmon.length).toBe(1);
	});

	it("test program", function(){

		var code = "universe marshy spawn insulated hatchery powers spring     power. invert marshy marshy powers marshy marshy snowmelt";

		test_code_full(code, {
			'output' : {
				10 : [],
				11 : ['spring', 'homeless'],
				12 : ['spring', 'homeless', 'spring', 'homeless'],
				13 : ['spring', 'homeless', 'spring', 'homeless', 'spring', 'homeless'],
				14 : ['spring', 'homeless', 'spring', 'homeless', 'spring', 'homeless', 'spawn', 'spawn', 'spring', 'homeless'],
				15 : ['spring', 'homeless', 'spring', 'homeless', 'spring', 'homeless', 'spawn', 'spawn', 'spring', 'homeless', 'spawn', 'spawn', 'spawn', 'spawn', 'spring', 'homeless', 'insulated', 'insulated'],
			},
			'terminates' : 15,
		});

	});
});

