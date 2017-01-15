describe("keyword: insulated", function(){

	// Blocks power.

	it("blocks power", function(){

		var p = new HS.Program('foo insulated powers');

		p.tick();

		expect(p.findFirstNode('insulated').isPowered()).toBe(false);
		expect(p.findFirstNode('foo').isPowered()).toBe(false);
	});
});

