const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    tagName: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    creationDate: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: Date.now // function not result
    },
    images: [{ type: mongoose.SchemaTypes.ObjectId }]
});

// TODO
// tagSchema.add(function() {
//     return tagSchema.tagName.toLowerCase();
// });

module.exports = mongoose.model("Tag", tagSchema);
