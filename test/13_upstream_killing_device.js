describe("keyword: upstream killing device", function(){

	// When powered and if it contains more than one child, kills all the salmon in the
	// last child.


	it("kills nobody when unpowered", function(){
		var p = new HS.Program('upstream. killing. device one  two  three');

		var s1 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);
		var s3 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('one').fishEnters(s1);
		p.findFirstNode('two').fishEnters(s2);
		p.findFirstNode('three').fishEnters(s3);

		p.tick();
		expect(s1.dead).toBe(false);
		expect(s2.dead).toBe(false);
		expect(s3.dead).toBe(false);
	});

	it("kills nobody with one child", function(){
		var p = new HS.Program('upstream. killing. device powers');

		var s1 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('powers').fishEnters(s1);
		p.findFirstNode('powers').fishEnters(s2);

		p.tick();
		expect(s1.dead).toBe(false);
	});

	it("kills last child with two childen", function(){
		var p = new HS.Program('upstream. killing. device powers  two');

		var s1 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);
		var s3 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);
		var s4 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('powers').fishEnters(s1);
		p.findFirstNode('powers').fishEnters(s2);
		p.findFirstNode('two').fishEnters(s3);
		p.findFirstNode('two').fishEnters(s4);

		p.tick();
		expect(s1.dead).toBe(false);
		expect(s2.dead).toBe(false);
		expect(s3.dead).toBe(true);
		expect(s4.dead).toBe(true);
	});

	it("kills last child with multiple childen", function(){

		var p = new HS.Program('upstream. killing. device powers  two  three  four');

		var s1 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);
		var s2 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);
		var s3 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);
		var s4 = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('powers').fishEnters(s1);
		p.findFirstNode('two').fishEnters(s2);
		p.findFirstNode('three').fishEnters(s3);
		p.findFirstNode('four').fishEnters(s4);

		p.tick();
		expect(s1.dead).toBe(false);
		expect(s2.dead).toBe(false);
		expect(s3.dead).toBe(false);
		expect(s4.dead).toBe(true);
	});
});

