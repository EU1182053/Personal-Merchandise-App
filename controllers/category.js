const category = require("../models/category");
const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.json({
        error: "Not Found",
      });
    }

    req.profile = cate;
    next();
  });
};
exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        err: "category stopped",
      });
    }
    return res.json(category);
  });
};

exports.updateCategory = (req, res) => {
  Category.findByIdAndUpdate(
    {_id: req.profile._id},
    {$set: req.body},
    {new: true},
    (err, cate) => {
      if(err){
        return res.json({
          error:"Getting error while updating"
        })

      }
      return res.json(cate)
    }
  )
}

exports.showAllCategory = (req, res) => {
  
  Category.find().exec(
  (err, category) => {
  if(err || !category){ 
    return res.json({ 
      error:"Categories are absent"
    })
  }
  return res.json(category)
})
}

//sec-10 update our inventory remaining