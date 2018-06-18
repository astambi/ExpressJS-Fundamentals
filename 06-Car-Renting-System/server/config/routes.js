const controllers = require("../controllers");
const auth = require("./auth");

module.exports = app => {
    // Anonymous Users
    app.get("/", controllers.home.index);

    app.get("/users/register", controllers.users.registerGet);
    app.post("/users/register", controllers.users.registerPost);
    app.get("/users/login", controllers.users.loginGet);
    app.post("/users/login", controllers.users.loginPost);
    app.post("/users/logout", controllers.users.logout);

    app.get("/cars/all", controllers.cars.allGet);

    // Admins only
    app.get("/cars/create", auth.isInRole("Admin"), controllers.cars.createGet);
    app.post(
        "/cars/create",
        auth.isInRole("Admin"),
        controllers.cars.createPost
    );
    app.get("/cars/admin", auth.isInRole("Admin"), controllers.cars.adminGet);
    app.get("/cars/edit/:id", auth.isInRole("Admin"), controllers.cars.editGet);
    app.post("/cars/edit", auth.isInRole("Admin"), controllers.cars.editPost);

    // Authenticated Users only
    app.get(
        "/rents/create/:id",
        auth.isAuthenticated,
        controllers.rents.createGet
    );
    app.post(
        "/rents/create",
        auth.isAuthenticated,
        controllers.rents.createPost
    );
    app.get(
        "/users/profile",
        auth.isAuthenticated,
        controllers.users.profileGet
    );

    // Global Error Handler
    app.all("*", (req, res) => {
        res.status(404);
        res.send("404 Not Found!");
        res.end();
    });
};
