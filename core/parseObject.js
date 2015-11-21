var fs = require('fs');
var http = require('http');

var query = "@prefix : <http://example.org/smartobject#>.\n"
	+ "@prefix dbpedia: <http://dbpedia.org/resource/>.\n"
	+ "@prefix foi: <http://www.featureOfInterest.org/example#>.\n \n"
	+ "{?subject :isA ?any. \n"
	+ "?subject ?anyP ?anyOb }\n"
	+ "=>\n"
	+ "{ ?subject ?anyP ?anyOb. }.";

exports.parse = function(path, callback){
	discoveryBlockQuery(query, function(response){
		var Objects = [];
		var smartObjects = analyzeDiscoveryBlockResponse(response);
		
		var files = fs.readdirSync(path);
		for(var i in files ){
			var file = path + "/" + files[i];
			if(fs.lstatSync(file).isFile()){
				var obj = JSON.parse(fs.readFileSync(file, 'utf8'));
				Objects.push(elaborateObj(obj, smartObjects));
			}
		}
		
		callback(Objects);
	});
}

var elaborateObj = function(obj, smartObjects){
	var guid = obj.guid;
	for (var i in smartObjects){
		var elem = smartObjects[i];
		if(elem.guid == guid){
			var array = elem.url.split("/");
			obj.path = "/" + array[3];
		}
	}
	return obj;
};


function discoveryBlockQuery(query, callback){
	var options = {
		host: 'localhost',
		path: '/query',
		method: 'POST',
		port: '3002'
	};
	
	var req = http.request(options, function(res){
		var str = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk){
			str += chunk;
		});
		res.on('end', function(){
			callback(str);
		});
	});
	
	req.write(query);
	req.end();
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

var analyzeDiscoveryBlockResponse = function(queryResult){
	
	var object = JSON.parse( queryResult );

	var subjects = [];
	for (var i in object){
		var tripla = object[i];
		var subject = tripla.subject;
		if(!contains(subjects, tripla.subject)){
			subjects.push(tripla.subject);
		}
	}
	
	var smartObjects = [];

	for (var i in subjects){
		var sub = subjects[i];
		
		var smartObject = new Object();
		
		for(var j in object){
			tripla = object[j];
			
			if(tripla.subject == sub && tripla.predicate == "http://example.org/smartobject#hasUrl"){
				smartObject.url = tripla.object.replace(/"/, '').replace(/"/, '');
			}
			if(tripla.subject == sub && tripla.predicate == "http://example.org/smartobject#hasGuid"){
				smartObject.guid = tripla.object.replace(/"/, '').replace(/"/, '');
			}
		}
		
		smartObjects.push(smartObject);
	}
	return smartObjects;
};
