import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from './profile.controller.js';
import { validateJWT } from '../../../middlewares/validate_jwt.js';

const router = Router();

router.get('/', validateJWT, getProfile);
router.put('/', validateJWT, updateProfile);
router.put('/change-password', validateJWT, changePassword);

export default router;