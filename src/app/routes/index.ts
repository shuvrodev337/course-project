import express from 'express';
import { CourseRoutes } from '../modules/course/course.routes';
const router = express.Router();
const routes = [
  {
    path: '/courses',
    route: CourseRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));
export default router;
