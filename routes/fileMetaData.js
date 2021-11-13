const router = require("express").Router();
const multer = require("multer");

// File Metadata
router.post("/api/fileanalyse", multer().single("upfile"), (req, res) => {
    res.json({
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
    });
});

module.exports = router