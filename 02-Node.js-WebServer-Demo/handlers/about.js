const path = '/about.html';

function aboutHandler(req, res) {
    if (req.path == path) {
        res.sendHtml('.' + path);
    } else {
        return true;
    }
}

module.exports = aboutHandler;
