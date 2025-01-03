// 0 ? []  {}

import { Request, Response } from 'express';
import { CourseServices } from './course.service';

const createCourse = async (req: Request, res: Response) => {
  try {
    const { course } = req.body;
    const result = await CourseServices.createCourseIntoDb(course);
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Course created successfully',
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Something went wrong!',
      error: err,
    });
  }
};
const getCourses = async (req: Request, res: Response) => {
  try {
    const query = req.query;
    const result = await CourseServices.getCoursesFromDb(query);
    res.status(200).json({
      success: true,
      statusCode: 201,
      message: 'Course retrieved successfully',
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Something went wrong!',
      error: err,
    });
  }
};

export const CourseController = {
  createCourse,
  getCourses,
};
