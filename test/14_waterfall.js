describe("keyword: waterfall", function(){

	// Blocks upstream salmon.

	it("blocks upstream salmon", function(){
		var p = new HS.Program('one waterfall two');

		var s1 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);

		p.findFirstNode('one').fishEnters(s1);
		p.findFirstNode('one').fishEnters(s2);

		p.tick();
		p.tick();

		expect(s1.findNode().name).toBe('waterfall');
		expect(s2.findNode().name).toBe('waterfall');
	});

	it("doesn't block downstream salmon", function(){
		var p = new HS.Program('one waterfall two');

		var s1 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.DOWNSTREAM);
		var s2 = new HS.Salmon(p, '', HS.const.MATURE, HS.const.DOWNSTREAM);

		p.findFirstNode('two').fishEnters(s1);
		p.findFirstNode('two').fishEnters(s2);

		p.tick();
		p.tick();

		expect(s1.findNode().name).toBe('one');
		expect(s2.findNode().name).toBe('one');
	});
});

