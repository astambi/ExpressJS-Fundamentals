const mongoose = require("mongoose");
// mongoose.Promise = global.Promise // no longer required

const User = require("../data/User");
const Car = require("../data/Car");
const Rent = require("../data/Rent");

module.exports = settings => {
    mongoose.connect(settings.db);
    let db = mongoose.connection;

    db.once("open", err => {
        if (err) {
            throw err;
        }

        console.log("MongoDB ready!");

        // Seed first Admin User if none in db
        User.seedAdminUser();
    });

    db.on("error", err => console.log(`Database error: ${err}`));
};
