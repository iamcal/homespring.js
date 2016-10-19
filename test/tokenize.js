describe("tokenizer", function(){

	var p = new HS.Program('');

	it("tokenizes simple tokens", function(){

		expect(p.tokenize('a b c d')).toEqual(['a','b','c','d']);
		expect(p.tokenize("a\nb")).toEqual(['a','b']);
	});

	it("tokenizes blank tokens", function(){

		expect(p.tokenize('a  b')).toEqual(['a','','b']);
	});

	it("understands leading and trailing blanks", function(){

		expect(p.tokenize(' a')).toEqual(['', 'a']);
		expect(p.tokenize('a ')).toEqual(['a']);
		expect(p.tokenize('a  ')).toEqual(['a', '']);
	});

	it("understands the arcane escaping rules", function(){

		expect(p.tokenize('a. b')).toEqual(['a b']);

		expect(p.tokenize("a.\nb")).toEqual(["a\n", 'b']); // newlines always terminate tokens
		expect(p.tokenize("a.\n.\nb")).toEqual(["a\n", "\n", 'b']);
		expect(p.tokenize("a.\n\nb")).toEqual(["a\n", '', 'b']);

		expect(p.tokenize('a .b')).toEqual(['a.b']);
	});

	it("don't allow invalid productions", function(){

		expect(function(){ p.tokenize('a . b') }).toThrow();
		expect(function(){ p.tokenize('a. .b') }).toThrow();

		expect(function(){ p.tokenize("a\tb") }).toThrow();
	});

	it("tokenizes example progams", function(){

		expect(p.tokenize('Hello,.   World ..\n')).toEqual(['Hello, ', '', 'World.\n']);

		expect(p.tokenize('a b c  d e   f g    h i')).toEqual(['a', 'b', 'c', '', 'd', 'e', '', '', 'f', 'g', '', '', '', 'h', 'i']);

		expect(p.tokenize('Universe bear hatchery Hello. World!.\n Powers   marshy marshy snowmelt')).toEqual([
			'Universe', 'bear', 'hatchery', 'Hello World!\n', '', 'Powers', '', '', 'marshy', 'marshy', 'snowmelt'
		]);

	});

});
