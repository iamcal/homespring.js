describe("keyword: append_down", function(){

	// For each downstream salmon that did not arrive from the first child, destroy
	// that salmon and append its name to each downstream salmon that did arrive
	// from the first child.

	it("appends names", function(){

		var p = new HS.Program('append. down first  second');

		var s1 = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);
		var s2 = new HS.Salmon(p, 'b', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('first').fishEnters(s1);
		p.findFirstNode('second').fishEnters(s2);

		p.tick();

		expect(s1.name).toBe('ab');
		expect(s2.dead).toBe(true);
	});

	it("leaves first children untouched", function(){

		var p = new HS.Program('append. down first  second');

		var s1 = new HS.Salmon(p, 'a', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('first').fishEnters(s1);

		p.tick();

		expect(s1.name).toBe('a');
		expect(s1.dead).toBe(false);
	});

	it("kills second children", function(){

		var p = new HS.Program('append. down first  second');

		var s2 = new HS.Salmon(p, 'b', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('second').fishEnters(s2);

		p.tick();

		expect(s2.dead).toBe(true);
	});

	it("test program one - two children", function(){

		var p = new HS.Program('universe append. down bear hatchery powers abc     bear hatchery powers def     marshy marshy marshy my snowmelt');

		var output = [];
		p.onOutput = function(str){ output.push(str); }

		for (var i=0; i<20; i++) p.tick();

		expect(p.terminated).toBe(true);
		expect(p.tickNum).toBe(10);
		expect(output).toEqual(['abcdef']);
	});

	it("test program two - two children with two fish each", function(){

		var p = new HS.Program('universe append. down first bear hatchery powers abc     bear hatchery powers def      second bear hatchery powers hij     bear hatchery powers klm      marshy marshy marshy marshy snowmelt');

		var output = [];
		p.onOutput = function(str){ output.push(str); }

		for (var i=0; i<20; i++) p.tick();

		expect(p.terminated).toBe(true);
		expect(p.tickNum).toBe(11);
		expect(output).toEqual(['defhijklm', 'abchijklm']);
	});
});

