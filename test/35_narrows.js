describe("keyword: narrows", function(){

	// Very blocks salmon if another salmon is present.

	it("blocks second salmon (static test)", function(){

		var p = new HS.Program('narrows');

		var s1 = new HS.Salmon(p, 'test1', HS.const.YOUNG, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, 'test2', HS.const.YOUNG, HS.const.UPSTREAM);

		expect(p.findFirstNode('narrows').canFishEnter(s1)).toBe(true);

		p.findFirstNode('narrows').fishEnters(s1);

		expect(p.findFirstNode('narrows').canFishEnter(s2)).toBe(false);
	});

	it("blocks second salmon (dynamic test)", function(){

		var p = new HS.Program('foo narrows bar');

		var s1 = new HS.Salmon(p, 'test1', HS.const.YOUNG, HS.const.DOWNSTREAM);
		var s2 = new HS.Salmon(p, 'test2', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('bar').fishEnters(s1);
		p.findFirstNode('bar').fishEnters(s2);

		p.tick();

		expect(p.findFirstNode('bar').containsSalmon(s1)).toBe(true);
		expect(p.findFirstNode('narrows').containsSalmon(s2)).toBe(true);

		p.tick();

		expect(p.findFirstNode('narrows').containsSalmon(s1)).toBe(true);
		expect(p.findFirstNode('foo').containsSalmon(s2)).toBe(true);
	});
});

