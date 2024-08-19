import { Router } from 'express';
import {authUser, signup} from '../controller/user.controller.js'
import express from 'express';
import User from '../models/SignupModel.js';




const router = express.Router();

router.route('/sign-up').post(signup);
router.post('/sign-in',authUser)
router.get('/profile/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      
      
      const user = await User.findById(userId)
        .select('username email dob course degree'); 
  
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      
      res.json(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


export default router;
