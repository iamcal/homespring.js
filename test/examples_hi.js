describe("examples: hi.hs", function(){

	it("runs correctly", function(){

		var p = test_example('hi.hs');

		p.onTickEnd = function(){
			if (p.tickNum < 22){
				expect(p.output).toEqual([]);
				return;
			}
			if (p.tickNum == 22){
				expect(p.output).toEqual(['Hi. What\'s your name? ']);
				p.output = [];
				p.input = 'cal';
				return;
			}
			if (p.tickNum < 53){
				expect(p.output).toEqual([]);
				return;
			}
			if (p.tickNum == 53){
				expect(p.output).toEqual(['Hi, ', 'cal']);
			}

			if (p.tickNum == 54){
				expect(p.output).toEqual(['Hi, ', 'cal', '!\n']);
			}
		};


		p.test(100);

		expect(p.tickNum).toBe(54);
		expect(p.terminated).toBe(true);
		expect(p.output).toEqual(['Hi, ', 'cal', '!\n']);
	});
});
