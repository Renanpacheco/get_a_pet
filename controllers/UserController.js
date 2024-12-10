const User = require('../models/User');

module.exports = class UserController{
    static register(req, res){
        res.json('success')
    }
}