const productService = require("../services/product-service");
const orderService = require("../services/order-service");

module.exports = {
    createGet: async (req, res) => {
        const id = req.params.id;
        const product = await productService.getById(id);

        res.render("orders/create", product);
    },
    createPost: async (req, res) => {
        // res.json(req.body);
        const data = req.body;
        data.creatorId = req.user.id; // NB!

        try {
            const order = await orderService.create(data);
            res.redirect(`/orders/details/${order._id}`);
        } catch (err) {
            console.log(err);
            res.locals.globalError = "Invalid order data";

            res.render("orders/create");
        }
    },
    status: async (req, res) => {
        const userId = req.user.id;

        // Get orders with Product details
        const orders = await orderService.getByUserId(userId);

        // Create custom properties => Map by primary key!
        orders.map(o => {
            o.productName = o.productId.productName; // virtual prop
        });

        res.render("orders/status", {
            orders
        });
    },
    details: async (req, res) => {
        const orderId = req.params.id;
        const order = await orderService.getById(orderId);

        order.productName = order.productId.productName; // virtual prop
        order.imageUrl = order.productId.imageUrl;

        res.render("orders/details", order);
    },
    allGet: async (req, res) => {
        // Get orders with Product details
        const orders = await orderService.getAll();

        // Create custome properties => Map by primary key!
        orders.map(o => {
            o.productName = o.productId.productName; // virtual prop
        });

        res.render("orders/all", {
            orders
        });
    },
    manageStatusPost: async (req, res) => {
        // id: status
        const data = req.body;

        try {
            for (const id in data) {
                await orderService.updateStatus(id, data[id]);
            }

            res.redirect("/");
        } catch (err) {
            console.log(err);
            res.locals.globalError = "Invalid order data";

            res.redirect("/");
        }
    }
};
