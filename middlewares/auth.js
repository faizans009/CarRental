const jwt = require('jsonwebtoken');
const User = require('../models/user')
// exports.isAuthenticatedUser = async (req, res, next) => {
//     try {
//       const token = req.headers.authorization?.split(' ')[1];
  
//       if (!token) {
//         return res.status(401).json({ success: false, message: 'Please login to access this resource' });
//       }
  
//       const decodedData = jwt.verify(token, process.env.SECRET_KEY);
//       req.user = await User.findById(decodedData.id);
  
//       if (!req.user) {
//         return res.status(401).json({ success: false, message: 'User not found' });
//       }
  
//       // Optionally, you can check for admin privileges here
//       if (req.user.admin !== decodedData.admin) {
//         return res.status(403).json({ success: false, message: 'Unauthorized access' });
//       }
  
//       next();
//     } catch (error) {
//       return res.status(500).json({ message: error.message });
//     }
//   };
exports.isAuthenticatedUser = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ success: false, message: 'Please login to access this resource' });
      }
  
      jwt.verify(token, process.env.SECRET_KEY, async (err, decodedData) => {
        if (err) {
          return res.status(401).json({ success: false, message: 'Invalid token' });
        }
  
        req.user = await User.findById(decodedData.id);
  
        if (!req.user) {
          return res.status(401).json({ success: false, message: 'User not found' });
        }
  
        // Optionally, you can check for admin privileges here
        if (req.user.admin !== decodedData.admin) {
          return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }
  
        next();
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };