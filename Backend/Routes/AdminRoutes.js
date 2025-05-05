import express from "express"
const router = express.Router();
import User from "../models/SignupModel.js";
import { protect } from "../middlewares/authMiddleware.js";
import Notification from "../models/NotificationModel.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  }
});

router.post('/notify', protect, async (req, res) => {
  const { to, department, emails, message, subject } = req.body;

  try {
    let users = [];
    if (to === 'all') {
      // if (department === 'all') {
      //   users = await User.find({ isAdmin: { $ne: true } });
      // } else {
      //   users = await User.find({ course: department,isAdmin: { $ne: true } });
      // }
    } else if (to === 'specific' && emails) {
      users = await User.find({ email: { $in: emails } });
    }

    if (users.length === 0) {
      return res.status(400).json({ message: 'No users found for notification.' });
    }

    const emailSubject = subject || 'New Notification from PC-MSIT Placement Portal';
    const userEmails = users.map(user => user.email);

    const mailOptions = {
      from: `"PC-MSIT Placement Portal" ${process.env.EMAIL_USER}`,
      bcc: userEmails,
      subject: emailSubject,
      priority: 'high',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      },
      html: `
        <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MSIT Placement Cell Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
          <td style="padding: 20px; text-align: center; background-color: #f5f5f5;">
            <h1 style="margin: 0; color: #1976d2; font-size: 24px;">MSIT Placement Cell</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <p style="margin-top: 0;">Dear Student,</p>
            <p style="margin-bottom: 20px;">${message}</p>
            <p>Best regards,<br>MSIT Placement Cell Team</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 15px; text-align: center; background-color: #f5f5f5; font-size: 12px; color: #666;">
            <p>This is an official communication from the MSIT Placement Cell.</p>
            <p>© ${new Date().getFullYear()} MSIT Placement Cell. All rights reserved.</p>
            <p>
              <a href="https://pcmsit.vercel.app" style="color: #1976d2; text-decoration: underline;">Visit Portal</a>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
      text: `MSIT Placement Cell Notification 
  Dear Student,
  ${message}
  If you have any questions, please contact the placement office directly.
  Best regards,
  MSIT Placement Cell Team`
    };

    const emailResult = await transporter.sendMail(mailOptions);
    console.log('Email notification sent:', emailResult.messageId);

    const notification = new Notification({
      message,
      subject: emailSubject,
      notificationType: to,
      emails: userEmails
    });

    await notification.save();

    res.status(200).json({
      message: 'Notifications sent successfully both in-app and via email.',
      recipients: users.length
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({
      message: 'Server error. Could not send notifications.',
      error: error.message
    });
  }
});

router.get('/notifications', protect, async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })

    res.status(200).json({
      notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      message: 'Server error. Could not fetch notifications.',
      error: error.message
    });
  }
});

// Add this route after your GET /notifications route
router.delete('/notifications/:id', protect, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({
      message: 'Notification deleted successfully',
      id: notificationId
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      message: 'Server error. Could not delete notification.',
      error: error.message
    });
  }
});

//Endpoint for fetching fields for filtering companies data
router.get('/filterFields', async (req, res) => {
  try {

    const degree = await User.distinct('degree', { isAdmin: { $ne: true } });
    const course = await User.distinct('course', { isAdmin: { $ne: true } });
    const classes = await User.distinct('classes', { isAdmin: { $ne: true } });
    const yearOfPassing = await User.distinct('yearOfPassing', { isAdmin: { $ne: true } });
    const activeBacklogs = await User.distinct('activeBacklogs', { isAdmin: { $ne: true } });


    res.json({ degree, course, yearOfPassing, activeBacklogs, classes });

  } catch (error) {
    console.error('Error fetching companies filter fields:', error); // Log detailed error
    res.status(500).json({ message: 'Error fetching companies filter fields', error: error.message });
  }
});



export default router; 
