describe("examples: first.hs", function(){

	it("runs correctly", function(){

		var p = test_example('first.hs');

		p.onTickEnd = function(){
			// from tick 6 onwards, we expect a string to be output
			if (p.tickNum >= 6){
				expect(p.output).toEqual(['Hello, world.\n']);
				p.output = [];
			}
		}

		p.test(10);

		expect(p.tickNum).toBe(10);
		expect(p.terminated).toBe(false);
	});
});
