const Category = require("../models/categoryModel");
const Car = require("../models/carModel");

// create category
async function createCategory(data){
    try{
        const existingCategory = await User.findOne({
            companyName: data.companyName,
          });
          if (existingCategory) {
            throw new Error("Category already exists");
          }
          const newCategory = await Category.create({
            categoryImage: data.categoryImage,
            companyName: data.companyName,
          });
          return newCategory;
    } 
    catch (error) {
        throw error;
    }
    }

// get category
async function getCategory(){
    try{
        const category = await Category.find();
      
      return category
    }
    catch(error){
        throw error;
    }
}

async function getOneCategory(categoryId){
    try{
        const category = await Category.findById(categoryId)
        return category
    }
    catch(error){
        throw error;
    }
}
async function getCarsByCategory(companyName){
    try{
        const cars = await Car.find({ companyName: companyName })
        return cars;
    }
    catch(error){
        throw error;
    }
}

async function deleteCategory(id){
    try{
        await Category.findByIdAndRemove(id) 
    }
    catch(error){
        throw error;
    }
}

      
module.exports = {
createCategory,
getCategory,
getOneCategory,
getCarsByCategory,
deleteCategory,
};