describe("keyword: universe", function(){

	// If destroyed by a snowmelt, the program terminates. The program is terminated
	// in the miscellaneous tick following the snow tick in which the Universe is
	// destroyed.

	it("terminates program", function(){

		var p = new HS.Program('universe snowmelt');
		p.tick();

		expect(p.findFirstNode('universe').is_destroyed).toBe(false);

		p.snowTick();
		expect(p.findFirstNode('universe').is_destroyed).toBe(true);
		expect(p.endThisTick).toBe(false);

		p.miscTick();
		expect(p.endThisTick).toBe(true);
	});
});

