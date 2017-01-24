describe("keyword: hydro power", function(){

	// Creates electricity when watered. Can be destroyed by snowmelt.

	it("does nothing when not watered", function(){

		var p = new HS.Program('hydro. power insulated force. field powers');
		p.tick();

		expect(p.findFirstNode('force field').isPowered()).toBe(true);
		expect(p.findFirstNode('hydro power').is_watered).toBe(false);
		expect(p.findFirstNode('hydro power').isPowered()).toBe(false);
		expect(p.findFirstNode('hydro power').generates_power).toBe(false);
	});

	it("creates electricity when watered", function(){

		var p = new HS.Program('hydro. power insulated foo');
		p.tick();
		p.tick();
		p.tick();

		expect(p.findFirstNode('hydro power').is_watered).toBe(true);
		expect(p.findFirstNode('hydro power').isPowered()).toBe(true);
		expect(p.findFirstNode('hydro power').generates_power).toBe(true);
	});

	it("can be destroyed by snowmelt", function(){

		var p = new HS.Program('hydro. power snowmelt');
		p.tick();
		p.tick();

		expect(p.findFirstNode('hydro power').is_destroyed).toBe(true);
	});
});

