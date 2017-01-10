describe("keyword: snowmelt", function(){

	// Creates a snowmelt at the end of each snow tick.

	it("creates a snowmelt", function(){

		var p = new HS.Program('foo snowmelt');

		p.tick();
		p.tick();
		expect(p.findFirstNode('foo').is_snowy).toBe(true);
	});

	it("operates at the end of the snow tick", function(){

		// this seems weirdly worded - the entire snow tick is about snow
		// propogation. it seems that it's really saying that snowmelt at
		// the head of a stream will run after the stream it's own, since
		// we're running pre-order.

		var p = new HS.Program('foo snowmelt');

		p.tick();
		expect(p.findFirstNode('foo').is_snowy).toBe(false);
		p.tick();
		expect(p.findFirstNode('foo').is_snowy).toBe(true);
	});
});

