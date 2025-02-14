const postModel = require("../models/post.model")



module.exports.createPost = async (req, res, next) => {
    
    try {
        const {content, tags} = req.body

        if(!content){
            return res.status(400).json({ message: 'Content is required.' });
        }
        const newPost = new postModel({
            author : req.user._id,
            content ,
            tags,
        })

        await newPost.save();
        return res.status(200).json({ message: "Post created successfully" });
        
    } catch (error) {
        return res.status(500).json({ message: "Error in posting", error });

    }
}

module.exports.getPost = async (req,res, next) => {
    try {
        const id = req.params.id;
        const post = await postModel.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({post})
    } catch (error) {
        return res.status(500).json({ message: "Error in fetching data", error });

    }


}

module.exports.feed = async (req, res, next) =>{
    try {
        const posts = await postModel.find()
                    .populate("author", "username")
                    .populate("comments.author","username")
                    .sort({ createdAt: -1 });

        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({ message: "Error in fetching data", error });
    }
}

module.exports.updatePost = async (req, res, next) => {

    try {
        const { content, tags } = req.body;
        const postId = req.params.id;

    const updatedPost = await postModel.findByIdAndUpdate(postId, {
        ...(content && {content}),
        ...(tags && {tags}),
        updatedAt: Date.now() 
    }, {new : true})

    if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found.' });
    }

    return res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({ message: 'Error while updating post.' });
    }

}

module.exports.deletePost = async (req, res, next) => {
    try {
        const deletedPost = await postModel.findByIdAndDelete(req.params.id)

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        return res.status(201).json({message : "Post deleted successfully"})
        
    } catch (error) {
        return res.status(500).json({ message: 'Error in deleting post.'});
    }
}

module.exports.likePost = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
        } else {
            post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
        }
       
        await post.save();

        return res.status(200).json({
            message: "Post like status updated",
            likes: post.likes.length,
            post
        });

    } catch (error) {
        console.error("Error in liking post:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports.addComment = async (req, res, next) => {
    try {
        const { newComment } = req.body;
        const post = await postModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        post.comments.push({
            author: req.user._id,
            content: newComment
        });

        await post.save();

        return res.status(200).json({ message: 'Comment added successfully', post });

    } catch (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ message: 'Error while adding comment.', error: error.message });
    }
}

module.exports.deleteComment = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.cmtId;

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const commentIdx = post.comments.findIndex((comment) => comment._id.toString() === commentId)

        if (commentIdx === -1) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        
        if(post.comments[commentIdx].author.toString() !== req.user._id.toString() && 
            post.author.toString() !== req.user._id.toString()){

            return res.status(403).json({ message: 'Unauthorized to delete this comment.' });
        }

        post.comments.splice(commentIdx, 1);
        await post.save();
        res.status(200).json({ message: 'Comment deleted successfully.', post });

    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Server error.' });
    }


}

module.exports.userLikedPost = async (req, res, next) => {
    try {
        const likedPost = await postModel.find({likes : req.user._id}).populate("author","username")
        return res.status(200).json({ message: 'Liked Post fetched successfully.', likedPost });

    } catch (error) {
        console.error('Error in fetching liked post:', error);
        res.status(500).json({ message: 'Server error.' });
    }
}

module.exports.userCommentPost = async (req, res, next) => {
    try {
        const commentedPosts = await postModel.find({
            comments: { $elemMatch: { author: req.user._id } } 
        }).populate("author","username").populate("comments.author", "username");
        return res.status(200).json({ message: 'Commented Post fetched successfully.', commentedPosts });
        
    } catch (error) {
        console.error('Error in fetching commented post:', error);
        res.status(500).json({ message: 'Server error.' });
    }
}