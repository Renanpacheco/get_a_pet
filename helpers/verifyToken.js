const jwt = require('jsonwebtoken');
const getToken = require('./getToken');
const checkToken = (req, res, next) => {
    if (!req.headers.authorization){
        res.status(401).json({ message: "needs token" });
    }
    const token = getToken(req)

    if (!token) {
        res.status(401).json({ message: 'Invalid token'});

    }
    try {
        const verified = jwt.verify(token, 'secret');
        
        req.user = verified;
        next()
    } catch (error) {
        res.status(400).json({ error});
    }
}

module.exports = checkToken;