const express = require("express");

const {getAllPosts} = require("../controllers/postcontroller");
const router = express.Router();
router.get("/", getAllPosts);

module.exports = router;