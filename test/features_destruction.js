describe("feature: destruction", function(){

	it("destroyed nodes don't lose their name", function(){

		var code = "hatchery powers oblivion pump snowmelt universe marshy marshy the snowmelt";

		var p = test_code_full(code, {
			'output' : {
				7 : ['oblivion', 'homeless'],
			},
			'terminates' : 7,
		});

		expect(p.findFirstNode('oblivion').is_destroyed).toBe(true);
		expect(p.findFirstNode('oblivion').name).toBe('oblivion');
	});
});

