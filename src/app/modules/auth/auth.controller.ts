// 0 ? []  {}

import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { AuthServices } from './auth.service';
import config from '../../config';
import { StatusCodes } from 'http-status-codes';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { user } = req.body;
  const result = await AuthServices.createUserIntoDb(user);
  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'User created successfully',
    data: result,
  });
});
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  const { user, accessToken, refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User logged in successfully',
    data: { user, token: accessToken },
  });
});
const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  console.log(user);
  const passwordData = req.body;
  const result = await AuthServices.changePassword(user, passwordData);
  res.status(StatusCodes.OK).json({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Password updated successfully',
    data: result,
  });
});
export const AuthController = {
  createUser,
  loginUser,
  changePassword,
};
