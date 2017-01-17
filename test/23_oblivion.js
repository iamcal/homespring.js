describe("keyword: oblivion", function(){

	// When powered, changes the name of each salmon to "". Can be destroyed by
	// snowmelt.

	it("changes names when powered", function(){

		var p = new HS.Program('foo oblivion powers');

		var s = new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.DOWNSTREAM);
		p.findFirstNode('powers').fishEnters(s);

		p.tick();
		p.tick();

		expect(p.findFirstNode('oblivion').isPowered()).toBe(true);
		expect(p.findFirstNode('foo').containsSalmon(s)).toBe(true);
		expect(s.name).toBe("");
	});

	it("doesn't change names when unpowered", function(){

		var p = new HS.Program('foo oblivion bar');

		var s = new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.DOWNSTREAM);
		p.findFirstNode('bar').fishEnters(s);

		p.tick();
		p.tick();

		expect(p.findFirstNode('oblivion').isPowered()).toBe(false);
		expect(p.findFirstNode('foo').containsSalmon(s)).toBe(true);
		expect(s.name).toBe('test');
	});

	it("doesn't change names when destroyed", function(){

		var p = new HS.Program('foo oblivion snowmelt bar');

		var s = new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.DOWNSTREAM);
		p.findFirstNode('bar').fishEnters(s);

		p.tick();
		p.tick();
		p.tick();

		expect(p.findFirstNode('oblivion').is_destroyed).toBe(true);
		expect(p.findFirstNode('foo').containsSalmon(s)).toBe(true);
		expect(s.name).toBe('test');
	});


});

