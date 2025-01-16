import express from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
const router = express.Router();

router.get('/', UserController.getUsers);
router.get('/:id', UserController.getSingleUser);
router.patch(
  '/:id',
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUser,
);

export const UserRoutes = router;
