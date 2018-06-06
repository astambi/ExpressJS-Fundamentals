const fs = require('fs');

const mimeTypes = {
    css: 'text/css',
    js: 'application/javascript',
    png: 'image/png'
};

function staticHandler(req, res) {
    if (req.path.startsWith('/static/')) {
        const extension = req.path.split('.').pop();

        res.writeHead(200, {
            'content-type': mimeTypes[extension]
        });

        try {
            const read = fs.createReadStream('.' + req.path);
            read.pipe(res);
            // fs.readFile('.' + req.path, 'utf8', (err, data) => {
            //     res.write(data);
            //     res.end();
            // });
        } catch (error) {
            console.log(error);
            return true;
        }
    } else {
        return true;
    }
}

module.exports = staticHandler;
