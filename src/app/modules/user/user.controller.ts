// 0 ? []  {}

import { Request, Response } from 'express';
import { UserServices } from './user.service';

const createUser = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const result = await UserServices.createUserIntoDb(user);
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'User created successfully',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

export const UserController = {
  createUser,
};
