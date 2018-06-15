const productService = require("../services/product-service");
const orderService = require("../services/order-service");

function toShortDate(date) {
    return date.toString().substr(0, 21);
}

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

        // Create custome properties => Map by primary key!
        orders.map(o => {
            (o.productName = productService.getName(
                o.productId.category,
                o.productId.size
            )),
                (o.orderShortDate = toShortDate(o.orderDate));
        });

        res.render("orders/status", {
            orders
        });
    },
    details: async (req, res) => {
        const orderId = req.params.id;
        const order = await orderService.getById(orderId);

        order.productName = productService.getName(
            order.productId.category,
            order.productId.size
        );

        order.orderShortDate = toShortDate(order.orderDate);
        order.imageUrl = order.productId.imageUrl;

        order.statusPending = order.status === "Pending";
        order.statusInProgress = order.status === "In progress";
        order.statusInTransit = order.status === "In transit";
        order.statusDelivered = order.status === "Delivered";

        res.render("orders/details", order);
    },
    allGet: async (req, res) => {
        // Get orders with Product details
        const orders = await orderService.getAll();

        // Create custome properties => Map by primary key!
        orders.map(o => {
            (o.productName = productService.getName(
                o.productId.category,
                o.productId.size
            )),
                (o.orderShortDate = toShortDate(o.orderDate)),
                (o.statusPending = o.status === "Pending"),
                (o.statusInProgress = o.status === "In Progress"),
                (o.statusInTransit = o.status === "In Transit"),
                (o.statusDelivered = o.status === "Delivered");
        });

        res.render("orders/all", {
            orders
        });
    },
    manageStatusPost: (req, res) => {
        // id: status
        const data = req.body;

        try {
            for (const id in data) {
                
                orderService.updateStatus(id, data[id]);
            }

            res.redirect("/");
        } catch (err) {
            console.log(err);
            res.locals.globalError = "Invalid order data";

            res.redirect("/");
        }
    }
};
