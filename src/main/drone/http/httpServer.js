/**
 * Created by raphael on 10.04.17.
 */
var fs = require('fs');
var path = require('path');
var http = require('http');
var filepath = require('filepath');


var staticBasePath = filepath.create(__dirname, '/static');

var staticServe = function(req, res) {
    var fileLoc = path.resolve(staticBasePath.path);
    fileLoc = path.join(fileLoc, req.url);

    fs.readFile(fileLoc, function(err, data) {
        if (err) {
            res.writeHead(404, 'Not Found');
            res.write('404: File Not Found!');
            return res.end();
        }

        res.statusCode = 200;

        res.write(data);
        return res.end();
    });
};

var httpServer = http.createServer(staticServe);

httpServer.listen(8080);

