const mongoose = require("mongoose");

const allowedToppings = [
    "pickle",
    "tomato",
    "onion",
    "lettuce",
    "hot sauce",
    "extra sauce"
];

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ["chicken", "beef", "lamb"],
        required: [true, "Category is required"]
    },
    size: {
        type: Number,
        required: [true, "Size is required"],
        min: 17,
        max: 24
    },
    imageUrl: {
        type: String,
        required: [true, "Image URL is required"]
    },
    toppings: {
        type: [String],
        enum: allowedToppings,
        default: []
    }
});

// Virtual property for Allowed Toppings
productSchema.virtual("allowedToppings").get(function() {
    return allowedToppings;
});

productSchema.virtual("productName").get(function() {
    let category = this.category;
    let categoryUpper = category[0].toUpperCase() + category.slice(1);

    return `${categoryUpper} doner, ${this.size}cm`;
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
