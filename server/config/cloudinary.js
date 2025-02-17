const cloudinary = require('cloudinary').v2;

const connectCloudinary = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY,
            secure: true,
        })

        return cloudinary;
    } catch (error) {
        console.error('Error configuring Cloudinary:', error.message);
    }
}

module.exports = {connectCloudinary, cloudinary} ;