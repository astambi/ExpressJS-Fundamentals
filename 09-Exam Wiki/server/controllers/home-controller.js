const Article = require("../data/Article");
const Edit = require("../data/Edit");

module.exports = {
    index: async (req, res) => {
        // Top 4 articles
        let articles = await Article.find({});
        articles = articles.reverse().slice(0, 4);

        let latest = articles.shift();
        let edit = await Edit.findOne({ article: latest }).sort("-creationDate");

        latest.content = edit.content.substr(0, 50);

        return res.render("home/index", {
            latest,
            articles
        });
    }
};
