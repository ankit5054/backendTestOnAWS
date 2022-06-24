const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { request } = require("http");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: `Unable to fetch the details of the product of Id: ${id}`,
        });
      }
      req.product = product;
      res.status(200).json({
        message: "Product saved in the req",
      });
      next();
    });
};

exports.createProduct = (req, res) => {
  const parseIp =  req.headers['x-forwarded-for']?.split(',').shift()
  || req.socket?.remoteAddress

  console.log(`IP Address : ${parseIp}`)

  let form = new formidable.IncomingForm();
  form.keepExtension = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem in Image",
      });
    }
    // Destructuring the fields
    const { price, name, description, category, stock } = fields;

    // Restrictions on Fields
    if (!name || !description || !price || !category || !stock) {
      // console.log(name, description, price, category, stock)
      return res.status(400).json({
        error: "Please fill all enteries",
      });
    }

    let product = new Product(fields);

    // handle files here
    if (file.photo) {
      if (file.photo.size > 3 * 1024 * 1024) {
        //3MB
        return res.status(400).json({
          error: "File Size too Big!!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // Save to the DB
    product.save((err, savedProd) => {
      if (err || !savedProd) {
        return res.status(400).json({
          error: "Unable to save the Data into the DB",
        });
      }
      res.status(200).json({
        message: " Successfully Saved into the DB",
      });
    });
  });
};

exports.getproduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.updateProduct = () => {
  let form = new formidable.IncomingForm();
  form.keepExtension = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem in Image",
      });
    }

    //   Updation Code
    let product = req.product;
    product = _.extend(product, fields);

    // handle files here
    if (file.photo) {
      if (file.photo.size > 3 * 1024 * 1024) {
        //3MB
        return res.status(400).json({
          error: "File Size too Big!!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // Save to the DB
    product.save((err, savedProd) => {
      if (err || !savedProd) {
        return res.status(400).json({
          error: "Unable to update the Data into the DB",
        });
      }
      res.status(200).json({
        message: " Successfully Saved into the DB",
      });
    });
  });
};
exports.removeProduct = (req, res) => {
  let product = req.product;
  product.remove((err, removedProduct) => {
    if (err) {
      return res.status(400).json({
        error: `Failed to delete the product : ${product.name}`,
      });
    }
    res.json({
      message: `Deleted successfully : ${product.name}`,
    });
  });
};

exports.getallproducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err || !products) {
        return res.status(400).json({
          error: "No Product Found in the DB !!",
        });
      }
      return res.status(200).json(products);
    });
};

// MiddleWares
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateStock = (req, res, next) => {
  let myOps = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOps, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk Operations Failed !!",
      });
    }
    next();
  });
};

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return res.status(400).json({
                error:"No Category Found !!"
            })
        }
        res.json(category)
    })
};
