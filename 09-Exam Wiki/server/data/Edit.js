const mongoose = require("mongoose");

let editSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
        required: true
    }
});

let Edit = mongoose.model("Edit", editSchema);

module.exports = Edit;
