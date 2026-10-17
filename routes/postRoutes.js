const express = require("express");

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  searchPosts
} = require("../controllers/postController");

const {authMiddleware} = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {createPostSchema,updatePostSchema} = require("../validators/postValidator");
const router = express.Router();

//puplic routes
router.get("/", getAllPosts);
router.get("/search", searchPosts);
router.get("/:id", getPostById);

//protected routes
router.post( "/",authMiddleware,validate(createPostSchema),createPost);

router.patch( "/:id",authMiddleware,validate(updatePostSchema),updatePost);

router.delete( "/:id", authMiddleware, deletePost);


module.exports = router;
