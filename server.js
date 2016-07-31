'use strict'

let fs = require('fs')
let http = require('http')
let url = require('url')

let dummyArr = [67108864];
dummyArr.fill(2);

let server = http.createServer(function(request, response){
    var url_parts = url.parse(request.url).path.substring(1).split("/");
    var action = request.pathname;

	var type = url_parts[0];
	var size = parseInt(url_parts[1]);
 	if (!isNaN(size)) {
        if (request.method === 'POST') {
            if (type === 'array') {
        		let arr = dummyArr.slice(0, size);
                response.writeHead(200, {'content-type': 'application/json'});
                response.end(JSON.stringify(arr));
        	} else if (type === 'image' && !isNaN(size)) {
        		try {
                    let img = fs.readFileSync('./' + size + '.jpg');
                	response.writeHead(200, {'content-type': 'image/jpg'});
                	response.end(img, 'binary');
                } catch (err) {
                    response.writeHead(400, {'content-type': 'application/json'});
                    response.end(JSON.stringify({'Error':'Invalid size, could not open file. Supported sizes: 256,512,1024,2048,4096'}));
                }
        	} else {
            	response.writeHead(400, {'content-type' : 'application/json'});
            	response.end();
        	}
        } else {
            response.writeHead(403, {'content-type' : 'application/json'});
            response.end(JSON.stringify({"Error":"Method not supported"}));
        }
    } else {
        response.writeHead(400, {'content-type' : 'application/json'});
        response.end(JSON.stringify({"Error":"Invalid size given"}));
    }


})
.listen(4000, '0.0.0.0');

