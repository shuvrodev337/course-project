// 0 {} [] ?

import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TChangePassword, TLoginUser } from './auth.interface';
import config from '../../config';
import { createToken } from './auth.utils';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// User Registration
const createUserIntoDb = async (payload: TUser) => {
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

const changePassword = async (
  userData: JwtPayload,
  passwordData: TChangePassword,
) => {
  const { oldPassword, newPassword } = passwordData;

  const user = await User.findById(userData._id)
    .select('+password')
    .select('+passwordHistory');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // check if the old password match the current password
  if (!(await User.isPasswordMatched(oldPassword, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Incorrect old password!');
  }

  // Check if the new password matches the current password
  const isNewPasswordSameAsCurrent = await User.isPasswordMatched(
    newPassword,
    user.password,
  );
  if (isNewPasswordSameAsCurrent) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'New password cannot be the same as the current password!',
    );
  }

  /* password history check logic
   * NO password will go to passwordHistory field during creating user.
   * During change password,  the password which is being changed(user.password), will go to passwordHistory
   * passwordHistory field is set to have only latest 2 entries.
   * new password will get checked with current password(user.password)
   * new password will get checked with previous two passwords from passwordHistory.
   */

  // check if the new password matches the previously set passwords

  const recentPasswordHistory = user.passwordHistory;

  for (const passwordData of recentPasswordHistory) {
    if (await User.isPasswordMatched(newPassword, passwordData.oldPassword)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'Can not use old password as new !',
      );
    }
  }
  // hash new user password
  const hashedNewPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );
  // create new entry for passwordHistory field
  const newPasswordHistoryEntry = {
    oldPassword: user.password,
    changedAt: new Date(),
  };
  // Update the password history to maintain only the last 2 entries
  const updatedPasswordHistory = [
    ...user.passwordHistory,
    newPasswordHistoryEntry,
  ];
  if (updatedPasswordHistory.length > 2) {
    updatedPasswordHistory.shift(); // Remove the oldest entry
  }

  const result = await User.findByIdAndUpdate(
    user._id,
    {
      password: hashedNewPassword, // set user password
      $set: { passwordHistory: updatedPasswordHistory }, // set new entry to passwordHistory
    },
    { new: true },
  );
  return result;
};

export const AuthServices = { createUserIntoDb, loginUser, changePassword };
