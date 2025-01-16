import { z } from 'zod';

const registerUserValidationSchema = z.object({
  body: z.object({
    user: z
      .object({
        username: z
          .string({
            invalid_type_error: 'UserName must be a string',
          })
          .max(20, {
            message: 'UserName cannot be more than 20 characters long',
          }),
        password: z.string({
          invalid_type_error: 'Password must be a string',
        }),
        email: z
          .string({
            invalid_type_error: 'Email must be a string',
          })
          .email({ message: 'Invalid email format' }),
      })
      .strict(),
  }),
});

const loginUserValidationSchema = z.object({
  body: z
    .object({
      username: z.string({ required_error: 'Id is requireed' }),
      password: z.string({ required_error: 'Password is requireed' }),
    })
    .strict(),
});
export const AuthValidations = {
  registerUserValidationSchema,
  loginUserValidationSchema,
};
