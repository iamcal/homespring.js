describe("examples: name.hs", function(){

	it("runs correctly", function(){

		var p = test_example('name.hs');

		p.onTickEnd = function(){
			if (p.tickNum == 27) expect(p.output).toEqual([]);
			if (p.tickNum == 28) expect(p.output).toEqual(['']);
			if (p.tickNum == 29) expect(p.output).toEqual(['', '', 'Great']);
			if (p.tickNum == 30) expect(p.output).toEqual(['', '', 'Great', '', 'Great']);
			if (p.tickNum == 31) expect(p.output).toEqual(['', '', 'Great', '', 'Great', '', 'Great']);
			if (p.tickNum == 32) expect(p.output).toEqual(['', '', 'Great', '', 'Great', '', 'Great', '', 'Great']);
			if (p.tickNum == 33) expect(p.output).toEqual(['', '', 'Great', '', 'Great', '', 'Great', '', 'Great', 'homeless', 'Great']);
			if (p.tickNum == 34) expect(p.output).toEqual(['', '', 'Great', '', 'Great', '', 'Great', '', 'Great', 'homeless', 'Great', 'homeless', 'Great']);
		};

		p.test(34);

		expect(p.tickNum).toBe(34);
		expect(p.terminated).toBe(false);
	});
});
