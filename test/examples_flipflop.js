describe("examples: flipflop.hs", function(){

	it("runs correctly with blank input", function(){

		var p = test_example_full('flipflop.hs', {
			'output' : {
				34 : [],
				35 : ['o'],

				69 : ['o'],
				70 : ['o', 'x'],

				104 : ['o', 'x'],
				105 : ['o', 'x', 'o'],
			},
			'input' : {
				1 : '',
				36 : '',
				71 : '',
			},
			'run' : 110,
		});
	});

	it("runs correctly with string input", function(){

		var p = test_example_full('flipflop.hs', {
			'output' : {
				34 : [],
				35 : ['Ao'],

				69 : ['Ao'],
				70 : ['Ao', 'Bx'],

				104 : ['Ao', 'Bx'],
				105 : ['Ao', 'Bx', 'Co'],
			},
			'input' : {
				1 : 'A',
				36 : 'B',
				71 : 'C',
			},
			'run' : 110,
		});
	});
});
