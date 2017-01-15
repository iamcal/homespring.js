describe("keyword: powers", function(){

	// Generates power.

	it("generates power", function(){

		var p = new HS.Program('foo powers bar');
		p.tick();

		expect(p.findFirstNode('foo').isPowered()).toBe(true);
		expect(p.findFirstNode('powers').isPowered()).toBe(true);
		expect(p.findFirstNode('bar').isPowered()).toBe(false);

		expect(p.findFirstNode('powers').generates_power).toBe(true);
	});
});

