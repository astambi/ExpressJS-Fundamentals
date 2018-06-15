const router = require("express").Router();
const encryption = require("./encryption");
const passport = require("passport");
const LocalPassport = require("passport-local");

const users = [];

// const user = {
//     _id,
//     username,
//     salt,
//     hashedPassword
// };

passport.use(
    new LocalPassport((username, password, done) => {
        const user = users.filter(u => u.username === username)[0];

        if (user !== undefined) {
            const hashedPassword = encryption.generateHashedPassword(
                user.salt,
                password
            );

            if (user.hashedPassword === hashedPassword) {
                return done(null, user);
            }
        }

        return done(null, false);
    })
);
passport.serializeUser((user, done) => {
    if (user) {
        return done(null, user._id);
    }
});
passport.deserializeUser((id, done) => {
    const user = users.filter(u => u._id === id)[0];

    if (user) {
        return done(null, user);
    }

    return done(null, false);
});

// Auth Routes
router.get("/login", (req, res) => {
    const message = req.session.message;
    req.session.message = "";

    res.render("login", {
        message,
        inputData: req.session.inputData
    });
});

// Auth with local strategy
router.post("/login", passport.authenticate("local"), (req, res) => {
    req.session.message = "Login successful";
    res.redirect("/");
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
        _id: encryption.generateId(),
        username,
        salt,
        hashedPassword
    };
    users.push(user);

    // Login
    req.login(user, err => {
        if (err) {
            return sendError("Something went wrong");
        }

        req.session.message = "Successfull registration";
        console.log(user);
        res.redirect("/");
    });

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
