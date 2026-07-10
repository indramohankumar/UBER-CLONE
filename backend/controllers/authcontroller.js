const User = require("../models/usermodel");


// Register User

const registerUser = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;

        // Validate input
        if (!fullname || !fullname.firstname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await User.hashPassword(password);

        // Create user
        const newUser = await User.create({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email,
            password: hashedPassword,
            role
        });

        // Generate JWT
        const token = newUser.generateAuthToken();

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: newUser
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// Login User

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        // Find user
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = user.generateAuthToken();

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ==========================
// Get Profile
// ==========================
const getProfile = async (req, res) => {
    try {
        // req.user is set by the authMiddleware
        return res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile
};