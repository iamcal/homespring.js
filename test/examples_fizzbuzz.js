describe("examples: fizzbuzz-*.hs", function(){

	var solution_100 = '';
	for (var i=1; i<=100; i++){
		var f = i % 3 == 0, b = i % 5 == 0;
		solution_100 += f ? b ? "FizzBuzz\n" : "Fizz\n" : b ? "Buzz\n" : i + "\n";
	}

	it("runs fizzbuzz-1.hs", function(){

		test_example_full('fizzbuzz-1.hs', {
			'terminates' : 2207,
			'output' : {
				2207 : solution_100,
			}
		});
	});

	it("runs fizzbuzz-2.hs", function(){

		test_example_full('fizzbuzz-2.hs', {
			'terminates' : 2207,
			'output' : {
				2207 : solution_100,
			}
		});
	});

	it("runs fizzbuzz-3.hs", function(){

		test_example_full('fizzbuzz-3.hs', {
			'terminates' : 218,
			'output' : { 218 : [
				'FizzBuzz\n', 'tick\n', 'tick\n',
				'Fizz3\n', 'tick\n',
				'Buzz5\n',
				'Fizz6\n', 'tick\n', 'tick\n',
				'Fizz9\n',
				'Buzz10\n', 'tick\n',
				'Fizz12\n', 'tick\n', 'tick\n',
				'FizzBuzz15\n', 'tick\n', 'tick\n',
				'Fizz18\n', 'tick\n',
				'Buzz20\n',
				'Fizz21\n', 'tick\n', 'tick\n',
				'Fizz24\n',
				'Buzz25\n', 'tick\n',
				'Fizz27\n', 'tick\n', 'tick\n',
				'FizzBuzz30\n', 'tick\n', 'tick\n',
				'Fizz33\n', 'tick\n',
				'Buzz35\n',
				'Fizz36\n', 'tick\n', 'tick\n',
				'Fizz39\n',
				'Buzz40\n', 'tick\n',
				'Fizz42\n', 'tick\n', 'tick\n',

				'FizzBuzz\n', 'tick\n', 'tick\n',
				'Fizz3\n', 'tick\n',
				'Buzz5\n',
				'Fizz6\n', 'tick\n', 'tick\n',
				'Fizz9\n',
				'Buzz10\n', 'tick\n',
				'Fizz12\n', 'tick\n', 'tick\n',
				'FizzBuzz15\n', 'tick\n', 'tick\n',
				'Fizz18\n', 'tick\n',
				'Buzz20\n',
				'Fizz21\n', 'tick\n', 'tick\n',
				'Fizz24\n',
				'Buzz25\n', 'tick\n',
				'Fizz27\n', 'tick\n', 'tick\n',
				'FizzBuzz30\n', 'tick\n', 'tick\n',
				'Fizz33\n', 'tick\n',
				'Buzz35\n',
				'Fizz36\n', 'tick\n', 'tick\n',
				'Fizz39\n',
				'Buzz40\n', 'tick\n',
				'Fizz42\n', 'tick\n', 'tick\n',

				'FizzBuzz\n', 'tick\n', 'tick\n',
				'Fizz3\n', 'tick\n',
				'Buzz5\n',
				'Fizz6\n', 'tick\n', 'tick\n',
				'Fizz9\n',
				'Buzz10\n', 'tick\n',
				'Fizz12\n', 'tick\n', 'tick\n',
				'FizzBuzz15\n', 'tick\n', 'tick\n',
				'Fizz18\n', 'tick\n',
				'Buzz20\n',
				'Fizz21\n', 'tick\n', 'tick\n',
				'Fizz24\n',
				'Buzz25\n', 'tick\n',
				'Fizz27\n', 'tick\n', 'tick\n',
				'FizzBuzz30\n', 'tick\n', 'tick\n',
				'Fizz33\n', 'tick\n',
				'Buzz35\n',
				'Fizz36\n', 'tick\n', 'tick\n',
				'Fizz39\n',
				'Buzz40\n', 'tick\n',
				'Fizz42\n', 'tick\n', 'tick\n',

				'FizzBuzz\n', 'tick\n', 'tick\n',
				'Fizz3\n', 'tick\n',
				'Buzz5\n',
				'Fizz6\n', 'tick\n', 'tick\n',
				'Fizz9\n',
				'Buzz10\n', 'tick\n',
				'Fizz12\n', 'tick\n', 'tick\n',
				'FizzBuzz15\n', 'tick\n', 'tick\n',
				'Fizz18\n', 'tick\n',
				'Buzz20\n',
				'Fizz21\n', 'tick\n', 'tick\n',

			] },
		});
	});
});
