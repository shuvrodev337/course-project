// 0 ? []  {}

import { TCategory } from './category.interface';
import { Category } from './category.model';

const createCategoryIntoDb = async (payload: TCategory) => {
  const result = await Category.create(payload);
  return result;
};

export const CategoryServices = { createCategoryIntoDb };
