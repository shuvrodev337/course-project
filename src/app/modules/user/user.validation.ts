import z from 'zod';

const updateUserValidationSchema = z.object({
  body: z.object({
    user: z
      .object({
        username: z
          .string({
            invalid_type_error: 'UserName must be a string',
          })
          .max(20, {
            message: 'UserName cannot be more than 20 characters long',
          })
          .optional(),
        email: z
          .string({
            invalid_type_error: 'Email must be a string',
          })
          .email({ message: 'Invalid email format' })
          .optional(),
      })
      .strict(), // ensures no extra fields such as password can not  be included
  }),
});

export const UserValidation = {
  updateUserValidationSchema,
};
/**
       .min(8, { message: 'Password must be at least 8 characters long' })
        .max(20, { message: 'Password cannot be more than 20 characters long' })
        .regex(/[a-z]/, {
          message: 'Password must contain at least one lowercase letter',
        })
        .regex(/[A-Z]/, {
          message: 'Password must contain at least one uppercase letter',
        })
        .regex(/\d/, { message: 'Password must contain at least one number' })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
          message:
            'Password must contain at least one special character (!@#$%^&*)',
        })
 */
