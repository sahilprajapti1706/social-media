const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller")
const authMiddleware = require("../middleware/auth.middleware")
const upload = require("../config/multer");

router.post("/register",upload.single("profileImage"),userController.registerUser)

router.post("/login",userController.loginUser)

router.post("/forgot-password",userController.forgotPassword);

router.post("/reset-password",userController.resetPassword);

router.get("/my-profile",authMiddleware.authUser , userController.getProfile)

router.put("/update-profile",authMiddleware.authUser , userController.updateProfile)

router.get("/get-users", authMiddleware.authUser, userController.getAllUser);

router.post("/connection/:id",authMiddleware.authUser, userController.connection)

router.get("/friends",authMiddleware.authUser, userController.friends)

module.exports = router