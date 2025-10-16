const { z } = require('zod')

const createUserSchema = z.object({
  username: z.string().min(2).max(16).regex(/^\w+$/),
  password: z.string().min(6).max(20).optional(),
});

module.exports = {
  createUserSchema,
}