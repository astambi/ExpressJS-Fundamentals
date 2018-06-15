const app = require("express")();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const passport = require("passport");

// const authRouter = require("./auth-manual");
const authRouter = require("./auth");

const port = 1337;

// Add middleware
// View engine
app.engine(".hbs", handlebars({ extname: ".hbs" }));
app.set("view engine", "hbs");

// Cookie parser
app.use(cookieParser()); // NB! ()

// Session
app.use(
    session({
        secret: "myTopSECret !@#!$#@!$#"
        // secret: process.env.SESSION_SECRET // cmd => set SESSION_SECRET="..."
    })
);

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Authentication
app.use("/auth", authRouter); // NB! refore manual auth middleware

function isAuthenticated(req, res, next) {
    if (req.user === undefined) {
        return res.redirect("/auth/login");
    }

    next();
}
// // Manual Auth
// app.use((req, res, next) => {
//     if (req.session.user === undefined) {
//         return res.redirect("/auth/login");
//     }
//     next();
// });

// Shopping Cart implementation with session
const products = [
    { name: "Apple", price: 5.25 },
    { name: "Banana", price: 1.5 },
    { name: "Orange", price: 3.25 }
];

// Rounting
app.get("/", (req, res) => {
    // const username = req.session.user.username; // manual auth
    const username = (req.user || { username: "anonymous" }).username;

    const cartItems = (req.session.cart || []).length;
    const message = req.session.message;
    req.session.message = "";

    res.render("index", {
        products,
        cartItems,
        message,
        username
    }); // as obj!
});
app.get("/add/:id", (req, res) => {
    // Init cart
    if (req.session.cart === undefined) {
        req.session.cart = [];
    }

    // Add product
    const id = req.params.id;
    const product = products[+id];

    req.session.cart.push(product);
    req.session.message = "Product added";

    res.redirect("/");
});
app.get("/readSession", (req, res) => {
    res.json(req.session);
});
// Authenticated users only
app.get("/cart", isAuthenticated, (req, res) => {
    const itemsInCart = req.session.cart || [];
    const itemsCount = itemsInCart.length;

    let total = 0;
    for (const item of itemsInCart) {
        total += item.price;
    }

    res.render("cart", { itemsInCart, itemsCount, total });
});
app.get("/remove/:id", (req, res) => {
    const items = req.session.cart || [];
    const id = req.params.id;
    req.session.cart = items.filter((p, i) => i !== +id);

    res.redirect("/cart");
});

app.listen(port, () => {
    console.log(`Server up and running on port ${port}`);
});
