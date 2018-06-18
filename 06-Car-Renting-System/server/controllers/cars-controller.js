const Car = require("mongoose").model("Car");

module.exports = {
    allGet: (req, res) => {
        Car.find({
            isRented: false
        })
            .then(cars => {
                res.render("cars/all", { cars });
            })
            .catch(err => {
                console.log(err);
                res.redirect("/");
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
            const formData = { model, imageUrl, price };
            return res.render("cars/create", formData);
        }

        Car.create({
            model: model.trim(),
            imageUrl: imageUrl.trim(),
            price: +price
        })
            .then(car => {
                res.redirect("/cars/admin");
            })
            .catch(err => {
                console.log(err);
                res.locals.globalError = "Invalid car data";
                res.render("cars/create");
            });
    },
    adminGet: async (req, res) => {
        const cars = await Car.find({});
        res.render("cars/all", { cars });
    },
    editGet: async (req, res) => {
        const id = req.params.id;

        Car.findById(id)
            .then(car => {
                res.render("cars/edit", car);
            })
            .catch(err => {
                return res.redirect("/cars/admin");
            });
    },
    editPost: async (req, res) => {
        const { id, model, price, imageUrl, isRented } = req.body;

        Car.findById(id)
            .then(async car => {
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
                    return res.render(`cars/edit/${id}`);
                }

                car.model = model;
                car.imageUrl = imageUrl;
                car.price = +price;
                car.isRented = isRented;
                await car.save();

                res.redirect("/cars/admin");
            })
            .catch(err => {
                return res.redirect("/cars/admin");
            });
    }
};
