const Book = require("../data/Book");

module.exports = {
    getAddBook: (req, res) => {
        res.render("books/add");
    },
    postAddBook: (req, res) => {
        let book = req.body;

        // Data validation
        if (!book.title || !book.imageUrl) {
            book.error = "Title and Image URL are required";
            res.render("books/add", book); // return directly object!
        }

        book.releaseDate = new Date(book.releaseDate);

        // Create new entity
        Book.create(book).then(() => {
            res.redirect("/all");
        });
    },
    getAll: (req, res) => {
        Book.find()
            .sort("-releaseDate") // NB!
            .then(books => {
                res.render("books/all", { books }); // arr as obj
            });
    },
    getDetails: (req, res) => {
        const id = req.params.id;

        Book.findById(id).then(book => {
            res.render("books/details", book);
        });
    }
};
