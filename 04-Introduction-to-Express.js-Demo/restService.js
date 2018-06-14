const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const catsRouter = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

catsRouter.get("/:id", (req, res) => {
    res.send(`Cat ${req.params.id}`);
});
catsRouter.get("/", (req, res) => {
    res.send("All Cats");
});
catsRouter.post("/", (req, res) => {
    res.send("Cat saved");
});
catsRouter.delete("/:id", (req, res) => {
    res.send("Cat deleted");
});

app.use("/cats", catsRouter);

module.exports = app;
