 import User from "../models/User.js";
  import bcrypt from "bcryptjs";
  import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
 
 
  const registerUser = async (req, res) => {
        try {
            const { name, email, password } = req.body;
            // Validate user input
            if (!name || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ 
                    message: "User already exists", 
                    success: false 
                });
            }
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = await User.create({ name, email, password: hashedPassword });
            return res.status(201).json({
                message: "User registered successfully",
                success: true,
            });
        } catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    }

    const loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;
            // Validate user input
            if (!email || !password) {
                return res.status(400).json({ message: "All fields are required", success: false });
            }
            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }
            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }
             user ={
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic,
                bio: user.bio,
                gender: user.gender,
                followers: user.followers,
                following: user.following,
                posts: user.posts,
                savedPosts: user.savedPosts,
                
             }
            // Generate JWT token
            const token = await  jwt.sign({userId:user._id}, process.env.JWT_SECRET,{expiresIn:'7d'}) // Assuming you have a method to generate JWT in your User model
            return res.cookies('token', token, {
                httpOnly: true,
                //secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            }).status(200).json({
                message: "User logged in successfully",
                success: true,
                token,
                user,
            });


        } catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    };


    const logoutUser = async (req, res) => {
        try {
            res.Cookie('token',"" ,{maxAge:0}).status(200).json({ message: "User logged out successfully", success: true });
        } catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    }

    const getProfile = async (req, res) => {
        try {
            const userId = req.params.id;
            // Validate user input
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ user });
        } catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    };
    const updateProfile = async (req, res) => {
        try {
            const userId = req.id;
            const { name , bio, gender } = req.body;
            const profilePicture =req.file;
             let cloudeResponse;
            if (profilePicture) {
                const fileUri = getDataUri(profilePicture);
                cloudeResponse = await cloudinary.uploader.upload(fileUri, {
                folder: "profile",
                });
            }
           
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            
            if(name) {
                user.name = name;
            } 
             if(bio) {
                user.bio = bio;
            }
          
            if(gender) {
                user.gender = gender;
            }
            if(profilePicture) {
                user.profilePic = cloudeResponse.secure_url;
            }

            await user.save();
            return res.status(200).json({ message: "User profile updated successfully" ,success: true });
            
        } catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    };

   const getSuggestedUser = async (req, res) => {
    try{
        const suggested = await User.findById({_id:{$ne:req.id}}).select('-password')
             if(!suggested)
             {
                return res.status(404).json({ message: "User not found" });
             }
             return res.status(200).json({ success: true, users: suggested})
    }
    catch(error) 
     {
        return res.status(500).json({ message: "Server error", error });
     }
    }

    const followorUnfollow = async (req, res) => {
        try {
            const userId = req.params.id;
            const currentUserId = req.id;
            // Validate user input
            if (userId == currentUserId) {
                return res.status(400).json({ message: "you cannot follow/unfollow yourself", success: false });
            }
            // Check if the user is already followed
            const isFollowing = user.followers.includes(currentUserId);
            if (isFollowing) {
                // Unfollow the user
                await User.findByIdAndUpdate(userId, { $pull: { followers: currentUserId } }, { new: true });
                await User.findByIdAndUpdate(currentUserId, { $pull: { following: userId } }, { new: true });
                return res.status(200).json({ message: "Unfollowed successfully", success: true });
            } else {
                // Follow the user
                await User.findByIdAndUpdate(userId, { $push: { followers: currentUserId } }, { new: true });
                await User.findByIdAndUpdate(currentUserId, { $push: { following: userId } }, { new: true });
                return res.status(200).json({ message: "Followed successfully", success: true });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    }



 export { registerUser, loginUser, logoutUser, getProfile, updateProfile , getSuggestedUser, followorUnfollow };