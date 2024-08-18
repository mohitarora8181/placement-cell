import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/SignupModel.js';

const signup = asyncHandler(async (req, res) => {
    const {
        username, email, fullname, password, dob, degree, course, sgpa1, sgpa2, sgpa3, sgpa4, sgpa5, sgpa6,
        twelfthPercentage, diplomaPercentage, nationality, cgpa, address, school12th, tenthPercentage,
        gapYear, specialisation, yearOfPassing, backlogs1, backlogs2, backlogs3, backlogs4, backlogs5, backlogs6
    } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400);
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({
            username,
            email,
            fullname,
            password: hashedPassword,
            dob,
            degree,
            course,
            sgpa1,
            sgpa2,
            sgpa3,
            sgpa4,
            sgpa5,
            sgpa6,
            twelfthPercentage,
            diplomaPercentage,
            nationality,
            cgpa,
            address,
            school12th,
            tenthPercentage,
            gapYear,
            specialisation,
            yearOfPassing,
            backlogs1,
            backlogs2,
            backlogs3,
            backlogs4,
            backlogs5,
            backlogs6
        });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});

export { signup };
