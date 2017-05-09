describe("feature: empty programs", function(){

	it("empty program is not a quine", function(){

		var p = new HS.Program('');

		var out = p.runSync();

		expect(p.terminated).toBe(true);
		expect(p.tickNum).toBe(0);
		expect(out).toBe("In Homespring, the null program is not a quine.\n");
	});
});

