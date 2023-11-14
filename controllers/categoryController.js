const Category = require("../models/categoryModel");
const fs = require("fs");

// create category
exports.createCategory = async (req, res) => {
  const { categoryName } = req.body;

  if (req.user._id && req.user.admin) {
    try {
      const existingCategory = await User.findOne({
        categoryName: categoryName,
      });
      if (existingCategory) {
        return res.status(400).json({ message: "Category already exists" });
      }
      const categoryImages = req.file.path;

      const newCategory = await Category.create({
        categoryImage: categoryImages,
        categoryName: categoryName,
      });
      return res
        .status(500)
        .json({ message: "Category created successfully", newCategory });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "something went wrong", error: error.message });
    }
  } else {
    return res
      .status(403)
      .json({ message: "Unauthorized. Only admin users can create cars." });
  } 
};

// get all category
exports.getCategory = async(req,res) => {
  try{

      const category = await Category.find();
      if (category.length === 0) {
          return res.status(404).json({ message: "No categories found" });
      }

      return res.status(200).json({category:category});
      
  }
  catch(error){
      return res.status(500).json({message: "unable to get category",error: error.message})
  }
}

// get one category
exports.getOneCategory = async(req,res) =>{
  const {id} = req.params
  try{
      const category = await Category.findById(id)
      if (!category) {
          return res.status(404).json({ message: "category not found" });
      }
      return res.status(200).json({message: "category found", category})
  }
  catch(error){
      
      return res.status(200).json({message: "category not found", error: error.message})
  }
}

// update category

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if a new image file is uploaded and update the image path in updateData
  if (req.file) {
      updateData.categoryImage = req.file.path;
  }

  try {
      // Find the category by its ID
      const category = await Category.findById(id);

      if (!category) {
          return res.status(404).json({ message: "Category not found" });
      }

      // Check if an old image exists and if a new image is uploaded
      if (req.file && category.categoryImage) {
          // Delete the old image
          fs.unlinkSync(category.categoryImage); 
      }

      // Update the category data and return the updated category
      const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });

      if (!updatedCategory) {
          return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({ category: updatedCategory });
  } catch (error) {
      return res.status(500).json({ message: 'Unable to update car', error: error.message });
  }
};

// delete category
exports.deleteCategory = async(req,res) => {
  const {id} = req.params
  try{
      // const category = await Category.findById(id)
      // if (!category) {
      //     return res.status(404).json({ message: 'Category not found' });
      // }

      // Delete the car from the database
      await Category.findByIdAndRemove(id);
      return res.status(200).json({ message: 'Category deleted successfully'})
  }
  catch(error){
      
      return res.status(500).json({ message: 'Category not deleted', error: error.message})
  }
}
