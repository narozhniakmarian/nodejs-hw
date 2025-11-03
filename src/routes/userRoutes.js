// src/routes/userRoutes.js

import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { getCurrentUser, updateUserAvatar, updateUserPassword, updateUserProfile } from '../controllers/userController.js';
import { upload } from '../middleware/multer.js';
import { celebrate } from 'celebrate';
import { updatePasswordSchema, updateUserSchema } from '../validations/authValidation.js';

const router = Router();

router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single("avatar"),
  updateUserAvatar,
);

router.get('/users/me', authenticate, getCurrentUser);

router.patch('/users/me', authenticate, celebrate(updateUserSchema), updateUserProfile);

router.patch('/users/me/password', authenticate, celebrate(updatePasswordSchema), updateUserPassword);
export default router;
