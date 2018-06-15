const formidable = require("formidable");
const util = require("util");

const Tag = require("mongoose").model("Tag");

function jsonStringifyCircular(req) {
    let cache = [];
    return JSON.stringify(req, function(key, value) {
        if (typeof value === "object" && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Duplicate reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                } catch (error) {
                    // discard key if value cannot be deduped
                    return;
                }
            }
            // Store value in our collection
            cache.push(value);
        }

        return value;
    });
}

module.exports = (req, res) => {
    if (req.pathname === "/generateTag" && req.method === "POST") {
        // // Print Request
        // res.writeHead(200, {
        //     "Content-Type": "application/json"
        // });
        // res.write(jsonStringifyCircular(req));
        // res.end();

        // // Print Upload msg
        // res.write("received upload");
        // res.end(
        //     util.inspect({
        //         fields,
        //         files
        //     })
        // );

        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            res.writeHead(200, {
                "Content-Type": "text/plain"
            });

            const tagName = fields.tagName;

            // saving tag
            Tag.create({
                tagName,
                images: []
            })
                .then(tag => {
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
    } else {
        return true;
    }
};
