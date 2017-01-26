describe("examples: cat.hs", function(){

	it("runs correctly", function(){

		// tick n+0 : input tick creates new salmon
		// tick n+1 : fish swims up to \n nodes
		// tick n+2 : fish spawns
		// tick n+3 : fish swims downstream
		// tick n+4 : fish wims into ocean

		test_example_full('cat.hs', {
			'run' : 20,
			'input' : {
				5 : 'hello',
				12 : 'world',
			},
			'output' : {
				8 : [],
				9 : ['hello', '\n'],
				15 : ['hello', '\n'],
				16 : ['hello', '\n', 'world', '\n'],
			},
		});
	});
});
