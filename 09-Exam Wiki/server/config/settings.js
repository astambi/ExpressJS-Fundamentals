const path = require("path");

let rootPath = path.normalize(path.join(__dirname, "/../../"));

// Environment Configuration
module.exports = {
    development: {
        rootPath: rootPath,
        db: "mongodb://localhost:27017/wikiDb",
        port: 1337
    },
    staging: {},
    production: {
        port: process.env.PORT
    }
};
