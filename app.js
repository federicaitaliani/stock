var http = require('http');
var url = require('url');
var port = process.env.PORT || 3000;

console.log("This goes to the console window");
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    urlObj = url.parse(req.url, true);
    id = urlObj.query.id;
    res.write("Success!  This app is deployed online");
    res.write("<h2>This is my hello application</h2>");
    res.write("The id is: " + id);
    res.end();
    console.log('hey');
}).listen(port);
