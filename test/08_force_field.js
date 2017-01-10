describe("keyword: force field", function(){

	// Blocks water, snowmelt and salmon when powered.

	it("blocks salmon when powered", function(){

		// young/upstream
		var p = new HS.Program('foo force. field powers');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);

		p.findFirstNode('foo').fishEnters(s);
		p.tick();
		expect(s.findNode().name).toBe('force field');
		p.tick();
		expect(s.findNode().name).toBe('force field');
		expect(s.justSpawned).toBe(true);


		// mature/upstream
		var p = new HS.Program('foo force. field powers');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);

		p.findFirstNode('foo').fishEnters(s);
		p.tick();
		expect(s.findNode().name).toBe('force field');
		p.tick();
		expect(s.findNode().name).toBe('force field');
		expect(s.justSpawned).toBe(true);


		// young/downstream
		var p = new HS.Program('foo force. field powers');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.DOWNSTREAM);

		p.findFirstNode('powers').fishEnters(s);
		p.tick();
		expect(s.findNode().name).toBe('force field');
		p.tick();
		expect(s.findNode().name).toBe('force field');


		// mature/downstream
		var p = new HS.Program('foo force. field powers');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.DOWNSTREAM);

		p.findFirstNode('powers').fishEnters(s);
		p.tick();
		expect(s.findNode().name).toBe('force field');
		p.tick();
		expect(s.findNode().name).toBe('force field');
	});

	it("doesn't block salmon when unpowered", function(){

		// young/upstream
		var p = new HS.Program('foo force. field bar');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.UPSTREAM);
		p.findFirstNode('foo').fishEnters(s);
		p.tick();
		expect(s.findNode().name).toBe('force field');
		p.tick();
		expect(s.findNode().name).toBe('bar');

		// mature/upstream
		var p = new HS.Program('foo force. field bar');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.UPSTREAM);
		p.findFirstNode('foo').fishEnters(s);
		p.tick();
		expect(s.findNode().name).toBe('force field');
		p.tick();
		expect(s.findNode().name).toBe('bar');

		// young/downstream
		var p = new HS.Program('foo force. field bar');
		var s = new HS.Salmon(p, '', HS.const.YOUNG, HS.const.DOWNSTREAM);
		p.findFirstNode('bar').fishEnters(s);
		p.tick();
		expect(s.findNode().name).toBe('force field');
		p.tick();
		expect(s.findNode().name).toBe('foo');

		// mature/downstream
		var p = new HS.Program('foo force. field bar');
		var s = new HS.Salmon(p, '', HS.const.MATURE, HS.const.DOWNSTREAM);
		p.findFirstNode('bar').fishEnters(s);
		p.tick();
		expect(s.findNode().name).toBe('force field');
		p.tick();
		expect(s.findNode().name).toBe('foo');
	});


	it("blocks water when powered", function(){

		var p = new HS.Program('bear force. field powers spring');

		// we tick twice, because water is updated before power.
		// this means we let the water through before powering up
		// the force field. we use 'bear' instead of a spring,
		// since springs always produce water!

		p.tick();
		expect(p.findFirstNode('bear').is_watered).toBe(true);
		p.tick();
		expect(p.findFirstNode('bear').is_watered).toBe(false);
	});

	it("doesn't block water when unpowered", function(){

		var p = new HS.Program('bear force. field spring');

		p.tick();
		expect(p.findFirstNode('bear').is_watered).toBe(true);
		p.tick();
		expect(p.findFirstNode('bear').is_watered).toBe(true);
	});


	it("blocks snowmelt when powered", function(){

		var p = new HS.Program('foo force. field powers snowmelt');

		// snows needs one tick per node, including snowmelt

		p.tick();
		p.tick();
		p.tick();
		p.tick();
		expect(p.findFirstNode('foo').is_snowy).toBe(false);
	});

	it("doesn't block snowmelt when unpowered", function(){

		var p = new HS.Program('foo force. field snowmelt');

		p.tick();
		p.tick();
		p.tick();
		expect(p.findFirstNode('foo').is_snowy).toBe(true);
	});

});

