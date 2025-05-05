import asyncHandler from 'express-async-handler';
import User from '../models/SignupModel.js';
import generateToken from '../config/generateToken.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
});

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

        const users = await User.find(filters).sort({ createdAt: 1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// Forgot Password controller
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    try {
        if (!user) {
            return res.status(404).json({ message: 'User with that email does not exist' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Create email message
        const mailOptions = {
            from: `"PC-MSIT Placement Portal" ${process.env.EMAIL_USER}`,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td style="padding: 20px; text-align: center; background-color: #f5f5f5;">
                <h1 style="margin: 0; color: #1976d2; font-size: 24px;">MSIT Placement Portal</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px;">
                <p style="margin-top: 0;">Hello,</p>
                <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
                <p>Please click on the link below to reset your password. This link is valid for 10 minutes only.</p>
                <p style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" style="background-color: #1976d2; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
                </p>
                <p>If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
                <p>Best regards,<br>MSIT Placement Portal Team</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px; text-align: center; background-color: #f5f5f5; font-size: 12px; color: #666;">
                <p>This is an official communication from the MSIT Placement Portal.</p>
                <p>© ${new Date().getFullYear()} MSIT Placement Portal. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
            text: `
        Hello,
        
        You are receiving this email because you (or someone else) has requested the reset of a password.
        
        Please click on the following link to reset your password (valid for 10 minutes):
        ${resetUrl}
        
        If you did not request a password reset, please ignore this email and your password will remain unchanged.
        
        Best regards,
        MSIT Placement Portal Team
      `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Password reset email sent! Please check your inbox.'
        });
    } catch (error) {
        console.error('Forgot password error:', error);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(500).json({
            message: 'Could not send reset email. Please try again later.',
            error: error.message
        });
    }
};

// Reset Password controller
const resetPassword = async (req, res) => {
    try {
        const { resetToken } = req.params;
        const { password } = req.body;

        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Password reset token is invalid or has expired'
            });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        const mailOptions = {
            from: `"PC-MSIT Placement Portal" ${process.env.EMAIL_USER}`,
            to: user.email,
            subject: 'Your Password Has Been Changed',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Changed</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td style="padding: 20px; text-align: center; background-color: #f5f5f5;">
                <h1 style="margin: 0; color: #1976d2; font-size: 24px;">MSIT Placement Portal</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px;">
                <p style="margin-top: 0;">Hello,</p>
                <p>This is a confirmation that the password for your account has just been changed.</p>
                <p>If you did not make this change, please contact our support team immediately.</p>
                <p>Best regards,<br>MSIT Placement Portal Team</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px; text-align: center; background-color: #f5f5f5; font-size: 12px; color: #666;">
                <p>This is an official communication from the MSIT Placement Portal.</p>
                <p>© ${new Date().getFullYear()} MSIT Placement Portal. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
            text: `
        Hello,
        
        This is a confirmation that the password for your account has just been changed.
        
        If you did not make this change, please contact our support team immediately.
        
        Best regards,
        MSIT Placement Portal Team
      `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Password reset successful. You can now log in with your new password.'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            message: 'Could not reset password. Please try again later.',
            error: error.message
        });
    }
};

export { signup, authUser, getUsers, forgotPassword, resetPassword };
