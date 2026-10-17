const express = require("express");

const {getProfile,updateProfile} = require("../controllers/userController");

const {authMiddleware} = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");

const {updateProfileSchema} = require("../validators/authValidator");

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getProfile);

router.patch("/profile",validate(updateProfileSchema),updateProfile);

module.exports = router;