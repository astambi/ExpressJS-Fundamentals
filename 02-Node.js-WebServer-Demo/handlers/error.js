const path = '/error.html';

function errorHandler(req, res) {
    res.sendHtml('.' + path);
}

module.exports = errorHandler;
