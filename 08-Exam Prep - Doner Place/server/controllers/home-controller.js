const productService = require("../services/product-service");

module.exports = {
    index: async (req, res) => {
        const products = await productService.getAll(); // grouped by category
        
        return res.render("home/index", { products });
    }
};
