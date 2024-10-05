const Users = require('../models/userModel');
const Product = require('../models/productModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userCtrl = {
    register: async (req, res) => {
        try {
            console.log(req.body);
            const { name, email, password } = req.body;

            // Check for missing password
            if (!password) {
                return res.status(400).json({ msg: "Password is required" });
            }

            // Check password length
            if (password.length < 6) {
                return res.status(400).json({ msg: "Password must be at least 6 characters long" });
            }

            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create new user
            const newUser = new Users({
                name,
                email,
                password: hashedPassword
            });

            // Save user to the database
            await newUser.save();

            // Create tokens
            const accesstoken = createAccessToken({ id: newUser._id });
            const refreshtoken = createRefreshToken({ id: newUser._id });

            // Set refresh token in cookies
            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                sameSite: 'None',  // Allows cross-origin requests
                secure: true,      // Ensures cookies are sent only over HTTPS (adjust for local dev if needed)
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            // Return access token in response
            res.json({ accesstoken });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    refreshtoken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;

            if (!rf_token) return res.status(400).json({ msg: "No refresh token, please log in" });

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(403).json({ msg: "Invalid or expired refresh token, please log in" });
                const accesstoken = createAccessToken({ id: user.id });
                res.json({ accesstoken });
            });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    login: async (req, res) => {
        try {
            console.log(req.body);
            const { email, password } = req.body;

            const user = await Users.findOne({ email });
            console.log(user);
            if (!user) return res.status(400).json({ msg: "User does not exist" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

            // Create tokens
            const accesstoken = createAccessToken({ id: user._id });
            const refreshtoken = createRefreshToken({ id: user._id });

            // Set refresh token in cookies
            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                sameSite: 'None',  // Allows cross-origin requests
                secure: true,      // Ensures cookies are sent only over HTTPS
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            // Remove sensitive data (like password) before sending user data
            const sanitizedUser = { ...user._doc };  // Clone user object
            delete sanitizedUser.password;           // Remove password field

            // Send response with access token and sanitized user
            res.json({ accesstoken, user: sanitizedUser });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },


    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken'); // No need for path unless set during cookie creation
            return res.json({ msg: "Logged Out" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password');
            if (!user) return res.status(400).json({ msg: "User Not Found" });
            res.json(user);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

   

    Updatecart: async (req, res) => {
        try {
            const { email, product_id } = req.body; // Now only getting product_id
            console.log(email, product_id);
            // Find the user by their email
            const user = await Users.findOne({ email });
            if (!user) return res.status(400).json({ msg: "User does not exist." });

            // Validate that the product_id is provided
            if (!product_id) {
                return res.status(400).json({ msg: "Product ID is required." });
            }

            // Find the product by product_id
            const existingProduct = await Product.findById(product_id);
            console.log(existingProduct); // This will help in debugging
            if (!existingProduct) return res.status(400).json({ msg: "Product does not exist." });


            // Prepare the cart item
            const cartItem = {
                images: existingProduct.images,
                price: existingProduct.price,
                title: existingProduct.title,
                product_id: existingProduct._id,
                // You can add any other required fields from the product as needed
                quantity: 1, // Default quantity set to 1, if applicable
            };

            // Push the cart item into the user's cart
            user.cart.push(cartItem);

            // Save the updated user document
            await user.save();
            return res.json({ msg: "Product added to cart" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },



    Getcart: async (req, res) => {
        try {
            // Extract the email from the request body (sent by the frontend)
            const { email } = req.body;

            // Find the user by email and populate the cart with product details
            const user = await Users.findOne({ email }).populate('cart');
            console.log(user);
            if (!user) return res.status(400).json({ msg: "User does not exist." });

            // Send back the user's cart
            res.json({ cart: user.cart });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    DeleteCart: async (req, res) => {
        try {
            const { email, index } = req.body;
            const user = await Users.findOne({ email });

            if (!user || !user.cart || index < 0 || index >= user.cart.length) {
                return res.status(404).json({ msg: 'Cart not found or invalid index' });
            }

            user.cart.splice(index, 1);
            await user.save();

            res.json({ cart: user.cart });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    getUserByEmail: async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ msg: "Email is required" });

            const user = await Users.findOne({ email }).select('-password');
            if (!user) return res.status(404).json({ msg: "User not found" });

            res.json(user);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getcomment: async (req, res) => {
        try {
            const { email, product_id, comment } = req.body;

            const user = await Users.findOne({ email });
            if (!user) return res.status(400).json({ msg: 'User not found' });

            if (!user.cart || user.cart.length === 0) {
                return res.status(400).json({ msg: 'Cart is empty' });
            }

            const cartItem = user.cart.find(item => item.product_id === product_id);
            if (!cartItem) return res.status(400).json({ msg: 'Product not found in cart' });

            cartItem.comment = comment;
            await user.save();

            res.json({ msg: 'Comment added successfully', cart: user.cart });
        } catch (err) {
            res.status(500).json({ msg: 'Server error' });
        }
    }
};

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = userCtrl;
