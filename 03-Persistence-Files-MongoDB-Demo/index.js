// fileUpload();
// mongoDbDemo();
mongooseDemo();

function mongooseDemo() {
    const mongoose = require("mongoose");
    const connectionStr = "mongodb://localhost:27017/catsDb"; // db

    // models
    // let Cat = mongoose.model("Cat", {
    //     name: {
    //         type: String,
    //         required: true
    //     },
    //     age: {
    //         type: Number,
    //         required: true
    //     },
    //     color: {
    //         type: String
    //     }
    // });

    // let Owner = mongoose.model("Owner", {
    //     firstName: { type: String, required: true },
    //     lastName: { type: String, require: true },
    //     cats: [Cat.schema]
    // });

    let catSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true,
            minlength: 2,
            maxlength: 100
        },
        age: {
            type: String,
            required: true,
            min: 0,
            max: 100
        },
        color: {
            type: String
        }
    });

    // no arrow functions!
    catSchema.methods.sayHello = function() {
        return `Hello from ${this.name}!`;
    };

    // no arrow functions!
    // properties that do not go into the db
    catSchema.virtual("description").get(function() {
        return `${this.name} - ${this.age}`; // property
    });

    // custom validation
    catSchema.path("age").validate(function() {
        return this.age >= 1 && this.age <= 20;
    }, "Age must be greater than 0 & less than 100");

    let Cat = mongoose.model("Cat", catSchema);

    mongoose.connect(connectionStr).then(() => {
        // Cat.find()
        //     .then(cats => {
        //         let owner = new Owner({
        //             firstName: "Owner",
        //             lastName: "Smith",
        //             cats
        //         });

        //         owner.save();

        //         console.log(owner);
        //     })
        //     .catch(err => console.log(err));

        // Cat.findOne({})
        //     .then(cat => {
        //         console.log(cat.sayHello());
        //         console.log(cat.description);
        //     })
        //     .catch(err => console.log(err));

        let cat = new Cat({
            age: 1
        });

        cat.save().catch(err => console.log(err));
    });
}

function mongoDbDemo() {
    const mongodb = require("mongodb");
    const connectionStr = "mongodb://localhost:27017/jsweb"; // folder

    mongodb.MongoClient.connect(connectionStr).then(client => {
        let db = client.db("catsDb");

        let cats = db.collection("cats");

        cats.insert({
            name: "Nakov",
            age: 35,
            status: "online"
        });

        cats.find()
            .toArray()
            .then(cats => console.log(cats));
    });
}

function fileUpload() {
    const http = require("http");
    const fs = require("fs");
    const formidable = require("formidable");

    http.createServer((req, res) => {
        if (req.method === "GET") {
            fs.readFile("./index.html", "utf8", (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.write(data);
                res.end();
            });
        } else if (req.method === "POST") {
            let form = new formidable.IncomingForm();
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(files);
                let file = files.upload; // name
                let tempPath = file.path;
                let fileName = file.name;
                fs.rename(tempPath, `./files/${fileName}`, err => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    res.write("Thanks you!");
                    res.end();
                });
            });
        }
    }).listen(1337);
}
