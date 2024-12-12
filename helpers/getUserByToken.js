const jwt = require("jsonwebtoken");
const User = require('../models/User');

const getUserByToken = async (token) => {
    if (!token){
        res.status(401).json({ message: "invalid token" });
        return;
    }
    const decoded = jwt.verify(token, 'secret');

    return await User.findOne({_id: decoded.id})

}

module.exports = getUserByToken