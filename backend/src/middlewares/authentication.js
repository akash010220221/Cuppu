const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Please Login");
        }

        const decoded = await jwt.verify(token, process.env.SECRET);

        const { id } = decoded;
        const user = await User.findById(id).select("-password");
        
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;

        next();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = userAuth