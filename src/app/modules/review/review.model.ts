import { model, Schema } from 'mongoose';
import { TReview } from './review.interface';

const ReviewSchema = new Schema<TReview>({
  courseId: { type: Schema.Types.ObjectId, required: true, ref: 'Course' },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
});

export const Review = model<TReview>('Review', ReviewSchema);
