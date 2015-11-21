var express = require('express');
var Parser = require('./core/parseObject');
var Comm = require('./core/communication');

var smartObjects = [];

Parser.parse("./objectConfig", function(smartObjs){
	smartObjects = smartObjs;
});

// Create our Express application
var app = express(); 

// Set view engine to ejs
app.set('view engine', 'ejs');

// Use environment defined port or 3000
var port = process.env.PORT || 3003;

// Create our Express router
var router = express.Router();


router.route('/*').all(function(req, res){
	var request = req.url.split('?');
	var path = request[0];
	var method = req.method;

	var obj = null;

	for(var i in smartObjects){
		if(smartObjects[i].path == path)
			obj = smartObjects[i];
	}
	
	if(obj != null){
		var command = null;
		
		if(method == "GET") command = obj.api.read;
		if(method == "PUT") command = obj.api.switchON;
		if(method == "DELETE") command = obj.api.switchOFF;
		if(method == "POST"){
			var pattern = obj.api.set;
			var array = pattern.split('#');
			command = array[0] + req.query.value;
		} 

		Comm.sendCommand(command, obj.communication, function(response){
			res.send(response);
		});
	}else{
		res.send("CANNOT " + method + " " + path);
	}
});

// Register all our routes with /api
app.use('/', router);

// Start the server
app.listen(port);
console.log('Target Block on port ' + port);