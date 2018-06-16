const controllers = require("../controllers");
const auth = require("./auth");

const roleAdmin = "Admin";

module.exports = app => {
    // Home - Anomymous
    app.get("/", controllers.home.index);
    app.get("/index.html", controllers.home.index);

    // Users - Amonymous
    app.get("/users/register", controllers.users.registerGet);
    app.post("/users/register", controllers.users.registerPost);
    app.get("/users/login", controllers.users.loginGet);
    app.post("/users/login", controllers.users.loginPost);
    app.post("/users/logout", controllers.users.logout);

    // Products
    app.get(
        "/products/create",
        auth.isInRole(roleAdmin), // Admin Role
        controllers.products.createGet
    );
    app.post(
        "/products/create",
        auth.isInRole(roleAdmin), // Admin Role
        controllers.products.createPost
    );

    // Orders
    app.get(
        "/orders/create/:id",
        auth.isAuthenticated, // Authenticated
        controllers.orders.createGet
    );
    app.post(
        "/orders/create",
        auth.isAuthenticated, // Authenticated
        controllers.orders.createPost
    );
    app.get(
        "/orders/status",
        auth.isAuthenticated, // Authenticated
        controllers.orders.status
    );
    app.get(
        "/orders/details/:id",
        auth.isAuthenticated, // Authenticated
        controllers.orders.details
    );
    app.get(
        "/orders/all",
        auth.isInRole(roleAdmin), // Admin
        controllers.orders.allGet
    );
    app.post(
        "/orders/manage",
        auth.isInRole(roleAdmin), // Admin
        controllers.orders.manageStatusPost
    );

    // Global Error Handler
    app.all("*", (req, res) => {
        res.status(404);
        res.send("404 Not Found!");
        res.end();
    });
};
