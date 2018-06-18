const Car = require("mongoose").model("Car");
const Rent = require("mongoose").model("Rent");

module.exports = {
    createGet: async (req, res) => {
        const id = req.params.id;

        Car.findById(id)
            .then(car => {
                if (car.isRented === true) {
                    res.locals.globalError = "Car is not available for rent.";
                    return res.redirect("/cars/all");
                }

                res.render("rents/create", car);
            })
            .catch(err => {
                console.log(err);
                res.locals.globalError = "Car is not available for rent.";
                return res.redirect("/cars/all");
            });
    },
    createPost: async (req, res) => {
        const { id, duration } = req.body;

        Car.findById(id)
            .then(car => {
                if (
                    car.isRented === true ||
                    duration === undefined ||
                    Number.isNaN(duration) ||
                    +duration < 0
                ) {
                    res.locals.globalError = "Car is not available for rent.";
                    return res.redirect("/cars/all");
                }

                Rent.create({
                    carId: id,
                    userId: req.user.id,
                    price: car.price,
                    duration: +duration
                })
                    .then(async rent => {
                        car.isRented = true;
                        await car.save();

                        res.redirect("/users/profile");
                    })
                    .catch(err => {
                        console.log(err);
                        res.locals.globalError = "Invalid data";
                        return res.redirect("/cars/all");
                    });
            })
            .catch(err => {
                console.log(err);
                res.locals.globalError = "Car is not available for rent.";
                return res.redirect("/cars/all");
            });
    }
};
