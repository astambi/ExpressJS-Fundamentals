const express = require("express");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const handlebars = require("express-handlebars");

const encryption = require("../utilities/encryption");

// Express Middleware Configuration
module.exports = app => {
    // Handlebars View Engine
    app.engine(
        ".hbs",
        handlebars({
            extname: ".hbs",
            defaultLayout: "main"
        })
    );
    app.set("view engine", ".hbs");

    // Cookie Parser & Body Parser
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Session
    app.use(
        session({
            // secret: "neshto-taino!@#$%",
            secret: encryption.generateSalt(),
            resave: false,
            saveUninitialized: false
        })
    );

    // Authentication with Passport
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        if (req.user) {
            // Attach User
            res.locals.currentUser = req.user;

            // Attach Admin flag
            if (req.user.roles.includes("Admin")) {
                res.locals.isAdmin = true;
            }
        }

        next();
    });

    // Static files folder config
    app.use(express.static("public"));

    console.log("Express ready!");
};
