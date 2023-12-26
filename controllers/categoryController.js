const Category = require("../models/categoryModel");
const ResponseHandler = require("../utils/responseHandler")

// create category
exports.createCategory = async (req, res) => {
  if (
    (req.user._id && req.user.role === "admin") ||
    req.user.role === "superAdmin"
  ) {
    try {
      const existingCategory = await Category.findOne({
                    companyName: req.body.companyName,
                  });
                  if (existingCategory) {
                    return new ResponseHandler(res, 400,false,"Category already exists" )
                  }

      const newCategory = await Category.create({
        categoryImage: req.body.categoryImage,
        companyName: req.body.companyName,
      });
      return new ResponseHandler(res, 200,true,"Category created successfully",newCategory )
    } catch (error) {
      
      return new ResponseHandler(res, 500,false,error.message )
    }
  } else {
    return new ResponseHandler(
      res,
      403,
      false,
      "Unauthorized. Only admin can get users"
    );
  }
  };

// get all category
exports.getCategory = async(req,res) => {
  try{
    const category = await Category.find()
    if (category.length === 0) {
      return new ResponseHandler(res, 404,false,"No categories found" )
    }
      return new ResponseHandler(res, 200,true,"Category created successfully",category )
      
  } 
  catch(error){
    return new ResponseHandler(res, 500,false,error.message )
  } 
}
 
// get one category
exports.getOneCategory = async(req,res) =>{
  const {id} = req.params
  try{
      const category = await Category.findById(id)
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
  
  if (
    (req.user._id && req.user.role === "admin") ||
    req.user.role === "superAdmin"
  ) {
  try {
    const { id } = req.params;
  // const updateData = req.body;
      const category = await Category.findById(id);

      if (!category) {
        return new ResponseHandler(res, 404,false,"Category not found" )
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
  return new ResponseHandler(
    res,
    403,
    false,
    "Unauthorized. Only admin can get users"
  );
}
};

// delete category
exports.deleteCategory = async(req,res) => {
  if (
    (req.user._id && req.user.role === "admin") ||
    req.user.role === "superAdmin"
  ) {
  try{
    const {id} = req.params
      await Category.findByIdAndRemove(id)
      return new ResponseHandler(res, 200,true,"Category deleted successfully" )
  }
  catch(error){
    return new ResponseHandler(res, 500,true,error.message )
  }
} else {
  return new ResponseHandler(res, 403,true,"Unauthorized. Only admin can delete category" )
} 
}


