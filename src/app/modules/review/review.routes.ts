import express from 'express';
import { ReviewController } from './review.controller';
const router = express.Router();

router.post('/create-review', ReviewController.createReview);

export const ReviewRoutes = router;
