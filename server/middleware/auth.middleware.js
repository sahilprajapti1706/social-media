const userModel = require("../models/user.model")
const postModel = require("../models/post.model")
const jwt = require("jsonwebtoken")


module.exports.authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token || token === "null" || token === "undefined") {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded Token:", decoded);

        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("JWT Error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token. Please authenticate again." });
        }

        return res.status(401).json({ message: "Unauthorized access." });
    }
};

module.exports.isAuthor = async (req, res, next) => {
    try {
        const post = await postModel.findById(req.params.id);
        if(req.user._id.toString() !== post.author.toString()){
            return res.status(401).json({message: 'Unauthorized : Only author can edit the post'});
        }
        next();
    } catch (error) {

        return res.status(401).json({message: 'Unauthorized', error});
    }
}

