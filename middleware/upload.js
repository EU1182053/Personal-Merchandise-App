const multer = require("multer");

const storage = multer.memoryStorage(); // ✅ Stores file in memory (MongoDB)
const upload = multer({ storage });

module.exports = upload;
