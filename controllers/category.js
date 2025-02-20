const category = require("../models/category");
const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(404).json({
        error: "Category Not Found",
      });
    }

    req.profile = category;
    next();
  });
};

// create a new category
exports.createCategory = (req, res) => {
  const category = new Category(req.body);

  category.save((err, savedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to create category",
      });
    }
    return res.status(200).json({"savedCategory":savedCategory});
  });
};

// update a category
exports.updateCategory = (req, res) => {
  Category.findByIdAndUpdate(
    {_id: req.profile._id},
    {$set: req.body},
    {new: true},
    (err, updatedCategory) => {
      if(err){
        return res.status(400).json({
          error:"Failed to update category"
        })

      }
      return res.status(200).json({"updatedCategory":updatedCategory})
    }
  )
}

// Fetch all categories
exports.showAllCategory = (req, res) => {
  
  Category.find().exec(
  (err, categories) => {
  if(err || !categories.length){ 
    return res.status(404).json({ 
      error:"No categories found"
    }) 
  } 
  return res.status(200).json({"categories": categories});
})
}

//sec-10 update our inventory remaining