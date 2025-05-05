import { authUser, forgotPassword, getUsers, resetPassword, signup } from '../controller/user.controller.js';
import express from 'express';
import User from '../models/SignupModel.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();



router.post('/sign-up', signup);
router.post('/sign-in', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);
router.get('/find', protect, getUsers);

router.get('/profile/:userId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('fullname email dob degree course twelfthPercentage classes enrollmentNumber diplomaPercentage nationality cgpa address school12th tenthPercentage gapYear yearOfPassing activeBacklogs contactNumber resumeURL linkedin github leetCode');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});



router.get('/:userId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('fullname email dob course degree appliedJobs isAdmin');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});
router.get('/user-profile/:userId', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/update-profile/:id', protect, async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  console.log(updatedData)

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true, allowNull: false });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});
export default router;
