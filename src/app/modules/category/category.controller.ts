// 0 ? []  {}

import { Request, Response } from 'express';
import { CategoryServices } from './category.service';

const createCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.body;
    const result = await CategoryServices.createCategoryIntoDb(category);
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Category created successfully',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

export const CategoryController = {
  createCategory,
};
