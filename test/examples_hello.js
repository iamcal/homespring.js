describe("examples: hello*", function(){

	it("runs hello-1.hs", function(){

		var p = test_example('hello-1.hs', 10);

		p.onTerminate = function(){

			expect(p.tickNum).toBe(7);
			expect(p.output).toEqual(['Hello World!\n']);
		};

		p.test();
	});

	it("runs hello-2.hs", function(){

		var p = test_example('hello-2.hs', 20);

		p.onTerminate = function(){

			expect(p.tickNum).toBe(10);
			expect(p.output).toEqual(['Hello World!\n']);
		};

		p.test();
	});

	it("runs hello-3.hs", function(){

		var p = test_example('hello-3.hs', 20);

		p.onTerminate = function(){

			expect(p.tickNum).toBe(16);
			expect(p.output).toEqual(['Hello, World!\n']);
		};

		p.test();
	});

	it("runs hello-4.hs", function(){

		var p = test_example('hello-4.hs', 10);

		p.onTerminate = function(){

			expect(p.tickNum).toBe(9);
			expect(p.output).toEqual(['hell', 'o ', 'world\n']);
		};

		p.test();
	});

});
