const jwt = require('jsonwebtoken');

const createUsertoken = async( user, req, res) => {
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "secret")

    res.status(200).json({ 
        message:"autenticated", 
        token: token,
        userId:user._id
    })
}

module.exports = createUsertoken