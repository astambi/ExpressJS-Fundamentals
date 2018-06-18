const home = require("./home-controller");
const users = require("./users-controller");
const cars = require("./cars-controller");
const rents = require("./rents-controller");

module.exports = {
    home: home,
    users: users,
    cars: cars,
    rents: rents
};
