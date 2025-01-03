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
  const excludedFields = [
    'searchTerm',
    'sortBy',
    'sortOrder',
    'page',
    'limit',
    'fields',
    'minPrice',
    'maxPrice',
    'tags',
    'startDate',
    'endDate',
  ];
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
  // tagSearch
  const tagsTerm = query?.tags ? query.tags : '';
  const tagsQuery = searchQuery.find({
    'tags.name': { $regex: tagsTerm, $options: 'i' },
  });

  // priceQuery
  const minPrice = query?.minPrice ? query.minPrice : 0;
  const maxPrice = query?.maxPrice ? query.maxPrice : 1111111110;

  const priceQuery = tagsQuery.find({
    price: { $gte: minPrice, $lte: maxPrice },
  });

  // Date Range Query
  const dateConditions: Record<string, unknown> = {};
  if (query?.startDate) {
    dateConditions.startDate = { $gte: query.startDate };
  }
  if (query?.endDate) {
    dateConditions.endDate = { $lte: query.endDate };
  }
  const dateQuery = priceQuery.find(dateConditions);

  // Filter
  const filterQuery = dateQuery.find(queryObj);

  //sort
  const sortField = query?.sortBy || 'createdAt';
  const sortOrder = query?.sortOrder === 'desc' ? '-' : '';
  const sort = `${sortOrder}${sortField}`;
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
    sortBy = 'createdAt',
    sortOrder = 'asc',
    page = 1,
    limit = 10,
    fields = '-__v',
    minPrice = 0,
    maxPrice = Infinity,
    tags = '',
    startDate,
    endDate,
    ...filters
  } = query;

  // Search Query
  const courseSearchFields = ['title', 'instructor', 'provider'];
  const searchConditions = {
    $or: courseSearchFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  };
  // Tag Query
  const tagConditions = tags
    ? { 'tags.name': { $regex: tags, $options: 'i' } }
    : {};

  // Price Query
  const priceConditions = {
    price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
  };

  // Date Range Query
  const dateConditions: Record<string, unknown> = {};
  if (startDate) dateConditions.startDate = { $gte: startDate };
  if (endDate) dateConditions.endDate = { $lte: endDate };

  // Sorting
  const sort = `${sortOrder === 'desc' ? '-' : ''}${sortBy}`;

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  // console.log({
  //   ...searchConditions,
  //   ...tagConditions,
  //   ...priceConditions,
  //   ...dateConditions,
  //   ...filters,
  // });

  // Query Execution
  const result = await Course.find({
    ...searchConditions,
    ...tagConditions,
    ...priceConditions,
    ...dateConditions,
    ...filters,
  })
    .sort(sort)
    .skip(skip)
    .limit(Number(limit))
    .select((fields as string).split(',').join(' '));
  // .populate('categoryId');

  return result;
};

export const CourseServices = { createCourseIntoDb, getCoursesFromDb };
