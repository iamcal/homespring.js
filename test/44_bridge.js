describe("keyword: bridge", function(){

	// If destroyed by snowmelt, blocks snowmelt and water and very blocks salmon.

	it("does nothing when not destroyed", function(){

		var p = new HS.Program('bridge');
		p.tick();

		var s = new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.UPSTREAM);

		var node = p.findFirstNode('bridge');

		expect(node.is_destroyed).toBe(false);
		expect(node.blocksSnowmelt()).toBe(false);
		expect(node.blocksWater()).toBe(false);
		expect(node.canFishEnter(s)).toBe(true);
	});

	it("blocks everything when destroyed", function(){

		var p = new HS.Program('bridge snowmelt');
                p.tick();
                p.tick();

		var s = new HS.Salmon(p, 'test', HS.const.MATURE, HS.const.UPSTREAM);

		var node = p.findFirstNode('bridge');

		expect(node.is_destroyed).toBe(true);
		expect(node.blocksSnowmelt()).toBe(true);
		expect(node.blocksWater()).toBe(true);
		expect(node.canFishEnter(s)).toBe(false);
	});
});

