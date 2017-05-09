describe("feature: debugging", function(){

	it("nodes return good state information", function(){

		var p = new HS.Program("Universe bear hatchery Hello. World!.\n Powers   marshy marshy snowmelt");
		p.runSync(20);

		expect(p.nodes[0].toString()).toBe('Universe:destroyed:p:s:w');
		expect(p.nodes[1].toString()).toBe('bear:p:s:w');
		expect(p.nodes[2].toString()).toBe('hatchery:p:w');
		expect(p.nodes[3].toString()).toBe('Hello World!\\n:w');
		expect(p.nodes[4].toString()).toBe('Powers:P:p');
		expect(p.nodes[5].toString()).toBe('marshy:s');
		expect(p.nodes[6].toString()).toBe('marshy:s');
		expect(p.nodes[7].toString()).toBe('snowmelt:s');


		var p2 = new HS.Program("insulated force. field powers");
		p2.tick();

		expect(p2.nodes[0].toString()).toBe('insulated:BP');
		expect(p2.nodes[1].toString()).toBe('force field:p:BW:BS');
		expect(p2.nodes[2].toString()).toBe('powers:P:p');
	});
});

