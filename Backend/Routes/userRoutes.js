import { Router } from 'express';
import {authUser, signup} from '../controller/user.controller.js'

const router = Router();

router.route('/sign-up').post(signup);
router.post('/sign-in',authUser)


export default router;
