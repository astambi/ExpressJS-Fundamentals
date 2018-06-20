const Article = require("../data/Article");
const Edit = require("../data/Edit");
const User = require("../data/User");

module.exports = {
    createArticleGet: (req, res) => {
        res.render("articles/create");
    },
    createArticlePost: async (req, res) => {
        const { title, content } = req.body;

        const newArticle = {
            title: title
        };

        Article.create(newArticle)
            .then(article => {
                const newEdit = {
                    author: req.user.id,
                    content: content,
                    article: article._id
                };

                Edit.create(newEdit)
                    .then(edit => {
                        console.log(edit);

                        article.edits.push(edit._id);
                        article
                            .save()
                            .then(article => {
                                console.log(article);

                                res.redirect("/");
                            })
                            .catch(err => {
                                console.log(err);
                                res.locals.globalError = "Invalid data";
                                res.render("articles/create");
                            });
                    })
                    .catch(err => {
                        console.log(err);
                        res.locals.globalError = "Invalid data";
                        res.render("articles/create");
                    });
            })
            .catch(err => {
                console.log(err);
                res.locals.globalError = "Invalid data";
                res.render("articles/create");
            });
    },
    allGet: async (req, res) => {
        const articles = await Article.find({})
            .populate("edit")
            .sort("title");

        res.render("articles/all", { articles });
    },
    detailsGet: async (req, res) => {
        const id = req.params.id;
        const article = await Article.findById(id);
        const edit = await Edit.findOne({ article: article }).sort(
            "-creationDate"
        );

        article.paragraphs = edit.content
            .split("  ")
            .filter(p => p.trim().length > 0);

        res.render("articles/details", article);
    },
    editGet: async (req, res) => {
        const id = req.params.id;
        const article = await Article.findById(id);

        const isAdmin = req.user.roles.includes("Admin");
        if (article.isLocked && !isAdmin) {
            res.locals.globalError = "Article is locked for edits";
            return res.redirect(`/articles/all`);
        }

        const edit = await Edit.findOne({ article: id }).sort("creationDate");
        article.content = edit.content;

        res.render("articles/edit", article);
    },
    editPost: async (req, res) => {
        const { id, content } = req.body;

        const article = await Article.findById(id);
        const isAdmin = req.user.roles.includes("Admin");

        if (article.isLocked && !isAdmin) {
            res.locals.globalError = "Article is locked for edits";
            return res.redirect(`/articles/all`);
        }

        if (!article) {
            return res.redirect("/");
        }

        const newEdit = {
            author: req.user.id,
            content: content,
            article: id
        };

        Edit.create(newEdit)
            .then(edit => {
                article.edits.push(edit._id);
                article
                    .save()
                    .then(article => {
                        res.redirect(`/articles/${id}`);
                    })
                    .catch(err => {
                        console.log(err);
                        res.locals.globalError = "Invalid data";
                        res.render(`/articles/edit/${id}`);
                    });
            })
            .catch(err => {
                console.log(err);
                res.locals.globalError = "Invalid data";
                res.render(`/articles/edit/${id}`);
            });
    },
    historyGet: async (req, res) => {
        const id = req.params.id;

        const article = await Article.findById(id);
        const title = article.title;

        const edits = await Edit.find({ article: id })
            .populate("User")
            .sort("-creationDate");

        for (let edit of edits) {
            const date = edit.creationDate;

            edit.shortDate = date.toString().substr(0, 21);

            const author = await User.findById(edit.author);
            edit.authorName = author.username;
        }

        res.render("articles/history", {
            title,
            edits
        });
    },
    latestGet: async (req, res) => {
        // Top 4 articles
        let articles = await Article.find({});
        articles = articles.reverse();

        let article = articles.shift();
        const edit = await Edit.findOne({ article: article }).sort(
            "-creationDate"
        );

        article.paragraphs = edit.content
            .split("  ")
            .filter(p => p.trim().length > 0);

        return res.render("articles/latest", article);
    },
    lockPost: async (req, res) => {
        const id = req.params.id;

        const article = await Article.findById(id);
        article.isLocked = true;
        await article.save();

        res.redirect(`/articles/${id}`);
    },
    unlockPost: async (req, res) => {
        const id = req.params.id;

        const article = await Article.findById(id);
        article.isLocked = false;
        await article.save();

        res.redirect(`/articles/${id}`);
    }
};
