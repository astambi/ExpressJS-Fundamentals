const Product = require("mongoose").model("Product");

const allowedToppings = [
    "pickle",
    "tomato",
    "onion",
    "lettuce",
    "hot sauce",
    "extra sauce"
];

async function create(data) {
    const { category, size, imageUrl } = data;

    const toppings = data.toppings
        .split(",")
        .map(e => e.trim())
        .filter(e => e.length > 0)
        .filter(e => allowedToppings.includes(e)); // validation

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

    let categoryName = product.category;
    categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

    product.productName = `${categoryName} doner, ${product.size}cm`;

    return product;
}

function getName(category, size) {
    let categoryUpper = category[0].toUpperCase() + category.slice(1);
    return `${categoryUpper} doner, ${size}cm`;
}

module.exports = {
    create,
    getAll,
    getById,
    getName
};
