const controllers = require("../controllers");
const auth = require("./auth");

module.exports = app => {
    // Home
    app.get("/", controllers.home.index);

    // Authenticated users only
    app.get("/about", auth.isAuthenticated, controllers.home.about);

    // Admin Users only
    app.get("/about", auth.isInRole("Admin"), controllers.home.about);

    // Users
    app.get("/users/register", controllers.users.registerGet);
    app.post("/users/register", controllers.users.registerPost);
    app.get("/users/login", controllers.users.loginGet);
    app.post("/users/login", controllers.users.loginPost);
    app.post("/users/logout", controllers.users.logout);

    // Global Error Handler
    app.all("*", (req, res) => {
        res.status(404);
        res.send("404 Not Found!");
        res.end();
    });
};
