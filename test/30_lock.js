describe("keyword: lock", function(){

	// Very blocks downstream salmon and blocks snowmelt when powered.

	it("does nothing when not powered", function(){

		var p = new HS.Program('lock foo');
                p.tick();
		p.tick();

		var node = p.findFirstNode('lock');

		expect(node.isPowered()).toBe(false);
		expect(node.blocksSnowmelt()).toBe(false);

		expect(node.canFishEnter(new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.UPSTREAM  ))).toBe(true);
		expect(node.canFishEnter(new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.DOWNSTREAM))).toBe(true);
		expect(node.canFishEnter(new HS.Salmon(p, 'test', HS.const.YOUNG,  HS.const.UPSTREAM  ))).toBe(true);
		expect(node.canFishEnter(new HS.Salmon(p, 'test', HS.const.YOUNG,  HS.const.DOWNSTREAM))).toBe(true);

		expect(node.canFishLeave(new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.UPSTREAM  ))).toBe(true);
		expect(node.canFishLeave(new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.DOWNSTREAM))).toBe(true);
		expect(node.canFishLeave(new HS.Salmon(p, 'test', HS.const.YOUNG,  HS.const.UPSTREAM  ))).toBe(true);
		expect(node.canFishLeave(new HS.Salmon(p, 'test', HS.const.YOUNG,  HS.const.DOWNSTREAM))).toBe(true);
	});

	it("blocks snowmelt when powered", function(){

		var p = new HS.Program('lock powers');
                p.tick();
                p.tick();

		var node = p.findFirstNode('lock');

		expect(node.isPowered()).toBe(true);
		expect(node.blocksSnowmelt()).toBe(true);
	});

	it("very blocks downstream salmon (but no others) when powered", function(){

		var p = new HS.Program('lock powers');
		p.tick();
		p.tick();

		var node = p.findFirstNode('lock');

		expect(node.isPowered()).toBe(true);

		expect(node.canFishEnter(new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.UPSTREAM  ))).toBe(true);
		expect(node.canFishEnter(new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.DOWNSTREAM))).toBe(false);
		expect(node.canFishEnter(new HS.Salmon(p, 'test', HS.const.YOUNG,  HS.const.UPSTREAM  ))).toBe(true);
		expect(node.canFishEnter(new HS.Salmon(p, 'test', HS.const.YOUNG,  HS.const.DOWNSTREAM))).toBe(false);

		expect(node.canFishLeave(new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.UPSTREAM  ))).toBe(true);
		expect(node.canFishLeave(new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.DOWNSTREAM))).toBe(true);
		expect(node.canFishLeave(new HS.Salmon(p, 'test', HS.const.YOUNG,  HS.const.UPSTREAM  ))).toBe(true);
		expect(node.canFishLeave(new HS.Salmon(p, 'test', HS.const.YOUNG,  HS.const.DOWNSTREAM))).toBe(true);
	});
});

