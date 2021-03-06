describe("keyword: net", function(){

	// Very blocks mature salmon.

	it("very blocks mature salmon", function(){

		var p = new HS.Program('one net two');

		var s1 = new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.DOWNSTREAM);

		p.findFirstNode('one').fishEnters(s1);
		p.findFirstNode('two').fishEnters(s2);

		p.tick();

		expect(s1.findNode().name).toBe('one');
		expect(s2.findNode().name).toBe('two');
	});

	it("allows young salmon", function(){

		var p = new HS.Program('one net two');

		var s1 = new HS.Salmon(p, 'test', HS.const.YOUNG, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, 'test', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('one').fishEnters(s1);
		p.findFirstNode('two').fishEnters(s2);

		p.tick();

		expect(s1.findNode().name).toBe('net');
		expect(s2.findNode().name).toBe('net');
	});
});

