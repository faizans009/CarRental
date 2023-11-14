const jwt = require("jsonwebtoken");

function generateToken(res,user) {
  const token= jwt.sign(
    { email: user.email, id: user._id,admin: user.admin},
    process.env.SECRET_KEY,
    { expiresIn: "5d" }

  );
// / options for cookie
    const options = {
        expires: new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000
        ),
        httpOnly:true
        }
    res.status(200).cookie("token", token, options)
    return token;
}

module.exports = generateToken;
