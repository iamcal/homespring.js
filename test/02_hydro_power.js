describe("keyword: hydro power", function(){

	// Creates electricity when watered. Can be destroyed by snowmelt.

	it("does nothing when not watered", function(){

		var p = new HS.Program('hydro. power insulated force. field powers');
		p.tick();

		expect(p.findFirstNode('force field').isPowered()).toBe(true);
		expect(p.findFirstNode('hydro power').is_watered).toBe(false);
		expect(p.findFirstNode('hydro power').isPowered()).toBe(false);
	});

	it("creates electricity when watered", function(){

		var p = new HS.Program('hydro. power insulated foo');
		p.tick();

		expect(p.findFirstNode('hydro power').is_watered).toBe(true);
		expect(p.findFirstNode('hydro power').isPowered()).toBe(true);
	});

	it("can be destroyed by snowmelt", function(){

		var p = new HS.Program('hydro. power snowmelt');
		p.tick();

		expect(p.findFirstNode('hydro power')).toBe(null);
	});
});

