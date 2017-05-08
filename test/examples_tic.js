describe("examples: tic.hs", function(){

	function make_board(str){
		// turns '123456789' into the board that shows that
		var a = str.split('');
		return [
			a[0]+"|", a[1]+"|", (a[2]==' '?'':a[2])+"\n",
			"-----\n",
			a[3]+"|", a[4]+"|", (a[5]==' '?'':a[5])+"\n",
			"-----\n",
			a[6]+"|", a[7]+"|", (a[8]==' '?'':a[8])+"\n"
		];
	}

	function make_boards(a){
		var out = [];
		for (var i=0; i<a.length; i++){
			var b = make_board(a[i]);
			out = out.concat(b);
		}
		return out;
	}

	it("runs correctly", function(){

		var p = test_example_full('tic.hs', {
			'input' : {
				1 : '1',
				256 : '2',
				511 : '5',
				766 : '9',
				1021 : '10',
				1276 : '32'
			},
			'output' : {
				255  : make_boards(['o        ']),
				510  : make_boards(['o        ', 'ox       ']),
				765  : make_boards(['o        ', 'ox       ', 'ox  o    ']),
				1020 : make_boards(['o        ', 'ox       ', 'ox  o    ', 'ox  o   x']),
				1275 : make_boards(['o        ', 'ox       ', 'ox  o    ', 'ox  o   x', 'ox  o   x']),
				1530 : make_boards(['o        ', 'ox       ', 'ox  o    ', 'ox  o   x', 'ox  o   x', 'ox  o   x'])
			},
			'run' : 1531
		});
	});

});

