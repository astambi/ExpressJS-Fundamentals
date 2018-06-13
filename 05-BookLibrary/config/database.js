const mongoose = require("mongoose");
// mongoose.Promise = global.Promise;

module.exports = settings => {
    mongoose.connect(
        settings.db, // settings.environment.db
        err => {
            if (err) {
                console.log(err);
                return;
            }

            console.log("MongoDb up and running");
        }
    );
};
