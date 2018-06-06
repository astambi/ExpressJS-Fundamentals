const path = '/index.html';

function homeHandler(req, res) {
    if (req.path == '/' || req.path == path) {
        res.sendHtml('.' + path);
    } else {
        return true;
    }
}

module.exports = homeHandler;
