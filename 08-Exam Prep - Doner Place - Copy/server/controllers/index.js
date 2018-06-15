const home = require("./home-controller");
const users = require("./users-controller");
const products = require("./products-controller");
const orders = require("./orders-controller");

module.exports = {
    home: home,
    users: users,
    products: products,
    orders: orders
};
