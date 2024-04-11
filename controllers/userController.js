import User from "../models/User.js";
import bcrypt from "bcrypt";
import uploadFile from "../database/uploadFile.js";


const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const file = req.file;

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const photoInfo = await uploadFile(file);

        const user = new User({
            firstName,
            lastName,
            email,
            passwordHash,
            photoInfo,
        });

        const savedUser = await user.save();

        return res.status(201).json(savedUser);
    } catch (error) {
        next(error);
    }
};

const editUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const file = req.file; // New file for photoInfo
        const userId = req.params.userId;

        // Check if userId is valid
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Prepare update object with fields to be updated
        const update = {};
        if (firstName) update.firstName = firstName;
        if (lastName) update.lastName = lastName;
        if (email) update.email = email;
        if (password && password !== updatedUser.passwordHash) {
            const saltRounds = 10;
            update.passwordHash = await bcrypt.hash(password, saltRounds);
        }

        // Handle photoInfo update
        if (file) {
            const photoInfo = await uploadFile(file);
            update.photoInfo = photoInfo;
        }

        // Find user by ID and update
        const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true });

        // Check if user is found
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

async function getUser(req, res, next) {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate("posts");
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
    return res.json(users)
    } catch (error) {
        next(error)
    }
    
}

const getUserFriends = async (req, res, next) => {
    try {
        const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
        user.friends.map((id) => user.findById(id))
    );
    const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location,  }) => {
            return { _id, firstName, lastName, occupation, location  }
        }
    );
    res.status(200).json(formattedFriends)
    } catch (error) {
        next(error);
    }
    
};

const addRemoveFriend = async (req, res, next) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !==id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id)
        }
        await user.save();
        await friend.save();
        
        const friends = await Promise.all(
            user.friends.map((id) => user.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location }) => {
                return { _id, firstName, lastName, occupation, location }
            }
        );
        res.status(200).json(formattedFriends);
    } catch (error) {
        next(error);
    }
}


export default {
    getUser,
    getUserFriends,
    addRemoveFriend,
    register,
    getUsers,
    editUser
}