describe("keyword: evaporates", function(){

	// Blocks water and snowmelt when powered.

	it("blocks water when powered", function(){

		var p = new HS.Program('evaporates spring  powers');

		p.tick();
		p.tick();

		expect(p.findFirstNode('evaporates').isPowered()).toBe(true);
		expect(p.findFirstNode('evaporates').is_watered).toBe(false);
	});

	it("doesn't block water when unpowered", function(){

		var p = new HS.Program('evaporates spring');

		p.tick();
		p.tick();

		expect(p.findFirstNode('evaporates').isPowered()).toBe(false);
		expect(p.findFirstNode('evaporates').is_watered).toBe(true);
	});

	it("blocks snowmelt when powered", function(){

		var p = new HS.Program('evaporates snowmelt  powers');

		p.tick();
		p.tick();

		expect(p.findFirstNode('evaporates').isPowered()).toBe(true);
		expect(p.findFirstNode('evaporates').is_snowy).toBe(false);
	});

	it("doesn't block snowmelt when unpowered", function(){

		var p = new HS.Program('evaporates snowmelt');

		p.tick();
		p.tick();

		expect(p.findFirstNode('evaporates').isPowered()).toBe(false);
		expect(p.findFirstNode('evaporates').is_snowy).toBe(true);
	});
});

