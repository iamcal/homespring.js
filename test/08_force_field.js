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
		expect(true).toBe(false);
	});

	it("doesn't block water when unpowered", function(){
		expect(true).toBe(false);
	});


	it("blocks snowmelt when powered", function(){
		expect(true).toBe(false);
	});

	it("doesn't block snowmelt when unpowered", function(){
		expect(true).toBe(false);
	});

});

