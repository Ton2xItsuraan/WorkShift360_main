import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import config from "../utils/config.js";

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User.findOne({ email });

        // If user is not found or password is incorrect, return unauthorized error
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // User is authenticated, generate JWT token
        const tokenPayload = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            photoInfo: user.photoInfo // Add photoInfo to token payload
        };
        const token = jwt.sign(tokenPayload, config.JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

        // Return token and user information
        return res.status(200).json({ 
            token, 
            email: user.email, 
            firstName: user.firstName, 
            lastName: user.lastName,
            photoInfo: user.photoInfo // Include photoInfo in the response
        });
    } catch (error) {
        // Handle errors
        next(error);
    }
}


async function logout(req, res, next) {
    try {
        // Since there's no session to clear on the server side with JWT,
        // the logout process mainly happens on the client side by discarding the token.
        // So, you can simply send a response indicating successful logout.

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        // Handle errors
        next(error);
    }
}

export default {
    login,
    logout,
};
