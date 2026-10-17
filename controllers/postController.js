const AppDataSource = require("../config/data-source");

const Post = AppDataSource.getRepository("Post");

function formatPost(post) {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,

    user: post.user
      ? {
          id: post.user.id,
          username: post.user.username
        }
      : null
  };
}

async function createPost(req, res, next) {
  try {
    const { title, content } = req.body;

    const newPost = Post.create({title,content,user: { id: req.user.id }});

    const savedPost = await Post.save(newPost);

    const postWithUser = await Post.findOne({
      where: { id: savedPost.id },
      relations: { user: true }
    });

    return res.status(201).json({
      message: "Post created successfully",
      post: formatPost(postWithUser)
    });
  } catch (error) {
    next(error);
  }
}

async function getAllPosts(req, res, next) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);

    const limit = Math.min(50,Math.max(1, Number.parseInt(req.query.limit, 10) || 10));

    const [posts, total] = await Post.findAndCount({
      relations: { user: true },
      order: { createdAt: "DESC", id: "DESC" },
      skip: (page - 1) * limit,
      take: limit
    });

    return res.status(200).json({
      posts: posts.map(formatPost),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getPostById(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid post ID"
      });
    }

    const post = await Post.findOne({
      where: { id },
      relations: { user: true }
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    return res.status(200).json({post: formatPost(post)});
  } catch (error) {
    next(error);
  }
}

async function updatePost(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid post ID"
      });
    }

    const post = await Post.findOne({
      where: { id },
      relations: { user: true }
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    const isOwner = post.user.id === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You cannot edit this post"
      });
    }

    if (req.body.title !== undefined) {
      post.title = req.body.title;
    }

    if (req.body.content !== undefined) {
      post.content = req.body.content;
    }

    await Post.save(post);

    const updatedPost = await Post.findOne({
      where: { id },
      relations: { user: true }
    });

    return res.status(200).json({
      message: "Post updated successfully",
      post: formatPost(updatedPost)
    });
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid post ID"
      });
    }

    const post = await Post.findOne({
      where: { id },
      relations: { user: true }
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    const isOwner = post.user.id === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You cannot delete this post"
      });
    }

    await Post.remove(post);

    return res.status(200).json({
      message: "Post deleted successfully"
    });
  } catch (error) {
    next(error);
  }
}

async function searchPosts(req, res, next) {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({
        message: "Search query is required. Use ?q=keyword"
      });
    }

    const posts = await Post.createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user")
      .where("post.title ILIKE :query", {
        query: `%${query}%`
      })
      .orWhere("post.content ILIKE :query", {
        query: `%${query}%`
      })
      .orderBy("post.createdAt", "DESC")
      .addOrderBy("post.id", "DESC")
      .take(50)
      .getMany();

    return res.status(200).json({
      count: posts.length,
      posts: posts.map(formatPost)
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  searchPosts
};