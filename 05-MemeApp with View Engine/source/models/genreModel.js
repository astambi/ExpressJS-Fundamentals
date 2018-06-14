const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var genreSchema = Schema({
    title: { type: Schema.Types.String, required: true, unique: true },
    memes: [{ type: Schema.Types.ObjectId, ref: "Meme" }]
});

var Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;
