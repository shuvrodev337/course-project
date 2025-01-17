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
  // .sort({ 'passwordHistory.changedAt': -1 });
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
  const oldPasswordHistoryEntry = {
    oldPassword: hashedNewPassword,
    changedAt: new Date(),
  };

  const result = await User.findByIdAndUpdate(
    user._id,
    {
      password: hashedNewPassword, // set user password
      $addToSet: { passwordHistory: oldPasswordHistoryEntry }, // add new entry to passwordHistory
    },
    { new: true },
  );
  return result;
};

const changePassword2 = async (
  userData: JwtPayload,
  passwordData: TChangePassword,
) => {
  const { oldPassword, newPassword } = passwordData;

  // Retrieve the user along with the password and passwordHistory fields
  const user = await User.findById(userData._id)
    .select('+password')
    .select('+passwordHistory');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // Check if the old password matches the current password
  const isOldPasswordMatched = await User.isPasswordMatched(
    oldPassword,
    user.password,
  );
  if (!isOldPasswordMatched) {
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

  // Check if the new password matches any of the last 2 passwords
  const recentPasswordHistory = user.passwordHistory.slice(-2); // Get the last 2 entries
  for (const { oldPassword } of recentPasswordHistory) {
    const isPasswordMatched = await User.isPasswordMatched(
      newPassword,
      oldPassword,
    );
    if (isPasswordMatched) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'New password cannot be the same as any of the last 2 passwords!',
      );
    }
  }

  // Hash the new password
  const hashedNewPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // Create a new entry for passwordHistory
  const newPasswordHistoryEntry = {
    oldPassword: hashedNewPassword, // Store the current password before updating
    changedAt: new Date(),
  };

  // Update the user password and manage password history
  user.password = hashedNewPassword; // Update the current password
  user.passwordHistory.push(newPasswordHistoryEntry); // Add the current password to history

  // Limit password history to the last 2 entries
  if (user.passwordHistory.length > 2) {
    user.passwordHistory.shift(); // Remove the oldest entry
  }

  // Save the user document
  await user.save();

  return {
    message: 'Password updated successfully!',
  };
};

export const AuthServices = { createUserIntoDb, loginUser, changePassword };
