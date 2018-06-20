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

    app.get(
        "/articles/create",
        auth.isAuthenticated,
        controllers.articles.createArticleGet
    );
    app.post(
        "/articles/create",
        auth.isAuthenticated,
        controllers.articles.createArticlePost
    );
    app.get("/articles/all", controllers.articles.allGet);
    app.get(
        "/articles/edit/:id",
        auth.isAuthenticated,
        controllers.articles.editGet
    );
    app.post(
        "/articles/edit",
        auth.isAuthenticated,
        controllers.articles.editPost
    );
    app.get(
        "/articles/history/:id",
        auth.isAuthenticated,
        controllers.articles.historyGet
    );
    app.get("/articles/latest", controllers.articles.latestGet);
    app.get("/articles/:id", controllers.articles.detailsGet);
    app.post(
        "/articles/lock/:id",
        auth.isInRole(roleAdmin),
        controllers.articles.lockPost
    );
    app.post(
        "/articles/unlock/:id",
        auth.isInRole(roleAdmin),
        controllers.articles.unlockPost
    );
    app.get("/edits/:id", auth.isAuthenticated, controllers.edits.detailsGet);

    // Global Error Handler
    app.all("*", (req, res) => {
        res.status(404);
        res.send("404 Not Found!");
        res.end();
    });
};
