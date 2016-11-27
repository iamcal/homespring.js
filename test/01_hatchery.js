describe("keyword: hatchery", function(){

	// When powered, creates a mature, upstream salmon named "homeless". Operates
	// during the fish tick hatch step.

	it("does nothing when not powered", function(){

		var p = new HS.Program('hatchery');
		p.tick();

		var node = p.findFirstNode('hatchery');
		expect(node.isPowered()).toBe(false);
		expect(node.salmon.length).toBe(0);
	});

	it("creates a mature, upstream salmon named \"homeless\" when powered", function(){

		var p = new HS.Program('hatchery powers');
                p.tick();

		var node = p.findFirstNode('hatchery');
		expect(node.isPowered()).toBe(true);
		expect(node.salmon.length).toBe(1);

		var salmon = node.salmon[0];
		expect(salmon.name).toBe("homeless");
		expect(salmon.age).toBe(HS.const.MATURE);
		expect(salmon.direction).toBe(HS.const.UPSTREAM);
	});

});

