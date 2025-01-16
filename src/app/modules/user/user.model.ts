/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
const passwordHistorySchema = new Schema(
  {
    oldPassword: {
      type: String,
      required: true,
    },
  },
  { _id: false, timestamps: true }, // No need for a unique identifier for each subdocument
);
const userSchema = new Schema<TUser, UserModel>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Ensure the password is not selected by default in queries
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    passwordHistory: {
      type: [passwordHistorySchema],
      select: false, // Ensure the password is not selected by default in queries
    },
  },
  { timestamps: true },
);

// Mongoose Middleware: Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
  next();
});

// Transform JSON and Object responses to exclude the password field
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password; // Remove the password field
    delete ret.passwordHistory;
    return ret;
  },
});

userSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.password; // Remove the password field
    delete ret.passwordHistory;

    return ret;
  },
});

//Password related static methods

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isPasswordChangedAfterJWTissued = function (
  passwordChangedAt,
  jwtIssuedAt,
) {
  const passwordChangedTime = new Date(passwordChangedAt).getTime() / 1000;

  return passwordChangedTime > jwtIssuedAt;
};

export const User = model<TUser, UserModel>('User', userSchema);
