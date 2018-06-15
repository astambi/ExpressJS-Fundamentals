const encryption = require("../utilities/encryption");

// const User = require("mongoose").model("User");
const User = require("../data/User");

module.exports = {
    registerGet: (req, res) => {
        res.render("users/register");
    },
    registerPost: (req, res) => {
        const { username, firstName, lastName, password } = req.body;

        // Validations
        if (
            username === undefined ||
            firstName === undefined ||
            lastName === undefined ||
            password === undefined ||
            !username.trim() ||
            !firstName.trim() ||
            !lastName.trim() ||
            !username.trim()
        ) {
            res.locals.globalError = "Invalid user data";
            return res.render("users/register");
        }

        let salt = encryption.generateSalt();
        let hashedPassword = encryption.generateHashedPassword(salt, password);

        User.create({
            username: username.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            salt: salt,
            hashedPass: hashedPassword
        })
            .then(user => {
                req.logIn(user, (err, user) => {
                    if (err) {
                        res.locals.globalError = err;
                        return res.render("users/register", user);
                    }

                    res.redirect("/");
                });
            })
            .catch(err => {
                console.log(err);
                res.locals.globalError = "Username is taken";
                res.render("users/register");
            });
    },
    loginGet: (req, res) => {
        res.render("users/login");
    },
    loginPost: (req, res) => {
        const { username, password } = req.body;

        // Validations
        if (username === undefined || password === undefined) {
            res.locals.globalError = "Invalid user data";
            return res.render("users/login");
        }

        User.findOne({
            username: username
        }).then(user => {
            if (!user) {
                res.locals.globalError = "Invalid user data";
                return res.render("users/login");
            }

            if (!user.authenticate(password)) {
                res.locals.globalError = "Invalid user data";
                return res.render("users/login");
            }

            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.globalError = err;
                    return res.render("users/login");
                }

                res.redirect("/");
            });
        });
    },
    logout: (req, res) => {
        req.logout();
        res.redirect("/");
    },
    profileGet: (req, res) => {
        // TODO cars

        res.render("users/profile", {
            rentedCars: req.user.rentedCars
        });
    }
};
