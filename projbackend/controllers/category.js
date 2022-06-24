const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err || !cate) {
      return res.status(400).json({
        error: "Category of this Id does not exist!!",
      });
    }
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, cate) => {
    if (err || !cate) {
      return(res.status(400).json({
        error: "Category already exist in DB",
      }))
    }
    return res.json(category);
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, items) => {
    if (err || !items) {
      res.retrun(400).json({
        error: "No Category Found !!",
      });
    }
    return res.json(items);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, cate) => {
    if (err || !cate) {
      return res.status(400).json({
        error: "Unable to update Category",
      });
    }
    res.json(cate);
  });
};

exports.deleteCategory = (req, res) => {
  const category = req.category;

  category.remove((err, cate) => {
    if (err || !cate) {
      res.status(400).json({
        error: `Unable to Remove Category ${req.category.name}`,
      });
    }
    return res.json({
      message: `Sucessfully Deleted ${cate.name}`,
    });
  });
};
