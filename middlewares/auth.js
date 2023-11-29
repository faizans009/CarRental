const jwt = require('jsonwebtoken');
const User = require('../models/user')
exports.isAuthenticatedUser = async(req, res, next)=>{
    try {
        const token =  req.cookies.token;
        if(!token){
            return res.status(401).json({success:false,message:"Please login to access this resource"});
        }
        const decodedData = jwt.verify(token, process.env.SECRET_KEY);
        req.user = await User.findById(decodedData.id);

        next();
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
};