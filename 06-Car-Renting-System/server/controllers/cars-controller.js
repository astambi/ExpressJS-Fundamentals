// const User = require("mongoose").model("User");
const User = require("../data/User");
const Car = require("../data/Car");
const passport = require("../config/passport");

module.exports = {
    allGet: (req, res) => {
        Car.find({
            isRented: false
        }).then(cars => {
            res.render("cars/all", { cars });
        });
    },
    createGet: (req, res) => {
        res.render("cars/create");
    },
    createPost: (req, res) => {
        const { model, price, imageUrl } = req.body;

        // Validations
        if (
            model === undefined ||
            imageUrl === undefined ||
            !model.trim() ||
            !imageUrl.trim() ||
            Number.isNaN(price) ||
            +price < 0
        ) {
            res.locals.globalError = "Invalid car data";
            return res.render("cars/create");
        }

        Car.create({
            model: model.trim(),
            imageUrl: imageUrl.trim(),
            price: +price
        })
            .then(car => {
                res.redirect("/cars/all");
            })
            .catch(err => {
                console.log(err);
                res.locals.globalError = "Invalid car data";
                res.render("cars/create");
            });
    }
};
