// Register Controllers
const home = require("./home-controller");
const users = require("./users-controller");
const articles = require("./articles-controller");
const edits = require("./edits-controller");

module.exports = {
    home: home,
    users: users,
    articles: articles,
    edits: edits
};
