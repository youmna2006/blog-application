
const PostService = require("./postService");
const PostRepository = require("../repositories/post.repository");

jest.mock("../repositories/post.repository");

describe("PostService", () => {
  let postService;

  beforeEach(() => {
    jest.clearAllMocks();

    PostRepository.createPost = jest.fn();
    PostRepository.getAllPosts = jest.fn();
    PostRepository.getPostById = jest.fn();
    PostRepository.updatePost = jest.fn();
    PostRepository.deletePost = jest.fn();
  

    postService = PostService;
  });

  test("createPost should create a post successfully", async () => {
    const postData = {
      title: "Test Post",
      content: "This is a test post",
    };

    const expectedPost = { id: 1, ...postData };

    PostRepository.createPost.mockResolvedValue(expectedPost);

    const result = await postService.createPost(postData);

    expect(PostRepository.createPost).toHaveBeenCalledWith(postData);
    expect(result).toEqual(expectedPost);
  });

  test("getAllPosts should return all posts", async () => {
    const posts = [
      { id: 1, title: "Post One", content: "Content One" },
      { id: 2, title: "Post Two", content: "Content Two" },
    ];

    PostRepository.getAllPosts.mockResolvedValue(posts);

    const result = await postService.getAllPosts();

    expect(PostRepository.getAllPosts).toHaveBeenCalled();
    expect(result).toEqual(posts);
  });

  test("getPostById should return a post by ID", async () => {
    const post = {
      id: 1,
      title: "Test Post",
      content: "Test Content",
    };

    PostRepository.getPostById.mockResolvedValue(post);

    const result = await postService.getPostById(1);

    expect(PostRepository.getPostById).toHaveBeenCalledWith(1);
    expect(result).toEqual(post);
  });

  test("updatePost should update a post successfully", async () => {
    
    const postId = 1;
    const updateData = {
      title: "Updated Post",
      content: "Updated Content",
    };

    const updatedPost = { id: postId, ...updateData };
    PostRepository.getPostById.mockResolvedValue({
  id: postId,
  title: "Old Post",
  content: "Old Content",
});

    PostRepository.updatePost.mockResolvedValue(updatedPost);

    const result = await postService.updatePost(postId, updateData);

    expect(PostRepository.updatePost).toHaveBeenCalledWith(
      postId,
      updateData
    );
    expect(result).toEqual(updatedPost);
  });

  test("deletePost should delete a post successfully", async () => {
    PostRepository.getPostById.mockResolvedValue({
    id: 1,
    title: "Test Post",
    content: "Test Content",
  });
    PostRepository.deletePost.mockResolvedValue({ rowCount: 1 });

    const result = await postService.deletePost(1);

    expect(PostRepository.deletePost).toHaveBeenCalledWith(1);
    expect(result).toEqual({ rowCount: 1 });
  });

 

   

   

   
  });

