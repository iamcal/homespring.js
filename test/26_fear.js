describe("keyword: fear", function(){

	// Very blocks salmon when powered.

	it("very blocks salmon when powered", function(){

		var p = new HS.Program('one fear two  powers');

		var s1 = new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, 'test', HS.const.YOUNG, HS.const.UPSTREAM);
		var s3 = new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.DOWNSTREAM);
		var s4 = new HS.Salmon(p, 'test', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('one').fishEnters(s1);
		p.findFirstNode('one').fishEnters(s2);
		p.findFirstNode('two').fishEnters(s3);
		p.findFirstNode('two').fishEnters(s4);

		p.tick();

		expect(s1.findNode().name).toBe('one');
		expect(s2.findNode().name).toBe('one');
		expect(s3.findNode().name).toBe('two');
		expect(s4.findNode().name).toBe('two');
	});

	it("allows salmon when unpowered", function(){

		var p = new HS.Program('one fear two');

		var s1 = new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, 'test', HS.const.YOUNG, HS.const.UPSTREAM);
		var s3 = new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.DOWNSTREAM);
		var s4 = new HS.Salmon(p, 'test', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('one').fishEnters(s1);
		p.findFirstNode('one').fishEnters(s2);
		p.findFirstNode('two').fishEnters(s3);
		p.findFirstNode('two').fishEnters(s4);

		p.tick();

		expect(s1.findNode().name).toBe('fear');
		expect(s2.findNode().name).toBe('fear');
		expect(s3.findNode().name).toBe('fear');
		expect(s4.findNode().name).toBe('fear');

		p.tick();

		expect(s1.findNode().name).toBe('two');
		expect(s2.findNode().name).toBe('two');
		expect(s3.findNode().name).toBe('one');
		expect(s4.findNode().name).toBe('one');		
	});
});

