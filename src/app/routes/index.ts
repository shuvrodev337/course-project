import express from 'express';
import { CourseRoutes } from '../modules/course/course.routes';
import { CategoryRoutes } from '../modules/category/category.routes';
import { ReviewRoutes } from '../modules/review/review.routes';
import { UserRoutes } from '../modules/user/user.routes';
const router = express.Router();
const routes = [
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/auth',
    route: UserRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));
export default router;
