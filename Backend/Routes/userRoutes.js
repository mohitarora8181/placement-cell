import { authUser, forgotPassword, getUsers, resetPassword, signup } from '../controller/user.controller.js';
import express from 'express';
import User from '../models/SignupModel.js';
import { protect } from '../middlewares/authMiddleware.js';
import Forms from '../models/FormModel.js';

const router = express.Router();



router.post('/sign-up', signup);
router.post('/sign-in', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);
router.get('/find', protect, getUsers);

router.get('/forms', protect, async (req, res) => {
  try {
    const forms = await Forms.find({})
      .select('-interestedStudents')
      .sort({ createdAt: -1 });

    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/forms/:formId/:userId', protect, async (req, res) => {
  try {
    const { formId, userId } = req.params;
    const form = await Forms.findById(formId).select('-interestedStudents');

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    const fullForm = await Forms.findById(formId);

    const formResponse = form.toObject();
    formResponse.isAlreadySubmitted = fullForm.interestedStudents.some(
      student => student.toString() === userId
    );

    res.json(formResponse);
  } catch (error) {
    console.error('Error fetching form details:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.post('/forms/:formId/submit', protect, async (req, res) => {
  try {
    const { formId } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const form = await Forms.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.status !== 'active') {
      return res.status(400).json({ message: 'This opportunity is no longer accepting submissions' });
    }

    if (form.interestedStudents.includes(userId)) {
      return res.status(400).json({ message: 'You have already applied for this opportunity' });
    }

    if (form.targetAudience === 'specific' && form.departments.length > 0) {
      const userDepartment = user.course;
      if (!form.departments.includes(userDepartment)) {
        return res.status(403).json({
          message: 'You are not eligible for this opportunity as it is specific to certain departments'
        });
      }
    }

    form.interestedStudents.push(userId);
    await form.save();

    if (!user.appliedForms) {
      user.appliedForms = [];
    }

    if (!user.appliedForms.includes(formId)) {
      user.appliedForms.push(formId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


router.get('/profile/:userId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('fullname email dob degree course twelfthPercentage classes enrollmentNumber diplomaPercentage nationality cgpa address school12th tenthPercentage gapYear yearOfPassing activeBacklogs contactNumber resumeURL linkedin github leetCode appliedForms');

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
      .select('fullname email dob course degree appliedForms isAdmin');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
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
