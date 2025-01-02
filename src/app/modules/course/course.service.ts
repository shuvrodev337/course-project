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

// My Way
/*
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
*/
// New way
const getCoursesFromDb = async (query: Record<string, unknown>) => {
  const {
    searchTerm = '',
    sort = '-createdAt',
    page = 1,
    limit = 10,
    fields = '-__v',
    ...filters
  } = query;
  console.log('query->', query);

  // Handle search conditions
  const courseSearchFields = ['title', 'instructor', 'provider'];
  const searchConditions = searchTerm
    ? {
        $or: courseSearchFields.map((field) => ({
          [field]: { $regex: searchTerm as string, $options: 'i' },
        })),
      }
    : {};
  console.log('searchConditions->', searchConditions);
  // Combine search conditions with other filters
  const finalQuery = { ...filters, ...searchConditions };
  console.log('finalQuery->', finalQuery);

  // Pagination setup
  const skip = (Number(page) - 1) * Number(limit);

  // Query execution
  const result = await Course.find(finalQuery)
    .sort(sort as string)
    .skip(skip)
    .limit(Number(limit))
    .select((fields as string)?.split(',').join(' '))
    .populate('categoryId');

  return result;
};

export const CourseServices = { createCourseIntoDb, getCoursesFromDb };
