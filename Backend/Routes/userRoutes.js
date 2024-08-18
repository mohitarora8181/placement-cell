import { Router } from 'express';
import {signup} from '../controller/user.controller.js'

const router = Router();

router.route('/sign-up').post(signup);

export default router;
