const messages = ['hello', 'how are you', 'nice to meet you'];

/**
 *
 * @param { http.ClientRequest } req
 * @param { http.ClientResponse } res
 */
function dataHandler(req, res) {
    const dataStr = '/data/';
    if (req.path.startsWith(dataStr)) {
        const target = req.path.substr(dataStr.length);

        if (target == 'messages') {
            res.writeHead(200, {
                'content-type': 'application/json'
            });
            res.write(JSON.stringify(messages));
            res.end();
        } else {
            return true;
        }
    } else {
        return true;
    }
}

module.exports = dataHandler;
