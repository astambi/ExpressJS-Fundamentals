const mongoose = require("mongoose");
mongoose.Promise = global.Promise; // replacing default mongoose promise

require("../models/ImageSchema");
require("../models/TagSchema");

const connectionString = "mongodb://localhost:27017/mongoplayground";

module.exports = mongoose.connect(connectionString); // export promise
