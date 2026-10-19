const jwt = require("jsonwebtoken")

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.SECRET, { expiresIn: "2d" });
}

module.exports = generateToken