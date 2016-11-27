describe("keyword: snowmelt", function(){

	// Creates a snowmelt at the end of each snow tick.

	it("creates a snowmelt", function(){

		var p = new HS.Program('foo snowmelt');

		p.tick();
		expect(p.findFirstNode('foo').is_snowy).toBe(true);
	});

	it("operates at the end of the snow tick", function(){

		// TODO
		// this seems weirdly worded - the entire snow tick is about snow
		// propogation and a snowmelt node should be first/early.
	});
});

