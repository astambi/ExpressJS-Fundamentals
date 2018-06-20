const Article = require("../data/Article");
const Edit = require("../data/Edit");
const User = require("../data/User");

module.exports = {
    detailsGet: async (req, res) => {
        const id = req.params.id;
        const edit = await Edit.findById(id);
        
        const article = await Article.findById(edit.article);

        article.paragraphs = edit.content
            .split("  ")
            .filter(p => p.trim().length > 0);

        res.render("edits/details", article);
    }
};
