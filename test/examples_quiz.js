describe("examples: quiz.hs", function(){

	it("runs with correct answer", function(){

		var p = test_example('quiz.hs');

		p.onTickEnd = function(){
			if (p.tickNum == 23){
				expect(p.output).toEqual([]);
			}
			if (p.tickNum == 24){
				expect(p.output).toEqual(['what\'s six times four? ']);
				p.input = '24';
			}
			if (p.tickNum == 36){
				expect(p.output).toEqual(['what\'s six times four? ', 'rightyo!\n']);
			}
		};

		p.test(100);

		expect(p.tickNum).toBe(36);
		expect(p.terminated).toBe(true);
	});

	it("runs with incorrect numeric answer", function(){

		var p = test_example('quiz.hs');

		p.onTickEnd = function(){
			if (p.tickNum == 23){
				expect(p.output).toEqual([]);
			}
			if (p.tickNum == 24){
				expect(p.output).toEqual(['what\'s six times four? ']);
				p.input = '25';
			}
			if (p.tickNum == 53){
				expect(p.output).toEqual(['what\'s six times four? ', 'you lie!\n']);
			}
		};

		p.test(100);

		expect(p.tickNum).toBe(53);
		expect(p.terminated).toBe(true);
	});

	it("runs with incorrect string answer", function(){

		var p = test_example('quiz.hs');

		p.onTickEnd = function(){
			if (p.tickNum == 23){
				expect(p.output).toEqual([]);
			}
			if (p.tickNum == 24){
				expect(p.output).toEqual(['what\'s six times four? ']);
				p.input = 'pidgeon';
			}
			if (p.tickNum == 53){
				expect(p.output).toEqual(['what\'s six times four? ', 'you lie!\n']);
			}
		};

		p.test(100);

		expect(p.tickNum).toBe(53);
		expect(p.terminated).toBe(true);
	});
});
