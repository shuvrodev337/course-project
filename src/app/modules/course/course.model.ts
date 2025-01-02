import { model, Schema } from 'mongoose';
import { TCourse, TDetails, TTag } from './course.interface';

const TagSchema = new Schema<TTag>({
  name: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

const DetailsSchema = new Schema<TDetails>({
  level: { type: String, required: true },
  description: { type: String, required: true },
});

const CourseSchema = new Schema<TCourse>(
  {
    title: { type: String, required: true, unique: true },
    instructor: { type: String, required: true },
    price: { type: Number, required: true },
    tags: { type: [TagSchema], required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    language: { type: String, required: true },
    provider: { type: String, required: true },
    durationInWeeks: { type: Number },
    details: { type: DetailsSchema, required: true },
    categoryId: { type: Schema.ObjectId, required: true, ref: 'Category' },
  },
  {
    timestamps: true,
  },
);

export const Course = model<TCourse>('Course', CourseSchema);
