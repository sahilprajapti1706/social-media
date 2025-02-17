const multer = require("multer");

const storage = multer.memoryStorage(); // Store image in memory buffer
const upload = multer({ storage });

module.exports = upload;