// 0 ? []  {}

import { Types } from 'mongoose';

export type TTag = {
  name: string;
  isDeleted?: boolean;
};

export type TDetails = {
  level: string; // e.g., Beginner, Intermediate, Advanced
  description: string; // Detailed description of the course
};

export type TCourse = {
  title: string; // A unique title of the course
  instructor: string; // The instructor of the course
  price: number; // The price of the course
  tags: TTag[]; // An array of tag objects
  startDate: string; // The start date of the course
  endDate: string; // The end date of the course
  language: string; // The language in which the course is conducted
  provider: string; // The provider of the course
  durationInWeeks?: number; // Overall duration of the course in weeks
  details: TDetails; // Detailed information about the course
  categoryId: Types.ObjectId;
};
