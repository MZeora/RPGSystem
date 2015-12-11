module.exports = new Dice();

var mathjs = require("mathjs");

function Dice(number,size){
	this.numDice = number;
	this.diceSize = size;	
};

function rollDice(num,size,callback){
	var d = new Dice(num,size);
	return d.roll(function(rolls,total){
		callback(num+"d"+size,rolls,total);
	});

}

Dice.prototype.roll = function(callback){
	var total = 0;
	var rollAry = [];
	for(i = 0; i < this.numDice; i++){
		var result = Math.floor(Math.random()*this.diceSize)+1;
		rollAry.push(result);
		total += result;
	}
	console.log("[ "+rollAry.join(", ")+" ] = Total: "+total);
	if(callback instanceof Function){
		callback(rollAry,total);
		return total;
	} else {
		return total;
	}
};

Dice.prototype.parse = function(diceNotationString, callback){
	var mathString = diceNotationString;
	var getAllDice = /(\d*d\d+)/gi;
	var baseDiceNotePattern = /(\d*)d(\d+)/i;
	var listOfDice = diceNotationString.match(getAllDice);
	var allRoles = [];

	console.log(listOfDice);
	
	for(i in listOfDice){
		var matches = listOfDice[i].match(baseDiceNotePattern);
		var numDice = parseInt(matches[1]);
		var dieSize = parseInt(matches[2]);
		if(matches[1] == ""){
			numDice = 1;
		}
		var d = rollDice(numDice,dieSize,function(roll,rolls,total){
			allRoles.push({
				"dice":roll,
				"roll":rolls,
				"total":total
			});
			console.log(roll); console.log(total);
			mathString = mathString.replace(roll,total);
			mathString = mathString.replace(matches[0],total);
			console.log(mathString);
		});
	}

	result = mathjs.eval(mathString);

	callback(allRoles,result);
	return result;
};