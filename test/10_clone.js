describe("keyword: clone", function(){

	// For each salmon, create a young, downstream salmon with the same name.

	it("clones the current salmon", function(){

		var p = new HS.Program('clone');
		var n = p.findFirstNode('clone');

		n.fishEnters(new HS.Salmon(p, 'mu', HS.const.MATURE, HS.const.UPSTREAM));
		n.fishEnters(new HS.Salmon(p, 'yd', HS.const.YOUNG, HS.const.DOWNSTREAM));
		// they get inserted in reverse order!

		p.miscTick();

		expect(n.salmon.length).toBe(4);

		expect(n.salmon[2].name).toBe('yd');
		expect(n.salmon[2].age).toBe(HS.const.YOUNG);
		expect(n.salmon[2].direction).toBe(HS.const.DOWNSTREAM);

		expect(n.salmon[3].name).toBe('mu');
		expect(n.salmon[3].age).toBe(HS.const.YOUNG);
		expect(n.salmon[3].direction).toBe(HS.const.DOWNSTREAM);
	});


	// test programs were calibrated against jneem's ocaml version,
	// including test the age of the output fish.

	it("test program one", function(){

		var p = new HS.Program('universe clone time bear hatchery powers one.\n   hatchery powers two.\n    marshy marshy marshy the snowmelt');

		var output = [];
		p.onOutput = function(str, f){
			str += f.age == HS.const.YOUNG ? ':young' : ':mature';
			output.push(str);
		}

		for (var i=0; i<20; i++) p.tick();

		expect(p.terminated).toBe(true);
		expect(p.tickNum).toBe(11);
		expect(output).toEqual(['one\n:young', 'two\n:young', 'one\n:mature', 'two\n:mature']);
	});

	it("test program two", function(){

		var p = new HS.Program('universe bear clone time bear hatchery powers one.\n   hatchery powers two.\n    marshy marshy marshy marsh snowmelt');

		var output = [];
		p.onOutput = function(str, f){
			str += f.age == HS.const.YOUNG ? ':young' : ':mature';
			output.push(str);
		}

		for (var i=0; i<20; i++) p.tick();

		expect(p.terminated).toBe(true);
		expect(p.tickNum).toBe(12);
		expect(output).toEqual(['two\n:young', 'one\n:young']);
	});
});

