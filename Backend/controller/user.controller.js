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
      nationality,
      cgpa,
      yearOfPassing,
      gapYear,
      activeBacklogs
    } = req.query;
  
    try {
      const filters = {};
      if (degree) filters.degree = new RegExp(degree, 'i');
      if (course) filters.course = new RegExp(course, 'i');
      if (nationality) filters.nationality = new RegExp(nationality, 'i');
      if (yearOfPassing) filters.yearOfPassing = new RegExp(yearOfPassing, 'i');
      if (gapYear) filters.gapYear = new RegExp(gapYear, 'i');
      if (activeBacklogs) filters.activeBacklogs = new RegExp(activeBacklogs, 'i');
  
      // Handling range filters for twelfthPercentage and cgpa
      if (twelfthPercentage) {
        const [minTwelfth, maxTwelfth] = twelfthPercentage.split(',').map(Number);
        filters.twelfthPercentage = { $gte: minTwelfth, $lte: maxTwelfth };
      }
      if (cgpa) {
        const [minCgpa, maxCgpa] = cgpa.split(',').map(Number);
        filters.cgpa = { $gte: minCgpa, $lte: maxCgpa };
      }
  
      // Log the filters to verify
      console.log('Applying filters:', filters);
  
      const users = await User.find(filters);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
    }
};
// const getCompanies = async (req, res) => {
//     const {
//       jobTitle,
//       location,
//       type,
//       ctc
//     } = req.query;
  
//     try {
//       const filters = {};
//       if (jobTitle) filters.jobTitle = new RegExp(jobTitle, 'i');
//       if (location) filters.location = new RegExp(location, 'i');
//       if (type) filters.type = new RegExp(type, 'i');
      
//       // Handling range filter for ctc
//       if (ctc) {
//         const [minCtc, maxCtc] = ctc.split(',').map(Number);
//         filters.ctc = { $gte: minCtc, $lte: maxCtc };
//       }
  
//       // Log the filters to verify
//       console.log('Applying filters:', filters);
  
//       const companies = await Company.find(filters);
//       res.json(companies);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching companies' });
//     }
// };

  
  
  

export { signup, authUser , getUsers};
