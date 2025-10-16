const { z } = require('zod')

const createCategorySchema = z.object({
  name: z.string().min(2).max(10),
});

const deleteCategorySchema = z.object({
  id: z.number(),
});

module.exports = {
  createCategorySchema,
  deleteCategorySchema,
}