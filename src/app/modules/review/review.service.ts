// 0 ? []  {}

import { TReview } from './review.interface';
import { Review } from './review.model';

const createReviewIntoDb = async (payload: TReview) => {
  const result = await Review.create(payload);
  return result;
};

export const ReviewServices = { createReviewIntoDb };
