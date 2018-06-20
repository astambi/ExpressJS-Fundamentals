const mongoose = require("mongoose");

let articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    edits: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Edit",
        default: []
    }
});

let Article = mongoose.model("Article", articleSchema);

module.exports = Article;
