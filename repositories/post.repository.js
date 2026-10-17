
const pool = require("../db");
const getAllPosts = async () => {const result = await pool.query("SELECT * FROM posts ORDER BY id DESC" );

  return result.rows;
};

const getPostById = async (id) => {const result = await pool.query("SELECT * FROM posts WHERE id = $1",[id]);

  return result.rows[0];
};

const createPost = async (postData) => {const { title, content, user_id } = postData;
  const result = await pool.query(
    `INSERT INTO posts (title, content, user_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, content, user_id]
  );

  return result.rows[0];
};

const updatePost = async (id, postData) => {const { title, content } = postData;
  const result = await pool.query(
    `UPDATE posts
     SET title = $1, content = $2
     WHERE id = $3
     RETURNING *`,
    [title, content, id]
  );

  return result.rows[0];
};

const deletePost = async (id) => {const result = await pool.query("DELETE FROM posts WHERE id = $1 RETURNING *",[id]);

  return result.rows[0];
};

module.exports = { getAllPosts, getPostById,createPost,updatePost,deletePost,};
