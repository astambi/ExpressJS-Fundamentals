const formidable = require("formidable");

const ObjectId = require("mongoose").Types.ObjectId;
const Image = require("mongoose").model("Image");

function addImage(req, res) {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        if (err) {
            throw err;
        }

        // console.log(fields.tagsID); // name! in view
        // console.log(fields);
        const tags = fields.tagsID
            .split(",")
            .reduce((prev, current, index, arr) => {
                if (prev.includes(current) || current.length === 0) {
                    return prev;
                } else {
                    prev.push(current);
                    return prev;
                }
            }, [])
            .map(ObjectId);
        // console.log(tags);

        // Redirect to Home
        res.writeHead(302, {
            location: "/"
        });
        res.end();

        const image = {
            url: fields.imageUrl,
            description: fields.description,
            tags
        };

        Image.create(image)
            .then(image => {
                // Redirect to Home
                res.writeHead(302, {
                    location: "/"
                });
                res.end();
            })
            .catch(err => {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                res.write("500 Server Error");
                res.end();
            });
    });
}

function deleteImg(req, res) {
    // console.log(req.pathquery);
    Image.deleteOne({ _id: req.pathquery.id })
        .then(() => {
            // Redirect to Home
            res.writeHead(302, {
                location: "/"
            });
            res.end();
        })
        .catch(err => {
            res.writeHead(500, {
                "Content-Type": "text/plain"
            });
            res.write("500 Server Error");
            res.end();
        });
}

module.exports = (req, res) => {
    if (req.pathname === "/addImage" && req.method === "POST") {
        addImage(req, res);
    } else if (req.pathname === "/delete" && req.method === "GET") {
        // fix GET => DELETE
        deleteImg(req, res);
    } else {
        return true;
    }
};
