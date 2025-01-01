// 0 ? []  {}

import { Request, Response } from 'express';
import { ReviewServices } from './review.service';

const createReview = async (req: Request, res: Response) => {
  try {
    const { review } = req.body;
    const result = await ReviewServices.createReviewIntoDb(review);
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Review created successfully',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

export const ReviewController = {
  createReview,
};
