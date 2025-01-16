// 0 {} [] ?

import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import { createToken } from './auth.utils';

// User Registration
const createUserIntoDb = async (payload: TUser) => {
  console.log(payload);
  const { username, email } = payload;
  payload.role = 'user';

  // Check if a user with the same username or email already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    const errorMessage =
      existingUser.username === username
        ? 'This username is already registered!'
        : 'This email is already registered!';
    throw new AppError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  const result = await User.create(payload);
  return result;
};

// User Login

const loginUser = async (payload: TLoginUser) => {
  const { username, password } = payload;
  console.log(payload);
  const user = await User.findOne({ username }).select('+password'); // Explicitly Select password, which is excluded by default.
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (!(await User.isPasswordMatched(password, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Wrong password!');
  }

  const jwtPayload = {
    _id: user._id,
    role: user?.role,
    email: user?.email,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return { user, accessToken, refreshToken };
};

export const AuthServices = { createUserIntoDb, loginUser };
