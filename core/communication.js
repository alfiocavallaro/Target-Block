var SerialPort = require("serialport").SerialPort; 
var http = require('http');

exports.sendCommand = function(command, communication, callback){

	var commType = communication.type.toLowerCase();
	
	if(commType == "serial"){
		serialCommunication(command,communication,callback);
	}else if(commType == "i2c"){
		i2cCommunication(command,communication,callback);
	}else if(commType == "ip"){
		httpCommunication(command,communication,callback);
	}else{
		callback("Communication System not supported");
	}
}

var serialCommunication = function(command, communication, callback){
	var port = communication.parameters.port;
	var baudrate = parseInt(communication.parameters.baudrate);
	
	var com = new SerialPort(port, {
		baudrate: baudrate
	}, false);
	
	com.open(function(error){
		if(error){
			callback("Failed to open serial port: " + port);
		}else{
			com.write(command, function(err, result){
				if(err){
					callback("Failed to write: " +command + " on serial port: " + port);
				}
				if(result){
					callback(result);
				}
			});
		}
	});
}

var i2cCommunication = function(command, communication, callback){
	var address = communication.parameters.address;
		//TODO: implement i2c communication.
}

var httpCommunication = function(command, communication, callback){
	var options = {
		host: communication.parameters.IP,
		path: communication.parameters.path + command,
		method: communication.parameters.method,
		port: communication.parameters.port
	};
	
	smartObjRequest(options, function(response){
		callback(response);
	});
}

function smartObjRequest(options, callback){
	
	var req = http.request(options, function(res){
		var response = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk){
			response += chunk;
		});
		res.on('end', function(){
			callback(response);
		});
	});
	
	req.end();
}


	
	
	
	
		