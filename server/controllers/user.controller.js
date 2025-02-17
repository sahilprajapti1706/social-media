const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { cloudinary } = require("../config/cloudinary");

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let profileImageUrl = null;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isUserAlreadyWithEmail = await userModel.findOne({ email });
    if (isUserAlreadyWithEmail) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const isUsernameAlreadyTaken = await userModel.findOne({ username });
    if (isUsernameAlreadyTaken) {
      return res.status(400).json({ message: "Username unavailable" });
    }
    console.log(req.file)
    if (req.file) {
      try {
        profileImageUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "profile_pictures" },
            (error, result) => {
              if (error) {
                console.error("Cloudinary Upload Error:", error);
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          );
          uploadStream.end(req.file.buffer);
        });
        console.log(profileImageUrl)
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      profileImage: profileImageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findOne({ username }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "6h" });
    

    return res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Error logging in user", error: error.message });
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.RESET_SECRET, { expiresIn: "1h" });

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `Click <a href="${resetLink}">here</a> to reset your password.`,
    });

    return res.json({ message: "Reset link sent to email" });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    return res.status(500).json({ message: "Error sending reset email", error: error.message });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.RESET_SECRET);
    console.log(decoded)
    const user = await userModel.findOne({
      _id: decoded.userId,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(400).json({ message: "Error resetting password", error: error.message });
  }
};

module.exports.getProfile = async (req, res) => {
  try {
    
    return res.status(200).json({
      message: "Welcome to your profile",
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

module.exports.getAllUser = async (req, res) => {
  try {
    const users = await userModel.find().sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { ...(bio && { bio }) },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Profile Updated Successfully", updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

module.exports.connection = async (req, res) => {
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

    return res.status(200).json({ message: "Friend connection successful", user, friend });
  } catch (error) {
    console.error("Error in connection function:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.friends = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id)
      .populate("following", "username")
      .populate("followers", "username");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Friends list fetched successfully.",
      following: user.following,
      followers: user.followers,
    });
  } catch (error) {
    console.error("Error fetching friends list:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
 