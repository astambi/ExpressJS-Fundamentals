const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const shortid = require("shortid");

// Services
const memeService = require("../services/memeService");
const genreService = require("../services/genreService");

// Notifications
const entityNotFound = (entity, id) => `${entity} #${id} not found`;
const entitySaved = entity => `${entity} successfully created`;
const entityDeleted = (entity, id) => `${entity} #${id} successfully deleted`;
const entityNotDeleted = (entity, id) => `Could not delete ${entity} #${id}`;
const dataNotFound = "Could not get data";
const dataIncomplete = "Data incomplete";

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
let getAllMemes = (req, res) => {
    memeService
        .getAll()
        .then(data => {
            data = data
                .sort((a, b) => b.dateStamp - a.dateStamp)
                .filter(meme => meme.privacy === "on");

            res.json(JSON.stringify(data));
        })
        .catch(err => res.json({ status: dataNotFound }));
};

let memeById = (req, res) => {
    let id = req.params.id;

    memeService.get(id).then(meme => {
        if (!meme) {
            res.json({
                status: entityNotFound("Meme", id)
            });
            return;
        }

        res.json(JSON.stringify(meme));
    });
};

let deleteMeme = (req, res) => {
    let id = req.params.id;

    memeService.get(id).then(meme => {
        if (!meme) {
            res.json({ status: entityNotFound("Meme", id) });
            return;
        }

        memeService
            .delete(id)
            .then(() => {
                res.json({ status: entityDeleted("Meme", id) });
            })
            .catch(err => {
                res.json({ status: entityNotDeleted("Meme", id) });
            });
    });
};

let saveMeme = (req, res) => {
    let fields = req.body;
    let files = req.files;

    // Validate Form data
    if (fieldChecker(fields) || !files.meme) {
        res.json({ status: dataIncomplete });
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
                    res.json({ status: err });
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
                        res.json({ status: entitySaved("Meme") });
                    })
                    .catch(err => {
                        res.json({ status: err });
                    });
            });
        });
    });
};

// Genres
let getAllGenres = (req, res) => {
    genreService
        .getAll()
        .then(data => {
            res.json(JSON.stringify(data));
        })
        .catch(err => res.json({ status: dataNotFound + " " + err }));
};

let genreById = (req, res) => {
    let id = req.params.id;

    genreService
        .get(id)
        .then(genre => {
            res.json(JSON.stringify(genre));
        })
        .catch(err => {
            res.json({ status: err });
        });
};

let deleteGenre = (req, res) => {
    let id = req.params.id;

    genreService
        .delete(id)
        .then(genre => {
            res.json({ status: entityDeleted("Genre", id) });
        })
        .catch(err => {
            res.json({ status: err });
        });
};

let saveGenre = (req, res) => {
    let genreTitle = req.body.genreTitle;

    // Validate form data
    if (!genreTitle || !genreTitle.trim()) {
        res.json({ status: dataIncomplete });
        return;
    }

    // Create entity
    let newGenre = genreGenerator(genreTitle.trim());

    // Add to db
    genreService
        .create(newGenre)
        .then(genre => {
            console.log(genre);
            res.json({ status: entitySaved("Genre") });
        })
        .catch(err => {
            res.json({ status: err });
        });
};

router
    .get("/memes/:id", (req, res) => memeById(req, res))
    .delete("/memes/:id", (req, res) => deleteMeme(req, res))
    .get("/memes/", (req, res) => getAllMemes(req, res))
    .post("/memes/", (req, res) => saveMeme(req, res));

router
    .get("/genres/:id", (req, res) => genreById(req, res))
    .delete("/genres/:id", (req, res) => deleteGenre(req, res))
    .get("/genres/", (req, res) => getAllGenres(req, res))
    .post("/genres/", (req, res) => saveGenre(req, res));

// TODO delete all, update

module.exports = router;
