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
    console.log(err);
  }
};

export const CourseController = {
  createCourse,
};
