describe("examples: clock.hs", function(){

	it("runs correctly", function(){

		var p = test_example_full('clock.hs', {
			'output' : {
				14 : [],
				15 : ['X'],
				16 : ['X', 'X'],
				22 : ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'y\n'],
				30 : ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'y\n',
				      'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'y\n'],
				38 : ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'y\n',
				      'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'y\n',
				      'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'y\n'],
				46 : ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'y\n',
				      'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'y\n',
				      'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'y\n',
				      'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'y\n'],
				53 : ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'y\n',
				      'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'y\n',
				      'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'y\n',
				      'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'y\n',
				      'X', 'X', 'X', 'X', 'X', 'X', 'X'],
			},
			'terminates' : 53,
		});
	});
});
