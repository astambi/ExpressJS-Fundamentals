const router = require("express").Router();
const encryption = require("./encryption");

const users = [];

router.get("/login", (req, res) => {
    const message = req.session.message;
    req.session.message = "";

    res.render("login", {
        message,
        inputData: req.session.inputData
    });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.filter(u => u.username === username)[0];

    if (user !== undefined) {
        const hashedPassword = encryption.generateHashedPassword(
            user.salt,
            password
        );

        if (user.hashedPassword === hashedPassword) {
            req.session.user = { username };
            req.session.message = "Login successful";

            delete req.session.inputData;

            return res.redirect("/");
        }
    }

    req.session.message = "Incorrect username or password";
    req.session.inputData = {
        username,
        password
    };

    res.redirect("/auth/login");
});

router.get("/register", (req, res) => {
    const message = req.session.message;
    req.session.message = "";

    res.render("register", {
        message,
        inputData: req.session.inputData
    });
});

router.post("/register", (req, res) => {
    const { username, password, repeatPassword } = req.body;

    // Validate input
    if (password !== repeatPassword) {
        return sendError("Passwords do not match");
    }

    const isExistingUser =
        users.filter(u => u.username === username).length > 0;
    if (isExistingUser) {
        return sendError(`User with username ${username} already registered`);
    }

    // Create in db
    const salt = encryption.generateSalt();
    const hashedPassword = encryption.generateHashedPassword(salt, password);

    const user = {
        username,
        salt,
        hashedPassword
    };
    users.push(user);

    // Login
    req.session.user = { username };
    req.session.message = "Successfull registration";
    res.redirect("/");

    function sendError(message) {
        req.session.inputData = {
            username,
            password,
            repeatPassword
        };

        req.session.message = message;

        return res.redirect("/auth/register");
    }
});

module.exports = router;
