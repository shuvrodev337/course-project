// 0 ? []  {}

import { TCourse } from './course.interface';
import { Course } from './course.model';
import { calculateDurationInWeeks } from './course.utils';

const createCourseIntoDb = async (payload: TCourse) => {
  if (payload.startDate && payload.endDate) {
    const durationInWeeks = calculateDurationInWeeks(
      payload.startDate,
      payload.endDate,
    );
    payload.durationInWeeks = durationInWeeks;
  }

  const result = await Course.create(payload);
  return result;
};

const getCoursesFromDb = async (query: Record<string, unknown>) => {
  if (query) {
    console.log(query);
  }
  const result = await Course.find();
  return result;
};

export const CourseServices = { createCourseIntoDb, getCoursesFromDb };
