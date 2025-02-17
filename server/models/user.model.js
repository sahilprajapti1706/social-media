const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({

    profileImage :{
        type : String,
    },

    username: {
        type: String,
        unique: true,
        match: /^[a-z0-9._-]+$/,
        minlength: [5, "Username must be at least 5 characters"]
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    
    password : {
        type: String,
        required :true,
        minlength : [6, "Password must be at least 6 character"],
        select : false
    },

    bio: {
        type: String,
        maxlength: [160, "Bio must be at most 160 characters"],
        default : `Hello World`
    },
    
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
})


const userModel = mongoose.model("User", userSchema)

module.exports = userModel;