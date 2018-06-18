const mongoose = require("mongoose");

let rentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        required: true
    },
    price: {
        type: mongoose.Schema.Types.Number,
        required: true,
        min: 0
    },
    duration: {
        type: mongoose.Schema.Types.Number
    },
    rentDate: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    }
});

rentSchema.virtual("date").get(function() {
    return this.rentDate.toString().substr(0, 21);
});
rentSchema.virtual("total").get(function() {
    return this.price * this.duration;
});

let Rent = mongoose.model("Rent", rentSchema);

module.exports = Rent;
