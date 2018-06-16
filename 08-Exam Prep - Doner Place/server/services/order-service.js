const Order = require("mongoose").model("Order");
const Product = require("mongoose").model("Product");

async function create(data) {
    const { creatorId, productId } = data;

    const allowedToppings = new Product().allowedToppings; // virtual prop

    let toppings = [];
    for (const key in data) {
        if (allowedToppings.includes(key)) {
            toppings.push(key);
        }
    }

    return await Order.create({
        creatorId,
        productId,
        toppings
    });
}

async function getByUserId(userId) {
    return await Order.find({
        creatorId: userId
    }).populate("productId"); // populate by primary key !
}

async function getById(id) {
    return await Order.findById(id).populate("productId");
}

async function getAll() {
    return await Order.find({}).populate("productId");
}

async function updateStatus(id, newStatus) {
    await Order.findByIdAndUpdate(id, {
        $set: { status: newStatus }
    });
}

module.exports = {
    create,
    getByUserId,
    getById,
    getAll,
    updateStatus
};
