import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/SignupModel.js';


const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // console.log('Token received:', token); // Debug token

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log('Decoded token:', decoded); // Debug decoded token

            req.user = await User.findById(decoded.id).select('-password');
            // console.log('User found:', req.user); // Debug user

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});


const adminOnly = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied, admin only' });
    }
});

export { protect, adminOnly };
