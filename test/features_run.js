describe("feature: execution", function(){

	describe("run() is async", function(){

		var p;

		beforeEach(function(done){
			p = new HS.Program('Universe bear hatchery Hello. World!.\n Powers   marshy marshy snowmelt');

			p.onTerminate = function(){
				done();
			};

			p.run();
			expect(p.terminated).toBe(false);
		});

		it("worked", function(){
			expect(p.terminated).toBe(true);
		});
	});

	describe("run() respects max_ticks", function(){

		var p;
		var log = [];

		beforeEach(function(done){
			p = new HS.Program('Universe bear hatchery Hello. World!.\n Powers   marshy marshy snowmelt');

			p.onTerminate = function(){
				done();
			};

			p.run(5);
			expect(p.terminated).toBe(false);
		});

		it("worked", function(){
			expect(p.terminated).toBe(true);
			expect(p.tickNum).toBe(5);
		});
	});

	it("runSync() is sync", function(){

		var p = new HS.Program('Universe bear hatchery Hello. World!.\n Powers   marshy marshy snowmelt');

		var out = p.runSync();

		expect(p.terminated).toBe(true);
		expect(out).toBe("Hello World!\n");
	});

	it("runSync() respects max_ticks", function(){

		var p = new HS.Program('Universe bear hatchery Hello. World!.\n Powers   marshy marshy snowmelt');

		var out = p.runSync(5);

		expect(p.terminated).toBe(true);
		expect(p.tickNum).toBe(5);
		expect(out).toBe("");
	});

	it("runSync() respects output callback", function(){

		var out_cb = [];

		var cb = function(str){
			out_cb.push(str);
		};

		var p = new HS.Program('Universe bear hatchery Hello. World!.\n Powers   marshy marshy snowmelt');

		p.onOutput = cb;

		var out = p.runSync();

		expect(p.terminated).toBe(true);
		expect(out).toBe("Hello World!\n");
		expect(p.onOutput).toBe(cb);
		expect(out_cb).toEqual(["Hello World!\n"]);
	});
});

