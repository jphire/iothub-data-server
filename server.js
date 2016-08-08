'use strict'

let fs = require('fs');
let http = require('http');
let url = require('url');

var imageToSlices = require('image-to-slices');
imageToSlices.configure({
    clipperOptions: {
        canvas: require('canvas')
    }
});

let dummyArr = [67108864];
dummyArr.fill(2);

let server = http.createServer(function(request, response){
    var parts = url.parse(request.url, true);
    var url_parts = parts.path.substring(1).split("/");
    var action = request.pathname;
    var query = parts.query;
    var feed = url_parts[2]
    var size = parseInt(query.size);
    var sliced = query.nodes ? true : false;
    var img;
    var nodes = parseInt(query.nodes);
    var nodeIndex = parseInt(query.index);
    let blockSize = size/nodes;
    var lineXArray = Array.apply(null, Array(nodes)).map(function (x, i, thisArr) { return (i+1)*blockSize; })
    console.log(lineXArray)
    if (!isNaN(size)) {
        if (request.method === 'GET') {
            if (!isNaN(size)) {
        		try {
                    let source = './img/' + size + '.jpg';

                    if (sliced) {
                        // let lineXArray = [size].fill(function ());
                        // Vertical division not yet implemented
                        let lineYArray = [];

                        imageToSlices(source, lineXArray, lineYArray, {
                            saveToDataUrl: true
                        }, function(dataUrlList) {
                            //console.log(dataUrlList);
                            let url = dataUrlList[nodeIndex].dataURI.replace(/^data:image\/(png|gif|jpeg);base64,/,'');
                            let img = new Buffer(url, 'base64');
                            
                            response.writeHead(200, {'content-type': 'image/jpg'});
                            response.end(img, 'binary');
                        });
                    } else {
                        img = fs.readFileSync(source);
                    	response.writeHead(200, {'content-type': 'image/jpg'});
                    	response.end(img, 'binary');
                    }
                } catch (err) {
                    console.log(err)
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
console.log('listening on port 4000')

