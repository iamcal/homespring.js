describe("examples: count-*.hs", function(){

	var count_out = '';
	for (var i=1; i<=100; i++) count_out += i + "\n";

	it("runs count-1.hs", function(){

		var p = test_example('count-1.hs');

		p.test(100);

		expect(p.terminated).toBe(true);
		expect(p.tickNum).toBe(39);
		expect(p.output.join('')).toEqual(count_out);
	});

	it("runs count-5.hs", function(){

		var p = test_example('count-5.hs');

		p.test(100);

		expect(p.terminated).toBe(true);
		expect(p.tickNum).toBe(39);
		expect(p.output.join('')).toEqual(count_out);
	});

	it("runs count-6.hs", function(){

		var p = test_example('count-6.hs');

		p.test(100);

		expect(p.terminated).toBe(true);
		expect(p.tickNum).toBe(51);
		expect(p.output.join('')).toEqual(count_out);
	});

});
