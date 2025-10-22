const { z } = require('zod')

const isValidDate = (val) => !isNaN(new Date(val).getTime());
const transformDate = (val) => new Date(val);

// common 通用
exports.deleteOneSchema = z.object({
  id: z.number(),
});

// user
exports.createUserSchema = z.object({
  username: z.string().min(2).max(16),
  password: z.string().min(6).max(20),
});

// category
exports.createCategorySchema = z.object({
  name: z.string().min(2).max(10),
  type: z.number().refine((val) => [1, 2, 3].includes(val)),
});

exports.deleteCategorySchema = z.object({
  id: z.number(),
});

// transaction
exports.createTransactionSchema = z.object({
  amount: z.number(),
  desc: z.string(),
  date: z.string().nonempty().refine(isValidDate).transform(transformDate),
  category_id: z.number(),
  type: z.number().refine((val) => [1, 2, 3].includes(val)),
});

exports.listTransactionSchema = z.union([
  z.undefined(),
  z.object({
    order: z.enum(['asc', 'desc']).optional(),
    date: z.string().nonempty().refine(isValidDate).transform(transformDate).optional(),
  }),
])

