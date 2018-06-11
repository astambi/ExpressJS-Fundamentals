const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const shortid = require("shortid");

// Services
const memeService = require("../services/memeService");
const genreService = require("../services/genreService");

// Templates
const memeTemplates = require("../infrastructure/memeTemplates");
const uiTemplates = require("../infrastructure/uiTemplates");
const placeholderTemplates = require("../infrastructure/placeholderTemplates");

// View paths
const viewAddGenrePath = "./source/views/addGenre.html";
const viewAddMemePath = "./source/views/addMeme.html";
const viewDetailsPath = "./source/views/details.html";
const viewAllMemesPath = "./source/views/viewAll.html";

// Notifications
const statusSuccess = "success";
const statusError = "error";
const statusExists = "exists";

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

let memesAll = (req, res) => {
    memeService.getAll().then(data => {
        fs.readFile(viewAllMemesPath, (err, html) => {
            // Read View
            if (err) {
                console.log(err);
                return;
            }

            // Update View
            data = data
                .sort((a, b) => b.dateStamp - a.dateStamp)
                .filter(meme => meme.privacy === "on");

            let memesContent = "";
            for (let meme of data) {
                memesContent += memeTemplates.viewAll(meme._id, meme.memeSrc);
            }

            html = html
                .toString()
                .replace(placeholderTemplates.placeholder, memesContent);

            res.send(html);
        });
    });
};

let memeDetails = (req, res) => {
    let memeId = req.params.id;
    memeService
        .get(memeId)
        .then(meme => {
            // Meme does not exist
            if (!meme) {
                res.redirect("/memes/viewAllMemes");
                return;
            }

            fs.readFile(viewDetailsPath, (err, data) => {
                // Read View
                if (err) {
                    console.log(err);
                    return;
                }

                // Update View
                let detailsContent = memeTemplates.details(
                    meme.memeSrc,
                    meme.title,
                    meme.description,
                    memeId
                );

                let html = data
                    .toString()
                    .replace(placeholderTemplates.placeholder, detailsContent);

                res.send(html);
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect("/memes/viewAllMemes");
        });
};

let addMemeView = (req, res, status = null) => {
    fs.readFile(viewAddMemePath, (err, data) => {
        // Read View
        if (err) {
            console.log(err);
            return;
        }

        // Add status msg
        if (status === statusError) {
            data = data
                .toString()
                .replace(
                    placeholderTemplates.placeholder,
                    uiTemplates.errorMessage()
                );
        }
        if (status === statusSuccess) {
            data = data
                .toString()
                .replace(
                    placeholderTemplates.placeholder,
                    uiTemplates.successMessage()
                );
        }

        // Update View
        genreService.getAll().then(genres => {
            // Add Genres options
            let genresContent = "";
            for (let genre of genres) {
                genresContent += memeTemplates.genreOption(
                    genre._id,
                    genre.title
                );
            }

            let html = data
                .toString()
                .replace(placeholderTemplates.placeholder2, genresContent);

            res.send(html);
        });
    });
};

// POST
let createMeme = (req, res) => {
    let fields = req.body;
    let files = req.files;

    // Validate Form data
    if (fieldChecker(fields) || !files.meme) {
        addMemeView(req, res, statusError);
        return;
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
                    addMemeView(req, res, statusError);
                    return;
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
                        addMemeView(req, res, statusSuccess);
                    })
                    .catch(() => {
                        addMemeView(req, res, statusError);
                    });
            });
        });
    });
};

let addGenreView = (req, res, status = null) => {
    fs.readFile(viewAddGenrePath, (err, data) => {
        // Read View
        if (err) {
            console.log(err);
        }

        // Add status msg
        if (status === statusError) {
            data = data
                .toString()
                .replace(
                    placeholderTemplates.placeholder,
                    uiTemplates.errorMessage()
                );
        }
        if (status === statusSuccess) {
            data = data
                .toString()
                .replace(
                    placeholderTemplates.placeholder,
                    uiTemplates.successMessage()
                );
        }
        if (status === statusExists) {
            data = data
                .toString()
                .replace(
                    placeholderTemplates.placeholder,
                    uiTemplates.entityExistsMessage()
                );
        }

        let html = data.toString();

        res.send(html);
    });
};

// POST
let createGenre = (req, res) => {
    let fields = req.body;

    // Validate form data
    if (fieldChecker(fields)) {
        addGenreView(req, res, statusError);
        return;
    }

    // Create entity
    let newGenre = genreGenerator(fields.genreTitle.trim());

    // Add to db
    genreService
        .create(newGenre)
        .then(() => {
            addGenreView(req, res, statusSuccess);
        })
        .catch(() => {
            addGenreView(req, res, statusExists);
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

router
    .get("/viewAllMemes", (req, res) => memesAll(req, res))
    .get("/addGenre", (req, res) => addGenreView(req, res))
    .post("/addGenre", (req, res) => createGenre(req, res))
    .get("/addMeme", (req, res) => addMemeView(req, res))
    .post("/addMeme", (req, res) => createMeme(req, res))
    .get("/delete/:id", (req, res) => deleteMeme(req, res))
    .get("/:id", (req, res) => memeDetails(req, res)); // memes/{id}

module.exports = router;
