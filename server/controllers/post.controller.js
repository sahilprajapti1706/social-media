const postModel = require("../models/post.model");


module.exports.createPost = async(req, res) => {
    try {
      const { content, tags } = req.body;
      if (!content) return res.status(400).json({ message: "Content is required." });

      const newPost = await postModel.create({
        author: req.user._id,
        content,
        tags,
      });
      res.status(201).json({ message: "Post created successfully", newPost });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Error creating post", error: error.message });
    }
  }

  
module.exports.getPost = async (req, res) => {
    try {
      const post = await postModel.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });
      res.status(200).json({ post });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Error fetching post", error: error.message });
    }
  }

module.exports.feed = async(req, res)=>{
    try {
      const posts = await postModel.find()
        .populate("author", "username profileImage")
        .populate("comments.author","profileImage username")
        .sort({ createdAt: -1 });
      res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
  }

  module.exports.updatePost = async(req, res)=>{
    try {
      const { content, tags } = req.body;
      const updatedPost = await postModel.findByIdAndUpdate(
        req.params.id,
        { 
          ...(content && { content }), 
          ...(tags && { tags }), 
          updatedAt: Date.now() 
        },
        { new: true }
      );
      if (!updatedPost) return res.status(404).json({ message: "Post not found." });
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Error updating post", error: error.message });
    }
  }

module.exports.deletePost = async(req, res)=>{

    try {
      
      const deletedPost = await postModel.findByIdAndDelete(req.params.id);
      if (!deletedPost) return res.status(404).json({ message: "Post not found." });
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Error deleting post", error: error.message });
    }
  }


module.exports.likePost = async(req, res)=>{

    try {
      const post = await postModel.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });
      
      const userIdStr = req.user._id.toString();
      post.likes.includes(userIdStr)
        ? (post.likes = post.likes.filter(id => id.toString() !== userIdStr))
        : post.likes.push(userIdStr);
      
      await post.save();
      res.status(200).json({ message: "Like status updated", likes: post.likes.length, post });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ message: "Error liking post", error: error.message });
    }
  }

  module.exports.addComment = async(req, res)=>{

    try {
      const post = await postModel.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found." });
      
      post.comments.push({ author: req.user._id, content: req.body.newComment });
      await post.save();
      res.status(200).json({ message: "Comment added successfully", post });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Error adding comment", error: error.message });
    }
  }

  module.exports.deleteComment = async(req, res)=>{

    try {
      const post = await postModel.findById(req.params.postId);
      if (!post) return res.status(404).json({ message: "Post not found." });
      
      const commentIdx = post.comments.findIndex(comment => comment._id.toString() === req.params.cmtId.toString());

      if (commentIdx === -1) return res.status(404).json({ message: "Comment not found." });
      
      const isAuthor = post.comments[commentIdx].author.toString() === req.user._id.toString();

      const isPostOwner = post.author.toString() === req.user._id.toString();

      if (!isAuthor && !isPostOwner) return res.status(403).json({ message: "Unauthorized." });
      
      post.comments.splice(commentIdx, 1); 
      await post.save();
      res.status(200).json({ message: "Comment deleted successfully", post });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Error deleting comment", error: error.message });
    }
  }


module.exports.userLikedPosts = async(req, res)=>{

    try {
      const likedPosts = await postModel.find({ likes: req.user._id }).populate("author","profileImage username");
      res.status(200).json({ message: "Liked posts fetched successfully.", likedPosts });
    } catch (error) {
      console.error("Error fetching liked posts:", error);
      res.status(500).json({ message: "Error fetching liked posts", error: error.message });
    }
  }

module.exports.userCommentPost = async(req, res)=>{

    try {
      const commentedPosts = await postModel.find({ "comments.author": req.user._id })
        .populate("author", "profileImage username")
        .populate("comments.author", "username");
      res.status(200).json({ message: "Commented posts fetched successfully.", commentedPosts });
    } catch (error) {
      console.error("Error fetching commented posts:", error);
      res.status(500).json({ message: "Error fetching commented posts", error: error.message });
    }
  }
