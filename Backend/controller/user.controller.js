import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/SignupModel.js';
import generateToken from '../config/generateToken.js';

const signup = asyncHandler(async (req, res) => {
    const {
        email, fullname, password, dob, degree, course, classes, twelfthPercentage, diplomaPercentage,
        nationality, cgpa, address, school12th, tenthPercentage, gapYear, yearOfPassing, activeBacklogs,
        contactNumber, linkedin, github, leetCode, enrollmentNumber
    } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400).json({ message: 'Email already exist ( Try Sign In )' });
        throw new Error("Email already exists");
    }

    try {
        let username = email.split("@")[0];
        const user = await User.create({
            username,
            email,
            fullname,
            enrollmentNumber,
            password,
            dob,
            degree,
            course,
            classes,
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
            linkedin,
            github,
            leetCode,
            isAdmin: false
        });

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            enrollmentNumber: user.enrollmentNumber,
            dob: user.dob,
            degree: user.degree,
            course: user.course,
            twelfthPercentage: user.twelfthPercentage,
            diplomaPercentage: user.diplomaPercentage,
            nationality: user.nationality,
            classes: user.classes,
            cgpa: user.cgpa,
            address: user.address,
            school12th: user.school12th,
            tenthPercentage: user.tenthPercentage,
            gapYear: user.gapYear,
            yearOfPassing: user.yearOfPassing,
            activeBacklogs: user.activeBacklogs,
            contactNumber: user.contactNumber,
            linkedIn: user.linkedin,
            github: user.github,
            leetCode: user.leetCode,
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
                    token: generateToken(user._id)
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

const getUsers = async (req, res) => {
    const {
        degree,
        course,
        twelfthPercentage,
        classes,
        cgpa,
        yearOfPassing,
        gapYear,
        activeBacklogs,
    } = req.query;

    try {
        const filters = {};
        if (degree) filters.degree = new RegExp(degree, 'i');
        if (course) filters.course = new RegExp(course, 'i');
        if (classes) filters.classes = new RegExp(classes, 'i');

        if (twelfthPercentage) {
            const [minTwelfth, maxTwelfth] = twelfthPercentage.split(',').map(Number);
            filters.twelfthPercentage = { $gte: minTwelfth, $lte: maxTwelfth };
        }

        if (cgpa) {
            const [minCgpa, maxCgpa] = cgpa.split(',').map(Number);
            filters.cgpa = { $gte: minCgpa, $lte: maxCgpa };
        }

        if (yearOfPassing) filters.yearOfPassing = Number(yearOfPassing);
        if (gapYear) filters.gapYear = Number(gapYear);
        if (activeBacklogs) filters.activeBacklogs = Number(activeBacklogs);


        console.log('Applying filters:', filters);

        const users = await User.find(filters);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};


export { signup, authUser, getUsers };
