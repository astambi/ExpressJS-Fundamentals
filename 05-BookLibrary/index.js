const env = "development";

const express = require("express");

const settings = require("./config/settings")[env];
const database = require("./config/database");
const server = require("./config/server");
const routes = require("./config/routes");

// Init db
database(settings);

const port = settings.port;
const app = express();

// Add View engine
server(app);

// Add Routing
routes(app);

app.listen(port, () => {
    console.log(`Server up and running on port ${port}...`);
});
