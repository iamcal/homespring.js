describe("keyword: inverse lock", function(){

	// Very blocks downstream salmon and blocks snowmelt when not powered.

	it("does nothing when powered", function(){

		var p = new HS.Program('inverse. lock powers');
		p.tick();
		p.tick();

		var node = p.findFirstNode('inverse lock');

		expect(node.isPowered()).toBe(true);
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

	it("blocks snowmelt when not powered", function(){

		var p = new HS.Program('inverse. lock foo');
                p.tick();
                p.tick();

		var node = p.findFirstNode('inverse lock');

		expect(node.isPowered()).toBe(false);
		expect(node.blocksSnowmelt()).toBe(true);
	});

	it("very blocks downstream salmon (but no others) when not powered", function(){

		var p = new HS.Program('inverse. lock foo');
		p.tick();
		p.tick();

		var node = p.findFirstNode('inverse lock');

		expect(node.isPowered()).toBe(false);

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

