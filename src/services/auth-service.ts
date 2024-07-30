import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import User, { IUser } from '../models/User';

export const registerUser = async (email: string, password: string) => {
  const user = new User({ email, password: bcrypt.hashSync(password, 10) });
  await user.save();
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    return { user, token };
  }
  throw new Error('Invalid email or password');
};
