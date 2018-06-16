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

// Virtual property for Order Details & Status
orderSchema.virtual("orderShortDate").get(function() {
    return this.orderDate.toString().substr(0, 21);
});

// Virtual properties for Admin form ManageOrderStatus -> select options
orderSchema.virtual("statusPending").get(function() {
    return this.status === "Pending";
});
orderSchema.virtual("statusInProgress").get(function() {
    return this.status === "In Progress";
});
orderSchema.virtual("statusInTransit").get(function() {
    return this.status === "In Transit";
});
orderSchema.virtual("statusDelivered").get(function() {
    return this.status === "Delivered";
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
