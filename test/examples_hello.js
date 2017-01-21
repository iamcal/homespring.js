describe("examples: hello-*.hs", function(){

	it("runs hello-1.hs", function(){

		var p = test_example('hello-1.hs');

		p.onTerminate = function(){

			expect(p.tickNum).toBe(7);
			expect(p.output).toEqual(['Hello World!\n']);
		};

		p.onTestEnd = function(){

			expect(p.terminated).toBe(true);
		};

		p.test(10);
	});

	it("runs hello-2.hs", function(){

		var p = test_example('hello-2.hs');

		p.onTerminate = function(){

			expect(p.tickNum).toBe(10);
			expect(p.output).toEqual(['Hello World!\n']);
		};

		p.onTestEnd = function(){

			expect(p.terminated).toBe(true);
		};

		p.test(20);
	});

	it("runs hello-3.hs", function(){

		var p = test_example('hello-3.hs');

		p.onTerminate = function(){

			expect(p.tickNum).toBe(16);
			expect(p.output).toEqual(['Hello, World!\n']);
		};

		p.onTestEnd = function(){

			expect(p.terminated).toBe(true);
		};

		p.test(20);
	});

	it("runs hello-4.hs", function(){

		var p = test_example('hello-4.hs');

		p.onTerminate = function(){

			expect(p.tickNum).toBe(9);
			expect(p.output).toEqual(['hell', 'o ', 'world\n']);
		};

		p.onTestEnd = function(){

			expect(p.terminated).toBe(true);
		};

		p.test(10);
	});

});
