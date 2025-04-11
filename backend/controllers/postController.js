import Post from "../models/postModel.js";

const addNewPost = async (req, res) => {
  try {
    const userId = req.id;
    const { caption, desc } = req.body;
    const img = req.file;

    if (!img) {
      return res.status(400).json({ message: "Image is required" });
    }
    const optimizedImg = await sharp(img.buffer)
      .resize(800, 800, { fit: sharp.fit.cover })
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toBuffer();

    const fileUri = `data:img/jpeg;base64,${optimizedImg.toString("base64")}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const newPost = await Post.create({
      caption,
      desc,
      author: userId,
      img: cloudResponse.secure_url,
    });

    const user = await User.findById(userId).select("-__v -password");
    if (user) {
      user.posts.push(Post._id);
      await user.save();
    }

    await Post.populate({ path: "author", select: "-password" });
    res.status(201).json({ message: "New Post Added", success: true, newPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate({ path: "author", select: "username,profilePic" })
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        poplate: {
          path: "author",
          select: "username, profilePic",
        },
      });
    return res.status(200).json({ message: "All Posts", success: true, posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username,profilePic" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username,profilePic" },
      });
    return res
      .status(200)
      .json({ message: "User Posts", success: true, posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }
    // const isLiked = post.likes.includes(userId);
    // if (isLiked) {
    //     post.likes = post.likes.filter((like) => like!== userId);
    // } else {
    //     post.likes.push(userId);
    // }
    await post.updateOne({ $addToSet: { likes: userId } });
    await post.save();
    return res
      .status(200)
      .json({ message: "Post liked successfully", success: true, post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const disLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    await post.updateOne({ $pull: { likes: userId } });
    await post.save();
    return res
      .status(200)
      .json({ message: "Post Disliked successfully", success: true, post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const addNewComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const { comment } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }
    const newComment = await Comment.create({
      comment,
      author: userId,
      post: postId,
    });
    post.comments.push(newComment._id);
    await post.save();
    await newComment.populate({
      path: "author",
      select: "username profilePic",
    });
    return res
      .status(201)
      .json({ message: "Comment added successfully", success: true, newComment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
    
  const getCommentsOnPost = async (req, res) => {
    try {
      const postId = req.params.id;
      const comments = await Comment.find({ post: postId })
        .populate({ path: "author", select: "username, profilePic" })
        .sort({ createdAt: -1 });
        if(!comments) res.stats(404).json({m})
      return res.status(200).json({
        message: "Comments fetched successfully",
        success: true,
        comments,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error", error });
    }
  }
  


export {
  addNewPost,
  getAllPost,
  getUserPost,
  likePost,
  disLikePost,
  addNewComment,
};
