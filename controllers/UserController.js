const createUsertoken = require('../helpers/createUserToken');
const getToken = require('../helpers/getToken');
const getUserByToken = require("../helpers/getUserByToken");
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { response } = require('express');

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

    static async checkUser(req, res) {
        let currentUser
        //console.log(req.headers.authorization)
        if(req.headers.authorization){
            const token = getToken(req)
            const decoded = jwt.verify(token, 'secret')

            currentUser = await User.findById(decoded.id)
            //console.log(currentUser)
            currentUser.password = undefined


        }else{
            currentUser = null
        }

        res.status(200).send(currentUser)
    }
    
    static async getUserById(req, res){
        const id = req.params.id
        const user = await User.findById(id).select('-password')

        if(!user){
            res.status(422).json({message: "Don't have a user"})
            return
        }
        res.status(200).json({user})
    }

    static async editUser(req, res){
        const id = req.params.id
        const token = getToken(req)
        const user = await getUserByToken(token)//await User.findById(id)

        if(req.file){
            user.image = req.file.filename
        }

        if(!user){
            res.status(422).json({ message: "User don't exist" });
            return
        }

        const dataUser = req.body
        const userExists = await User.findOne({ email: dataUser.email})

        if(dataUser.email !== user.email && userExists){
            res.status(422).json({ message: "Email alredy cadastred" });
            return;
        }

        user.email = dataUser.email

        if(!dataUser.name){
            res.status(422).json({message:"Please enter the name"})
            return
        }
        user.name = dataUser.name;

        if(!dataUser.phone){
            res.status(422).json({message:"Please enter the phone number"})
            return
        }
        user.phone = dataUser.phone;
        
        if(dataUser.password !== dataUser.confirm){
            res.status(422).json({message:"Please enter the same password again"})
            return
        }else if(dataUser.password != null){
            
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(dataUser.password, salt);
            user.password = passwordHash
        }
        //console.log(user)

        try {
            await User.findOneAndUpdate(
                {_id: user._id},
                {$set: user},

            )
            res.status(200).json({message: "Updated user successfully"})
        } catch (error) {
            res.status(500).json({message: error})
        }

        //res.status(200).json({user})
    }
}