describe("keyword: time", function(){

	// Makes all salmon mature.

	it("makes all salmon mature", function(){

		var p = new HS.Program('foo time bar');

		p.findFirstNode('foo').fishEnters(new HS.Salmon(p, 'mu', HS.const.MATURE, HS.const.UPSTREAM));
		p.findFirstNode('foo').fishEnters(new HS.Salmon(p, 'yu', HS.const.YOUNG, HS.const.UPSTREAM));

		p.findFirstNode('bar').fishEnters(new HS.Salmon(p, 'md', HS.const.MATURE, HS.const.DOWNSTREAM));
		p.findFirstNode('bar').fishEnters(new HS.Salmon(p, 'yd', HS.const.YOUNG, HS.const.DOWNSTREAM));

		p.tick();
		p.tick();

		expect(p.findFirstNode('foo').salmon[0].name).toBe('yd');
		expect(p.findFirstNode('foo').salmon[0].age).toBe(HS.const.MATURE);
		expect(p.findFirstNode('foo').salmon[0].direction).toBe(HS.const.DOWNSTREAM);

		expect(p.findFirstNode('foo').salmon[1].name).toBe('md');
		expect(p.findFirstNode('foo').salmon[1].age).toBe(HS.const.MATURE);
		expect(p.findFirstNode('foo').salmon[1].direction).toBe(HS.const.DOWNSTREAM);

		expect(p.findFirstNode('bar').salmon[0].name).toBe('yu');
		expect(p.findFirstNode('bar').salmon[0].age).toBe(HS.const.MATURE);
		expect(p.findFirstNode('bar').salmon[0].direction).toBe(HS.const.UPSTREAM);

		expect(p.findFirstNode('bar').salmon[1].name).toBe('mu');
		expect(p.findFirstNode('bar').salmon[1].age).toBe(HS.const.MATURE);
		expect(p.findFirstNode('bar').salmon[1].direction).toBe(HS.const.UPSTREAM);
	});

});

