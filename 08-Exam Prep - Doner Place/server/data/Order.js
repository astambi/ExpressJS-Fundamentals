const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now // do NOT use as function!
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
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "In Transit", "Delivered"],
        default: "Pending"
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
