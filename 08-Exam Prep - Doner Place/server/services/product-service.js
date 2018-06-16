const Product = require("mongoose").model("Product");

async function create(data) {
    const { category, size, imageUrl } = data;

    const allowedToppings = new Product().allowedToppings; // virtual prop

    const toppings = data.toppings
        .split(",")
        .map(e => e.trim())
        .filter(e => e.length > 0)
        .filter(e => allowedToppings.includes(e)); // filter valid data only

    return await Product.create({
        category,
        size: Number(size),
        imageUrl,
        toppings
    });
}

async function getAll() {
    const products = await Product.find({}).sort("size");

    return {
        chicken: products.filter(p => p.category === "chicken"),
        beef: products.filter(p => p.category === "beef"),
        lamb: products.filter(p => p.category === "lamb")
    };
}

async function getById(id) {
    const product = await Product.findById(id);

    if (product === undefined) {
        throw new Error(`Product not found: #${id}`);
    }

    return product;
}

module.exports = {
    create,
    getAll,
    getById
};
