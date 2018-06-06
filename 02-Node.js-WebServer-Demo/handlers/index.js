const staticHandler = require('./static');
const homeHandler = require('./home');
const aboutHandler = require('./about');
const fileHandler = require('./fileHandler');
const dataHandler = require('./data');
const errorHandler = require('./error');

module.exports = [
    staticHandler,
    homeHandler,
    aboutHandler,
    fileHandler,
    dataHandler,
    errorHandler
];
