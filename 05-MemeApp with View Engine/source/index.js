const express = require("express");
const bodyParser = require("body-parser");
const fileUploader = require("express-fileupload");
const handlebars = require("express-handlebars");

// DB
const dbConfig = require("./config/dbConfig");

// Controllers
const homeController = require("./controllers/homeController");
const memeController = require("./controllers/memeController");
const apiController = require("./controllers/apiController");

// App
const app = express();
const port = 2323;

// Add View Engine
app.engine(
    "hbs",
    handlebars({
        extname: ".hbs", // Custom View Engine Extension
        defaultLayout: "main"
    })
);
app.set("view engine", "hbs");

// Add Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUploader());

// Add Routing
app.use("/public", express.static("public")); // all views reference files in /public
app.use("/", homeController);
app.use("/memes", memeController);
app.use("/api", apiController);

dbConfig
    .then(() => {
        app.listen(port, () => console.log(`Server listening on port ${port}`));
    })
    .catch(err => {
        console.log("Failed to load DB");
        console.log(err);
    });
