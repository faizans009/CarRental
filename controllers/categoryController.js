const categoryService = require('../services/categoryService');
const fs = require("fs");
const ResponseHandler = require("../utils/responseHandler")

// create category
exports.createCategory = async (req, res) => {
  const { companyName } = req.body;

  if (req.user._id && req.user.admin) {
    try {
      
      const categoryImages = req.file.path;

      const newCategory = await categoryService.createCategory({
        categoryImage: categoryImages,
        companyName: companyName,
      });
      return new ResponseHandler(res, 200,true,"Category created successfully",newCategory )
    } catch (error) {
      
      return new ResponseHandler(res, 500,false,error.message )
    }
  } else {
    return new ResponseHandler(res, 403,true,"Unauthorized. Only admin can create category" )
  } 
};

// get all category
exports.getCategory = async(req,res) => {
  try{
    const category = await categoryService.getCategory()
    if (category.length === 0) {
      return new ResponseHandler(res, 404,false,"No categories found" )
    }
      return new ResponseHandler(res, 200,true,"Car created successfully",category )
      
  } 
  catch(error){
    return new ResponseHandler(res, 500,false,error.message )
  } 
}

exports.getCarByCategory = async(req,res) => {
  try{
     const {companyName} = req.body;
     const cars = await categoryService.getCarsByCategory(companyName);
     if (cars.length === 0) {
      return new ResponseHandler(res, 404,false,"No car found with that company" )
    }
     return new ResponseHandler(res, 200,true,"get Cars with company name",cars )
  }
  catch(error){
    return new ResponseHandler(res, 200,true,error.message )
  }
} 
 
// get one category
exports.getOneCategory = async(req,res) =>{
  const {id} = req.params
  try{
      const category = await categoryService.getOneCategory(id)
      if (!category) {
        return new ResponseHandler(res, 404,false,"Category not found" )
      }
      return new ResponseHandler(res, 200,true,"Category found",category )
  }
  catch(error){
    return new ResponseHandler(res, 200,true,error.message )
  }
}
// update category
exports.updateCategory = async (req, res) => {
  
  if (req.user._id && req.user.admin) {
  try {
    const { id } = req.params;
  const updateData = req.body;

  // Check if a new image file is uploaded and update the image path in updateData
  if (req.file) {
      updateData.categoryImage = req.file.path;
  }
      // Find the category by its ID
      const category = await Category.findById(id);

      if (!category) {
        return new ResponseHandler(res, 404,false,"Category not found" )
      }

      // Check if an old image exists and if a new image is uploaded
      if (req.file && category.categoryImage) {
          // Delete the old image
          fs.unlinkSync(category.categoryImage); 
      }

      const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });

      if (!updatedCategory) {
        return new ResponseHandler(res, 404,false,"Category not found" )
      }

      return new ResponseHandler(res, 200,true,"Category updated successfully",updatedCategory )
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message )
  }
} else {
  return new ResponseHandler(res, 403,true,"Unauthorized. Only admin can update  category" )
} 
};

// delete category
exports.deleteCategory = async(req,res) => {
  if (req.user._id && req.user.admin) {
  try{
    const {id} = req.params
      await categoryService.deleteCategory(id);
      return new ResponseHandler(res, 200,true,"Category deleted successfully" )
  }
  catch(error){
    return new ResponseHandler(res, 500,true,error.message )
  }
} else {
  return new ResponseHandler(res, 403,true,"Unauthorized. Only admin can delete category" )
} 
}


