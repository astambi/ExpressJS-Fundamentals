const mongoose = require("mongoose");

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
        enum: [
            "pickle",
            "tomato",
            "onion",
            "lettuce",
            "hot sauce",
            "extra sauce"
        ],
        default: []
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
