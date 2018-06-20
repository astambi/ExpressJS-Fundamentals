const mongoose = require("mongoose");
// mongoose.Promise = global.Promise // no longer required

// Register Models
const User = require("../data/User");

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
