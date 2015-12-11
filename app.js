var DATABASE = 'crovidae',
    DBPORT = 27017,
    DBLOC = 'localhost';

var express = require("express");
var _ = require("lodash");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require("fs");
var path = require("path");
var async = require("async");
var gd = require("node-gd");

var Dice = require("./dice");

var mongoose = require("mongoose");
var Player = require("./Player.js");

var db = mongoose.connect("mongodb://"+DBLOC+":"+DBPORT+"/"+DATABASE);

var PORT = process.env.PORT || 8082;

app.use(express.static(__dirname+"/static"));

server.listen(PORT,'0.0.0.0',function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log("Corvidae Engine App Running on http://%s:%s",host,port);
});

var getMapFromName = function(mapName,callback){
	async.waterfall([
		function(next){
			fs.readFile("./maps/"+mapName+".json",next);
		},
		function(data,next){
			next(null,JSON.parse(data.toString()));
		}
	],callback);
};

app.get("/loadTileSet",function(req,res){
	async.waterfall([
		function(next){
			gd.openPng("tilesets/"+req.query.name,next);
		},
		function(image,next){
			
			image.colorTransparent(image.imageColorAt(288,128));

			next(null,new Buffer(image.pngPtr(),"binary"));
			image.destroy();
		}
	],function(err,imgBuffer){
		if(err){
			console.error(err);
			res.sendStatus(404);
		} else {
			res.type("png");
			res.send(imgBuffer);
		}
	});
});

io.on("connection",function(socket){
	console.log("Websocket via socket.io connected.");
	socket.emit("connection","Websocket via socket.io connected.");

	async.waterfall([
		function(next){
			Player.find({},next);
		}
	],function(err,players){
		if(err){ console.log(err); }
		if(_.isEmpty(players)){
		 	console.log("Players are Empty");
		} else {
			for(i in players){
				socket.emit("playerData",players[i]);
				console.log(players[i]);
			}
		}
	});

	var parseCommand = function(data){
		var command = data.split(" ");

		var commandSet = {
			render:function(){
				var mapName = command.slice(1,command.length).join(" ");
				
				async.waterfall([
					function(next){
						getMapFromName(mapName,next);
					}
				],function(err,mapData){
					if(err){
						console.error(err);
						socket.emit("err",err);
						throw err;
					}

					socket.emit("render",mapData);
				});
			},
			say:function(){
				var whatToSay = command.slice(1,command.length);
				io.sockets.emit("message",whatToSay.join(" "));
			},
			roll:function(){
				var diceRoll = command.slice(1,command.length);
				Dice.parse(diceRoll.join(" "),function(rolls,total){
					socket.emit("message",diceRoll+" = "+total);
				});
			},
		};

		if(_.isUndefined(commandSet[command[0]])){
			socket.emit("message",data);
		} else {
			commandSet[command[0]]();
		}
	}

	socket.on("startMap",function(mapName){
		async.waterfall([
			function(next){
				getMapFromName(mapName,next);
			}
		],function(err,mapData){
			if(err){
				console.error(err);
				socket.emit("err",err);
				throw err;
			}

			socket.emit("render",mapData);
		});
	});

	socket.on("input",function(data){
		console.log("User Input: "+data);
		parseCommand(data);
		//socket.emit("message",data);
	});
});