import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';

const UserSchema = new Schema<TUser>({
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
    select: 0,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

export const User = model<TUser>('User', UserSchema);
