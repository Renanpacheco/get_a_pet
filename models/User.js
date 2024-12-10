const mongoose = require('../db/conn')
const { Schema } = mongoose

const User = mongoose.model(
    'User',
    new Schema({
        name:{ 
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        image:{ // optional, but save only the path to the image 
            type: String
        },
        phone:{
            type: Number,
            required: true
        }
    }, {timestamps: true}
    )
)

module.exports = User