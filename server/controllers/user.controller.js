const userModel = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');


module.exports.registerUser = async (req, res, next) => {
    try {
    const { username, email, password} = req.body;

    if ( !username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const isUserAlreadyWithEmail = await userModel.findOne({email})

    if(isUserAlreadyWithEmail){
       return res.status(400).json({message : "User already exist with this email"}) 
    }

    const isUsernameAlreadyTaken = await userModel.findOne({username})

    if(isUsernameAlreadyTaken){
       return res.status(400).json({message:"Username unavailable"})
    }

    const hashedPassword = await userModel.hashedPassword(password)
    
    const newUser = new userModel({
        email,
        username,
        password: hashedPassword
    });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user", error });
    }
}

module.exports.loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await userModel.findOne({ username }).select('+password');

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT token
        const token = user.generateAuthToken();

        res.cookie('token', token);
        res.status(200).json({ message: "Login successful", user, token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in user", error });
    }
}

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

module.exports.forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        const resetToken = jwt.sign({ userId: user._id }, 'reset_secret', { expiresIn: '1h' });
        

        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();
        
        // Send reset email
        const resetLink = `http://localhost:5153/user/reset-password?token=${resetToken}`;
        await transporter.sendMail({
          to: email,
          subject: 'Password Reset Request',
          html: `Click <a href="${resetLink}">here</a> to reset your password.`
        });
        
        res.json({ message: 'Reset link sent to email' });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

module.exports.resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        
        const decoded = jwt.verify(token, 'reset_secret');
        const user = await userModel.findOne({
          _id: decoded.userId,
          resetToken: token,
          resetTokenExpiry: { $gt: Date.now() }
        });
        
        if (!user) {
          return res.status(400).json({ error: 'Invalid or expired reset token' });
        }
        
        // Update password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        
        res.json({ message: 'Password updated successfully' });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

module.exports.getProfile = async (req, res, next) => {
    return res.status(200).json({
        message: "Welcome to your profile",
        user: req.user
    });
};

module.exports.getAllUser = async (req, res, next) => {
    const users = await userModel.find().sort({ createdAt: -1 })
    return res.status(200).json({ users })
}

module.exports.updateProfile  = async(req, res, next) =>{ 
    try {
        const {bio} = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            ...(bio && {bio})
        },{new : true})

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json({message : "Profile Updated Successfully", updatedUser});
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Error while updating profile.' });
    }
}

module.exports.connection = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const friendId = req.params.id;

        if (!userId || !friendId) {
            return res.status(400).json({ message: "User ID and Friend ID are required" });
        }

        if (userId.toString() === friendId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const user = await userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { following: friendId } },
            { new: true }
        );

        const friend = await userModel.findByIdAndUpdate(
            friendId,
            { $addToSet: { followers: userId } }, 
            { new: true }
        );

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ 
            message: "Friend connection successful",
            user,
            friend 
        });

    } catch (error) {
        console.error("Error in connection function:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports.friends = async (req, res, next) => {
    try {
      const user = await userModel.findById(req.user._id)
        .populate("following", "username")
        .populate("followers", "username");
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      res.status(200).json({
        message: "Friends list fetched successfully.",
        following: user.following,
        followers: user.followers
      });
  
    } catch (error) {
      console.error("Error fetching friends list:", error);
      res.status(500).json({ message: "Server error." });
    }
  };