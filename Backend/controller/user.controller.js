import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/SignupModel.js';
import generateToken from '../config/generateToken.js';

const signup = asyncHandler(async (req, res) => {
    const {
        username, email, fullname, password, dob, degree, course, twelfthPercentage, diplomaPercentage,
        nationality, cgpa, address, school12th, tenthPercentage, gapYear, yearOfPassing, activeBacklogs,
        contactNumber
    } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400);
        throw new Error("Email already exists");
    }

    try {
        const user = await User.create({
            username,
            email,
            fullname,
            password,
            dob,
            degree,
            course,
            twelfthPercentage,
            diplomaPercentage,
            nationality,
            cgpa,
            address,
            school12th,
            tenthPercentage,
            gapYear,
            yearOfPassing,
            activeBacklogs,
            contactNumber,
            isAdmin: false
        });

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            dob: user.dob,
            degree: user.degree,
            course: user.course,
            twelfthPercentage: user.twelfthPercentage,
            diplomaPercentage: user.diplomaPercentage,
            nationality: user.nationality,
            cgpa: user.cgpa,
            address: user.address,
            school12th: user.school12th,
            tenthPercentage: user.tenthPercentage,
            gapYear: user.gapYear,
            yearOfPassing: user.yearOfPassing,
            activeBacklogs: user.activeBacklogs,
            contactNumber: user.contactNumber,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});

const authUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (user) {
            const isMatch = await user.matchPassword(password);

            if (isMatch) {
                res.json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user._id),
                });
            } else {
                res.status(400).json({ message: 'Invalid email or password' });
            }
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export { signup, authUser };
