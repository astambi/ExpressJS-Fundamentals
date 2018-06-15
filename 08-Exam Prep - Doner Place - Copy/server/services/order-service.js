const Order = require("mongoose").model("Order");

const allowedToppings = [
    "pickle",
    "tomato",
    "onion",
    "lettuce",
    "hot sauce",
    "extra sauce"
];

async function create(data) {
    const { creatorId, productId } = data;

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

function updateStatus(id, newStatus) {
    Order.findByIdAndUpdate(id, {
        $set: { status: newStatus }
    }).exec();
}

module.exports = {
    create,
    getByUserId,
    getById,
    getAll,
    updateStatus
};
