const { z } = require('zod')
const { dayjs } = require('../lib/days')

const isValidDate = (val) => !isNaN(new Date(val).getTime());

// common 通用
exports.deleteOneSchema = z.object({
  id: z.number(),
});

// user
const userSchema = exports.userSchema = {};
userSchema.create = z.object({
  username: z.string().min(2).max(16),
  password: z.string().min(6).max(20),
});

// category
const categorySchema = exports.categorySchema = {};
categorySchema.create = z.object({
  name: z.string().min(2).max(10),
  type: z.number().refine((val) => [1, 2, 3].includes(val)),
});

categorySchema.delete = z.object({
  id: z.number(),
});

// transaction
const transactionSchema = exports.transactionSchema = {};
transactionSchema.create = z.object({
  amount: z.string().refine((val) => !isNaN(val), '必须数字').regex(/^\d+(\.\d{1,2})?$/, '最多两位小数'),
  desc: z.string(),
  date: z.string().nonempty().refine(isValidDate),
  category_id: z.number(),
});

transactionSchema.details = z.object({
  year: z.number().min(1970),
  month: z.number().min(1).max(12),
  categoryIds: z.array(z.number()).optional()
})

