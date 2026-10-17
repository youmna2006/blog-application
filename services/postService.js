
const postRepository = require("../repositories/post.repository");
const getAllPosts = async () => {return await postRepository.getAllPosts();};
const getPostById = async (id) => {const post = await postRepository.getPostById(id);

  if (!post) {throw new Error("Post not found");}
  return post;
};

const createPost = async (postData) => { return await postRepository.createPost(postData);};

const updatePost = async (id, postData) => {const post = await postRepository.getPostById(id);

  if (!post) {
    throw new Error("Post not found");
  }

  return await postRepository.updatePost(id, postData);
};

const deletePost = async (id) => {const post = await postRepository.getPostById(id);
  if (!post) {
    throw new Error("Post not found");
  }

  return await postRepository.deletePost(id);
};


module.exports = {getAllPosts,getPostById,createPost,updatePost,deletePost,};
