const express = require("express")
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware")
const postController = require("../controllers/post.controller")


router.get("/", postController.feed)

router.post("/create-post", authMiddleware.authUser , postController.createPost)

router.get("/get-post/:id", authMiddleware.authUser , postController.getPost)

router.put("/update/:id", authMiddleware.authUser, authMiddleware.isAuthor, postController.updatePost);

router.delete("/delete/:id", authMiddleware.authUser, authMiddleware.isAuthor, postController.deletePost)

// Like and Comments

router.post("/like/:id", authMiddleware.authUser, postController.likePost);

router.post("/comment/:id", authMiddleware.authUser, postController.addComment)

router.post("/comment/:postId/:cmtId", authMiddleware.authUser, postController.deleteComment)

router.get("/liked-posts", authMiddleware.authUser, postController.userLikedPosts);

router.get("/commented-posts", authMiddleware.authUser, postController.userCommentPost);

module.exports = router