describe("examples: hello*", function(){

	it("runs hello-1.hs", function(){

		var p = test_example('hello-1.hs', 10);

		p.onTerminate = function(){

			expect(p.tickNum).toBe(7);
			expect(p.output).toEqual(['Hello World!\n']);
		};

		p.test();
	});

});
