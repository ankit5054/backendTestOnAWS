const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: `Cannot Find the order of Id : ${id} `,
        });
      }
      req.order = order;
      next();
    });
};

// Create
exports.createOrder = (req, res) => {
  req.body.order.user = req.profile._id;
  const order = new Order(req.body.order);
  order.save((err, savedOrder) => {
    if (err || !savedOrder) {
      return res.status(400).json({
        error: "Unable to save Order ",
      });
    }
    return res.status(200).json({
      message: "Order Added to the DB.",
      savedOrder,
    });
  });
};

exports.listOrder = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          message: "Order Not Found In DB !!",
        });
      }
      res.json(order);
    });
};

exports.getStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (er) {
        return res.status(400).json({
          error: "Cannot update order status",
        });
      }
      req.order = order;
      return res.json(order);
    }
  );
};
