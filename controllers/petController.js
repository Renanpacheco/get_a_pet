const Pet = require('../models/Pet')

// middlewares
const getToken = require('../helpers/getToken');
const getUserByToken = require("../helpers/getUserByToken");
const { response } = require('express');
const ObjectId = require('mongoose').Types.ObjectId


module.exports = class PetController {
    static async create(req,res){
        const {name, age, weight, color} = req.body
        //const available = true
        const images = req.files

        // validations
        if(!name){
            res.status(422).json({message:"Please enter the name"})
            return
        }
        if(!age){
            res.status(422).json({message:"Please enter the age of the pet"})
            return
        }
        if(!weight){
            res.status(422).json({message:"Please enter the weight of the pet"})
            return
        }
        if(!color){
            res.status(422).json({message:"Please enter the color of the pet"})
            return
        }

        // get pet owner
        const token = getToken(req)
        const owner = await getUserByToken(token)

        const newPet = new Pet({
            name,
            age,
            weight,
            color,
            available: true,
            images: [],
            user: {
                _id: owner._id,
                name: owner.name,
                image: owner.image,
                phone: owner.phone,
            },
        })

        images.map((image) => {
            newPet.images.push(image.filename)
        })

        try {
            await newPet.save()
            res.status(201).json({message: 'save pet with success', newPet})
        } catch (error) {
            res.status(500).json({message: error});
        }
    }

    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({pets: pets});
    }

    static async getAllUserPets(req, res){

        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({'user._id':user._id}).sort("-createdAt");

        res.status(200).json({ pets: pets });
    }

    static async getAllUserAdoptions(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({'adopter._id':user._id}).sort("-createdAt");

        res.status(200).json({ pets: pets });
    }

    static async getPetById(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({message:"Please enter id correctly"})
            return
        }
        
        const pet = await Pet.findOne({_id: id})
        if (!pet) {
            res.status(404).json({message:"Pet not found"})
        }
        res.status(200).json({pet})
    }

    static async deletePetById(req, res) {
        
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({message:"Please enter id correctly"})
            return
        }

        const pet = await Pet.findOne({_id: id})
        if (!pet) {
            res.status(404).json({message:"Pet not found"})
            return
        }

        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message:"Please try again"})
            return
        }

        await Pet.findByIdAndDelete(id)
        res.status(200).json({ message: "Pet deleted successfully"});
    }

    static async updatePetById(req, res){
        const id = req.params.id
        const { name, age, weight, color, available } = req.body;
        //const available = true
        const images = req.files;
        const updateData = {}
        const pet = await Pet.findOne({_id: id})

        if(!pet){
            res.status(404).json({ message: "Pet not found" });
        }

        /*const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message:"Please try again"})
            return
        }*/
        if(!name){
            res.status(422).json({message:"Please enter the name"})
            return
        }else{
            updateData.name = name
        }
        if(!age){
            res.status(422).json({message:"Please enter the age of the pet"})
            return
        }else{
            updateData.age = age
        }
        if(!weight){
            res.status(422).json({message:"Please enter the weight of the pet"})
            return
        }else{
            updateData.weight = weight
        }
        if(!color){
            res.status(422).json({message:"Please enter the color of the pet"})
            return
        }else{
            updateData.color = color
        }

        if(images.length === 0){
            res.status(422).json({message:"Please enter the images of the pet"})
        }else{
            updateData.images = []
            images.map((image) => {
                updateData.images.push(image.filename)
            })
        }

        await Pet.findByIdAndUpdate(id, updateData)
        res.status(200).json({ pet });
    }

    static async schedule(req, res){
        const id = req.params.id
        const pet = await Pet.findOne({_id: id})

        if(!pet){
            res.status(404).json({ message: "Pet not found" });
        }
        const token = getToken(req);
        const user = await getUserByToken(token);

        /*if(pet.user._id.toString() === user._id.toString()) {
            res.status(422).json({message:"Can not schedule for your pet"})
            return
        } verify the problem*/
        
        pet.adopter = {
            _id: user._id,
            name: user.name,
        }
        await Pet.findByIdAndUpdate(id,pet)
        res.status(200).json({message: `success, contact: ${pet.user.name}`})
    }

    static async concludeAdoption(req, res){
        const id = req.params.id
        
        const pet = await Pet.findOne({_id: id})

        if(!pet){
            res.status(404).json({ message: "Pet not found" });
            return
        }

        pet.available = false

        await Pet.findByIdAndUpdate(id, pet)
        res.status(200).json({ message: "Adoption with sucess" })
    }
}