describe("keyword: marshy", function(){

	// Snowmelts take two turns to pass through.

	it("slows down snowmelt", function(){

		var p = new HS.Program('foo marshy snowmelt');

		p.tick();
		expect(p.findFirstNode('marshy').is_snowy).toBe(false);
		expect(p.findFirstNode('foo').is_snowy).toBe(false);

		p.tick();
		expect(p.findFirstNode('marshy').is_snowy).toBe(false);
		expect(p.findFirstNode('marshy').prev_snow).toBe(true);
		expect(p.findFirstNode('foo').is_snowy).toBe(false);

		p.tick();
		expect(p.findFirstNode('marshy').is_snowy).toBe(true);
		expect(p.findFirstNode('foo').is_snowy).toBe(false);

		p.tick();
		expect(p.findFirstNode('marshy').is_snowy).toBe(true);
		expect(p.findFirstNode('foo').is_snowy).toBe(true);
	});
});

