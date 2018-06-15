const express = require("express");
const bodyParser = require("body-parser");

const cats = require("./cats-controller");
const api = require("./restService");

const app = express();
const port = 1337;

// Middleware
let middlewareFunc = (req, res, next) => {
    console.log("Log:" + req.method);
    next();
};

// Global middleware
app.use((req, res, next) => {
    console.log("Global middleware");
    next();
});

// req.body => parsed form
app.use(
    bodyParser.urlencoded({
        extended: true // parsing nexted forms
    })
);

// Static files // global middleware
app.use(express.static("public"));
// app.use("/static", express.static(__dirname + "/public"));

// Routes
// GET method route
app.get("/", (req, res) => {
    res.send("GET request to the homepage");
});
app.get("/home", (req, res) => {
    res.send("Hello from express!");
});

// POST method route
app.post("/create", (req, res) => {
    res.send("POST request to the homepage");
});

// PUT method route
app.put("/modify", (req, res) => {
    res.send("PUT request to the homepage");
});

// All methods route
app.all(
    "/about",
    (req, res, next) => {
        console.log("Middleware execution..");
        next();
    },
    (req, res) => {
        res.send("Show about page.");
    }
);

let authentication = (req, res, next) => {
    if (!user.isAuthenticated()) {
        console.log("Authenticated");
        res.redirect("/login");
    } else {
        next();
    }
};

// Middleware
app.get(
    "/authpage",
    authentication,
    // next func
    (req, res) => {
        res.send("About page!");
    }
);

// app.get("/middleware", middlewareFunc, (req, res) => {
//     res.send("Home after middleware!");
// });

// app.get("*", (req, res) => {
//     res.send("Matches everything");
// });

// app.get("/ab*cd", (req, res) => {
//     res.send("abcd, abANYTHINGcd");
// });

// app.get(/.*fly$/, (req, res) => {
//     res.send("butterfly, dragonfly");
// });

// Params /courses/15
app.get("/courses/:id/:title/:date", (req, res) => {
    let params = req.params;
    res.send(params);
});

app.get("/users/:userId(\\d+)", (req, res) => {
    let paramsObj = req.params;
    res.send(paramsObj);
});

app.post("/save-form", (req, res) => {
    console.log(req.body);
    console.log(req.body.firstName);
    console.log(+req.body.age); // number
    res.redirect("/about");
});

app.route("/home")
    .get((req, res) => {
        res.send("GET home page");
    })
    .post((req, res) => {
        res.send("POST home page");
    })
    .all((req, res) => {
        res.send("Everything else");
    });

app.route("/dload")
    .get((req, res) => {
        res.download("./index.js"); // relative path
    })
    .post((req, res) => {})
    .all((req, res) => {
        res.end();
    });

app.get("/file/:fileName", (req, res) => {
    let fileName = req.params.fileName;
    res.sendFile(__dirname + "/index.js"); // absolute path
    res.sendFile(__dirname + fileName); // absolute path
});

// Register Custom router
app.use("/cats", cats); // cats
app.use("/api", api); // router /api/cats/

// Last
app.get("*", (req, res) => {
    res.send("Sorry page not found!");
});

app.listen(port, () => console.log(`Running on port ${port}...`));
