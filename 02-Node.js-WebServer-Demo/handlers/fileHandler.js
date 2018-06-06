const fs = require('fs');
const path = '/bigfile';

function streamFile(req, res) {
    if (req.path == path) {
        const read = fs.createReadStream('./file.txt');

        res.writeHead(200, { 'content-type': 'text/plain' });
        
        read.pipe(res);
        // read.on('data', data => {
        //     res.write(data);
        // });
        // read.on('end', () => {
        //     res.end();
        // });
    } else {
        return true;
    }
}

module.exports = streamFile;
