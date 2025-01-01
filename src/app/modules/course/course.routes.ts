import express from 'express';
import { CourseController } from './course.controller';
const router = express.Router();

router.post('/create-course', CourseController.createCourse);

export const CourseRoutes = router;
