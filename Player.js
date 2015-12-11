var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
	"username":"String",
	"displayName":"String",
	"isAdmin":{ "type":"Boolean","default":false }
},{"collection":"Players"});

PlayerSchema.methods.getName = function(usernameInstead){
	var returnable = "";
	if(usernameInstead){
		returnable = this.username;
	} else {
		returnable = this.displayName;
	}
	return returnable;
}

var Player = mongoose.model("Player",PlayerSchema);
module.exports = Player;