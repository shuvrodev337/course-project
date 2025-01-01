// 0 ? []  {}

import { TCourse } from './course.interface';
import { Course } from './course.model';

const createCourseIntoDb = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

export const CourseServices = { createCourseIntoDb };
