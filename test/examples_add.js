describe("examples: add.hs", function(){

	// this program adds two_single digit_ numbers,
	// unless they are both 9 :)

	// results taken from the jneem interpreter


	function test_sum(a, b, out, ticks){

		var outp = {};
		outp[ticks] = ['? ', '+ '].concat(out);

		var p = test_example_full('add.hs', {
			'input' : {
				1 : a,
				93 : b,
			},
			'output' : outp,
			'terminates' : ticks,
		});


	}

	it("can add two small numbers", function(){

		test_sum('1', '2', ["3\n"], 217);
		test_sum('8', '8', ["16\n"], 243);
		test_sum('8', '9', ["17\n"], 245);
	});

	it("can add zero", function(){

		test_sum('0', '5', ["5\n"], 221);
		test_sum('0', '0', ["0\n"], 211);
	});

	it("can get confused with big numbers", function(){

		test_sum('9', '9', ["17\n", "17\n"], 246);
		test_sum('10' ,'7', ["16\n"], 243);
		test_sum('10', '11', ["17\n", "17\n"], 246);
	});
});

