const userModel = require("../models/user.model")
const postModel = require("../models/post.model")
const jwt = require("jsonwebtoken")

module.exports.authUser = async(req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1]; 

        if(!token){
            return res.status(401).json({message: 'Unauthorized'}); 
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded._id);
            req.user = user;   
            next();     
        } catch (error) {
            console.log("Here is error",error)
            res.status(401).json({ error: 'Please authenticate' });
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

