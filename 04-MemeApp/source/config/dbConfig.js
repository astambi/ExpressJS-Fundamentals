const mongoose = require("mongoose");
const Admin = mongoose.mongo.Admin;
mongoose.Promise = Promise; // standard js promise

const memeService = require("../services/memeService");
const genreService = require("../services/genreService");
const initialData = require("../infrastructure/initialData");

const dbName = "memeDb";

module.exports = new Promise((resolve, reject) => {
    mongoose.connect(`mongodb://localhost:27017/${dbName}`);
    mongoose.connection
        .on("open", () => {
            console.log(
                `Successfully connected to MongoDB, ${dbName} database`
            );
            new Admin(mongoose.connection.db).listDatabases((err, result) => {
                // console.log(result);
                let database = result.databases
                    .map(d => d.name)
                    .filter(n => n === dbName)[0];
                if (!database) {
                    seed();
                }
                resolve();
            });
        })
        .on("error", err => {
            console.log(err);
            reject(err);
        });
});

function seed() {
    console.log("Seeding intial data...");
    genreService
        .create(initialData.genre) // a single genre
        .then(genre => {
            memeService.createRange(initialData.memes).then(memes => {
                memes.forEach(m => {
                    genre.memes.push(m._id);
                    m.genreId = genre._id;
                    m.save();
                });
                genre.save();
                console.log("Seed complete.");
            });
        })
        .catch(err => console.log(err));
}
