const Category = require("../models/Category");
const User = require("../models/User");

module.exports.addGet = (req, res) => {
    res.render("category/add");
};

module.exports.addPost = (req, res) => {
    let category = req.body;
    category.creator = req.user._id;

    Category.create(category).then(category => {
        req.user.createdCategories.push(category._id);
        req.user
            .save()
            .then(() => {
                res.redirect("/");
            })
            .catch(err => {
                console.log(err);
                res.render("category/add", category);
            });
    });
};

module.exports.productByCategory = (req, res) => {
    let categoryName = req.params.category;

    Category.findOne({
        name: categoryName
    })
        .populate("products")
        .then(category => {
            if (!category) {
                res.sendStatus(404);
                return;
            }

            res.render("category/products", {
                category: category
            });
        });
};
