const http = require('http');
const fs = require('fs');

http
    .createServer((req, res) => {
        console.log(req.url);

        if (req.url == '/index.html') {
            // res.end("index");

            const stat = fs.statSync('./index.html');

            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Content-Length': stat.size
            });

            var readStream = fs.createReadStream('./index.html');
            readStream.pipe(res);
        } else {
            res.end('404 Not Found');
        }
    })
    .listen(8000);
