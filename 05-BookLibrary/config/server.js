const express = require("express");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");

module.exports = app => {
    // Add View Engine
    app.engine(
        "hbs",
        handlebars({
            extname: ".hbs", // Custom View Engine Extension
            layoutsDir: "views/layouts",
            defaultLayout: "main"
        })
    );
    app.set("view engine", "hbs");

    // Add Static files routing ('/content')
    // app.use("/content", express.static("content")); // NB. link /content/site.css
    app.use(express.static("content")); // NB! link /site.css

    // Add Middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
};
