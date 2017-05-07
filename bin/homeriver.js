#!/usr/bin/node

var fs = require('fs');

var path_in = process.argv[2];
var path_out = process.argv[3];

if (!path_in || !path_out){
	console.log("Usage: ./homeriver.js input-file output-file");
	process.exit();
}

fs.readFile(path_in, 'utf8', function(err, data){
	if (err){
		console.log('Unable to read source file: '+err);
		return;
	}

	var conv = convert(data);

	fs.writeFile(path_out, conv, function(err){
		if (err){
			console.log('Unable to write translated file: '+err);
			return;
		}

		console.log("The file was saved!");
	});
});


function convert(str){

var tokenCount = 0;
var sepToken = " ";
var indentations = [-1,-1];
var tokenCounts = [0, 0];
var bracketProtected = [0, 0];

var lines = str.split(/\r?\n/);
var result = "";
var previousTokenCount = 0;

var macros = {};

for (var li=0;li<lines.length;li++) {
var l = lines[li];
if (l.trim() == "") continue; 
for (var m in macros) 
while (l.indexOf(".$"+m) >= 0)
l = l.replace(".$"+m, macros[m]);
if ( /[ ]*[.]#.*:=/.test(l)) {
var macroDef = /[ ]*[.]#(.*):=(.*)/.exec(l);
macros[macroDef[1]] = macroDef[2];
continue;
}
//if (l == "") break;
var tokenizer = /^( *)(([.] |[^ ])*)(.*)$/;
var token = tokenizer.exec(l);
// alert(l+"\n"+tokenCount+" "+token+"\n"+indentations+"\n"+tokenCounts+"\n"+bracketProtected)
function removeTokens(){
while (tokenCount > tokenCounts[tokenCounts.length-1]) {
result += sepToken; sepToken = " ";
tokenCount--;
} 
}

function popAllLast(){
for (var i = tokenCounts[indentations.length-1]; i > tokenCounts[indentations.length-2]; i--) {
result += sepToken; sepToken = " ";
}
indentations.pop();
tokenCounts.pop();
tokenCount = tokenCounts[tokenCounts.length-1];
bracketProtected.pop();
}

if (token[2] == ".}") {
while (token[2] != "") {
removeTokens();
if (token[2] == ".}") 
while (!bracketProtected[bracketProtected.length-1] && bracketProtected.length > 0) popAllLast();
if (bracketProtected.length == 0) { alert("mismatched .}"); return; break; }
popAllLast();
//result += " "; tokenCount--;
token = tokenizer.exec(token[4]);
}
continue;
} else if (token[2] == ".%" || token[2] == ".\\") continue;

var newIndentationLevel = token[1].length;
if (newIndentationLevel > indentations[indentations.length-1]) {
indentations.push(newIndentationLevel);
tokenCounts.push(tokenCount);
bracketProtected.push(false);
} else if (result != "" && newIndentationLevel == indentations[indentations.length-1])  {
removeTokens();
} else { 
removeTokens();
while (newIndentationLevel < indentations[indentations.length-1] && !bracketProtected[bracketProtected.length-1]) {
popAllLast();
}
if (result != "" && newIndentationLevel == indentations[indentations.length-1]) 
removeTokens();
}
var newTokenCount = 0;
if (token[2] != "") { result += sepToken+token[2]; sepToken = " "; newTokenCount++; }
var protectionCount = 1;
while (token[2] != "") {
newIndentationLevel += token[2].length;
//alert(token)	
token = tokenizer.exec(token[4]);
newIndentationLevel += token[1].length;
if (token[2] != "") {
if (token[2] == ".{") { 
protectionCount = newTokenCount;
indentations.push(0);
tokenCounts.push(tokenCount+newTokenCount);
bracketProtected.push(true);
} else if (token[2] == ".%") { break; }
else if (token[2] == ".\\") { sepToken = "\n"; continue;}
else { result += sepToken+ token[2]; sepToken = " "; newTokenCount++; }
}
//if (!confirm(token)) return;

}//alert(tokenCount+" "+protectionCount+ " "+ newTokenCount)
if (newTokenCount > 0) {
var temp = newTokenCount;
for (var i=protectionCount;i<temp;i++) { result += " "; newTokenCount-=1;}
tokenCount += newTokenCount;
}

}
result = result.trim();
result += "\n";
result = result.replace(/[.]n /g, ".\n");

return result;
}
