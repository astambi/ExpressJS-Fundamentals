const fs = require("fs");

const Image = require("mongoose").model("Image");
const Tag = require("mongoose").model("Tag");

module.exports = (req, res) => {
    if (req.pathname === "/search") {
        fs.readFile("./views/results.html", "utf8", (err, file) => {
            if (err) {
                throw err;
            }

            const params = {};
            if (req.pathquery.afterDate) {
                //TODO
            }
            if (req.pathquery.beforeDate) {
                //TODO
            }
            if (req.pathquery.Limit) {
                //TODO
            }
            if (req.pathquery.tagName) {
                const tags = req.pathquery.tagName
                    .split(",")
                    .filter(e => e.length > 0);

                if (tags.length > 0) {
                    Tag.find({ tagName: { $in: tags } }).then(data => {
                        // console.log(data);
                        const tagIds = data.map(m => m._id);
                        params.tags = tagIds;
                        getImages(params);
                    });
                } else {
                    getImages(params);
                }
            }

            file = getImages(params, file, res);
        });
    } else {
        return true;
    }
};

function getImages(params, file, res) {
    Image.find(params).then(data => {
        let imageHtml = "";
        for (let image of data) {
            imageHtml += imageTemplate(image);
        }
        file = file.replace("<div class='replaceMe'></div>", imageHtml);
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.write(file);
        res.end();
    });
    return file;
}

function imageTemplate(image) {
    return `<fieldset id="${image._id}">
            <img src="${image.url}"></img>
            <p>${image.description}<p/>
            <button onclick='location.href="/delete?id=${
                image._id
            }"'class='deleteBtn'>Delete
            </button>
            </fieldset>`;
}
