const router = require("express").Router();
const viewHomePath = "./source/views/home.html";

router.get("/", (req, res) => {
    res.sendfile(viewHomePath);
});

module.exports = router;
