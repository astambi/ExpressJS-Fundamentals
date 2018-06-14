const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const shortid = require("shortid");

// Services
const memeService = require("../services/memeService");
const genreService = require("../services/genreService");

// Notifications
const statusSuccess = "Success!";
const statusError = "Please fill all data";
const statusExists = "Entity already exists";

let memeGenerator = (title, memeSrc, description, privacy, genreId) => {
    return {
        title: title,
        memeSrc: memeSrc,
        description: description,
        privacy: privacy,
        dateStamp: Date.now(),
        genreId: genreId
    };
};

let genreGenerator = title => {
    return {
        title: title,
        memes: []
    };
};

let fieldChecker = obj => {
    for (let prop in obj) {
        if (obj[prop].toString().trim() === "") {
            return true;
        }
    }
};

// Memes
let memesAll = (req, res) => {
    memeService.getAll().then(memes => {
        memes = memes
            .sort((a, b) => b.dateStamp - a.dateStamp)
            .filter(meme => meme.privacy === "on");

        return res.render("viewAll", { memes });
    });
};

let memeDetails = (req, res) => {
    let memeId = req.params.id;

    memeService
        .get(memeId)
        .then(meme => {
            if (!meme) {
                return res.redirect("/memes/viewAllMemes");
            }

            return res.render("details", meme);
        })
        .catch(err => {
            console.log(err);
            return res.redirect("/memes/viewAllMemes");
        });
};

let addMemeView = (req, res, status = null) => {
    genreService.getAll().then(genres => {
        return res.render("addMeme", { genres, status });
    });
};

// POST
let createMeme = (req, res) => {
    let fields = req.body;
    let files = req.files;

    // Validate Form data
    if (fieldChecker(fields) || !files.meme) {
        return res.render("addMeme", { status: statusError });
    }

    memeService.getAll().then(allMemes => {
        // Dir & file path
        let fileName = shortid.generate() + ".jpg";
        let dirName = `/public/memeStorage/${Math.ceil(allMemes.length / 10)}`;
        let relativeFilePath = dirName + "/" + fileName;
        let absoluteDirPath = path.join(__dirname, `../../${dirName}`);
        let absoluteFilePath = absoluteDirPath + "/" + fileName;

        fs.access(absoluteDirPath, err => {
            // Validate file dir
            if (err) {
                fs.mkdirSync(absoluteDirPath);
            }

            // Save file to server
            let memeFile = files.meme;

            memeFile.mv(absoluteFilePath, err => {
                // Validate file path
                if (err) {
                    console.log(err);
                    return res.render("addMeme", { status: statusError });
                }

                // Create entity
                let newMeme = memeGenerator(
                    fields.memeTitle.trim(),
                    relativeFilePath,
                    fields.memeDescription.trim(),
                    fields.status,
                    fields.genreSelect
                );

                // Save to db
                memeService
                    .create(newMeme)
                    .then(() => {
                        return res.redirect("/memes/viewAllMemes");
                    })
                    .catch(() => {
                        return res.render("addMeme", { status: statusExists });
                    });
            });
        });
    });
};

let deleteMeme = (req, res) => {
    let memeId = req.params.id;
    memeService
        .delete(memeId)
        .then(() => {
            res.redirect("/memes/viewAllMemes");
        })
        .catch(err => {
            res.redirect(`/memes/${memeId}`);
        });
};

// Genres
let genresAll = (req, res) => {
    genreService.getAll().then(genres => {
        genres.sort((a, b) => {
            a = a.title.toLowerCase();
            b = b.title.toLowerCase();
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });

        return res.render("viewAllGenres", { genres });
    });
};

let addGenreView = (req, res, status = null) => {
    return res.render("addGenre", status);
};

// POST
let createGenre = (req, res) => {
    let fields = req.body;

    // Validate form data
    if (fieldChecker(fields)) {
        return res.render("addGenre", { status: statusError });
    }

    // Create entity
    let newGenre = genreGenerator(fields.genreTitle.trim());

    // Add to db
    genreService
        .create(newGenre)
        .then(() => {
            return res.redirect("viewAllGenres");
        })
        .catch(() => {
            return res.render("addGenre", { status: statusExists });
        });
};

router
    .get("/viewAllMemes", (req, res) => memesAll(req, res))
    .get("/viewAllGenres", (req, res) => genresAll(req, res))
    .get("/addMeme", (req, res) => addMemeView(req, res))
    .post("/addMeme", (req, res) => createMeme(req, res))
    .get("/addGenre", (req, res) => addGenreView(req, res))
    .post("/addGenre", (req, res) => createGenre(req, res))
    .get("/delete/:id", (req, res) => deleteMeme(req, res))
    .get("/:id", (req, res) => memeDetails(req, res)); // memes/{id}

module.exports = router;
