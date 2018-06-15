const productService = require("../services/product-service");

module.exports = {
    createGet: (req, res) => {
        res.render("products/create");
    },
    createPost: async (req, res) => {
        try {
            // res.json(req.body);
            const product = await productService.create(req.body);

            res.redirect("/");
        } catch (err) {
            console.log(err);
            res.locals.globalError = "Invalid product data";

            // view with form data
            res.render("products/create", {
                formData: {
                    category: req.body.category,
                    size: req.body.size,
                    imageUrl: req.body.imageUrl,
                    toppings: req.body.toppings
                }
            });
        }
    }
};
