const mongoose = require("mongoose");

let carSchema = new mongoose.Schema({
    model: {
        type: mongoose.Schema.Types.String,
        required: true // validation msg
    },
    imageUrl: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    price: {
        type: mongoose.Schema.Types.Number,
        required: true,
        min: 0
    },
    isRented: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    }
});

let Car = mongoose.model("Car", carSchema);

module.exports = Car;
