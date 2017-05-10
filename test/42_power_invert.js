describe("keyword: power invert", function(){

	// This node is powered if and only if none of its children are powered. Can be
	// destroyed by snowmelt.

	it("is powered when one child is", function(){

		var p = new HS.Program('power. invert powers  two  three');

		p.tick();

		expect(p.findFirstNode('power invert').isPowered()).toBe(false);
	});

	it("is not powered when multiple children are", function(){

		var p = new HS.Program('power. invert powers  powers  powers');

		p.tick();

		expect(p.findFirstNode('power invert').isPowered()).toBe(false);
	});

	it("is powered when no children are", function(){

		var p = new HS.Program('power. invert one  two  three');

		p.tick();

		expect(p.findFirstNode('power invert').isPowered()).toBe(true);
	});

	it("can be destroyed", function(){

		var p = new HS.Program('power. invert snowmelt');

		p.tick();
		p.tick();

		expect(p.findFirstNode('power invert').is_destroyed).toBe(true);
	});

	it("doesn't affect power once destroyed", function(){

		var p = new HS.Program('power. invert snowmelt  powers');

		p.tick();

		expect(p.findFirstNode('power invert').is_destroyed).toBe(false);
		expect(p.findFirstNode('power invert').isPowered()).toBe(false);

		p.tick();

		expect(p.findFirstNode('power invert').is_destroyed).toBe(true);
		expect(p.findFirstNode('power invert').isPowered()).toBe(true);
	});



});

