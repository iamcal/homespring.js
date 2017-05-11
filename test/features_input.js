describe("feature: input", function(){

	// If any input is available on the terminal, an upstream, mature fish is created at
	// the mouth of the river with the input text as its name.

	it("no input means no fish", function(){

		var p = new HS.Program('one two');
		p.input = null;

		p.tick();

		expect(p.nodes[0].salmon.length).toBe(0);
	});

	it("input turns into fish", function(){

		var p = new HS.Program('one two');
		p.input = 'hello';

		p.tick();

		expect(p.nodes[0].salmon.length).toBe(1);
		expect(p.nodes[0].salmon[0].name).toBe('hello');
		expect(p.nodes[0].salmon[0].age).toBe(HS.const.MATURE);
		expect(p.nodes[0].salmon[0].direction).toBe(HS.const.UPSTREAM);
	});

	it("blank string input works", function(){

		var p = new HS.Program('one two');
		p.input = '';

		p.tick();

		expect(p.nodes[0].salmon.length).toBe(1);
		expect(p.nodes[0].salmon[0].name).toBe('');
		expect(p.nodes[0].salmon[0].age).toBe(HS.const.MATURE);
		expect(p.nodes[0].salmon[0].direction).toBe(HS.const.UPSTREAM);
	});
});

