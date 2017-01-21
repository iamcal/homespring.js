describe("examples: null.hs", function(){

	it("runs correctly", function(){

		var p = test_example('null.hs');

		p.test(10);

		expect(p.tickNum).toBe(0);
		expect(p.terminated).toBe(true);
		expect(p.output).toEqual(['In Homespring, the null program is not a quine.\n']);
	});
});
