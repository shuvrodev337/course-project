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
  const queryObj = { ...query };
  const excludedFields = ['searchTerm', 'sort', 'page', 'limit', 'fields'];
  excludedFields.forEach((element) => {
    delete queryObj[element];
  });

  //search
  const searchTerm = query?.searchTerm ? query.searchTerm : '';
  const courseSeachFields = ['title', 'instructor', 'provider'];
  const searchQuery = Course.find({
    $or: courseSeachFields.map((field) => {
      return { [field]: { $regex: searchTerm, $options: 'i' } };
    }),
  });

  //filter
  const filterQuery = searchQuery.find(queryObj);

  //sort
  const sort = query?.sort ? (query?.sort as string) : '-createdAt';
  const sortQuery = filterQuery.sort(sort);

  // paginate and limit
  const page = query?.page ? Number(query?.page) : 1;
  const limit = query?.limit ? Number(query?.limit) : 1;
  const skip = query?.page ? (page - 1) * limit : 0;
  const paginateQuery = sortQuery.skip(skip);

  // field select

  const fields = query?.fields
    ? (query?.fields as string)?.split(',')?.join(' ')
    : '-__v';
  const fieldLimitQuery = paginateQuery.select(fields);

  const result = await fieldLimitQuery.populate('categoryId');
  return result;
};

export const CourseServices = { createCourseIntoDb, getCoursesFromDb };
