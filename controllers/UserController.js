const createUsertoken = require('../helpers/createUserToken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = class UserController{
    static async register(req, res){
        const {name, email, phone, password, confirm} = req.body

        if(!name){
            res.status(422).json({message:"Please enter the name"})
            return
        }
        if(!email){
            res.status(422).json({message:"Please enter the e-mail address"})
            return
        }
        if(!phone){
            res.status(422).json({message:"Please enter the phone number"})
            return
        }
        if(!password){
            res.status(422).json({message:"Please enter the password"})
            return
        }
        if(!confirm || confirm !== password){
            res.status(422).json({message:"Please enter the same password again"})
            return
        }

        const userExists = await User.findOne({email: email})
        if(userExists){
            res.status(422).json({message: "User already exists with the same email"})
            return
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = new User({
            name,
            email,
            phone, 
            password:passwordHash
        })

        try {
            const newUser = await user.save()
            //res.status(201).json({ message: "Create User with sucess", newUser});
            await createUsertoken(newUser,req, res)
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }

    static async login(req, res) {

        const {email, password} = req.body
        if(!email){
            res.status(422).json({message:"Please enter the e-mail address"})
            return
        }
        if(!password){
            res.status(422).json({message:"Please enter the password"})
            return
        }

        const user = await User.findOne({email: email})
        if(!user){
            res.status(422).json({message: "Don't have a user with this email"})
            return
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword){
            res.status(422).json({message: "wrong password"})
            return
        }

        await createUsertoken(user,req,res)
    }
}