describe("examples: simple.hs", function(){

	it("runs correctly", function(){

		// tick n+0 : input tick creates new salmon
		// tick n+1 : fish spawns
		// tick n+2 : fish wims into ocean

		test_example_full('simple.hs', {
			'run' : 20,
			'input' : {
				5 : 'hello',
				12 : 'world',
			},
			'output' : {
				6 : [],
				7 : ['', 'hello'],
				13 : ['', 'hello'],
				14 : ['', 'hello', '', 'world'],
			},
		});
	});
});
