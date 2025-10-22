const { IS_DEV } = require("../common/utils/env");
const { BusinessException } = require("../common/utils/error");

function validateZod(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    if (IS_DEV) {
      const errors = result.error.issues.map(i => ({
        field: i.path.join('.'),
        message: i.message,
      }));
      console.log('Zod Error ->', errors);
    }
    throw new BusinessException('BAD_REQUEST');
  }
}

function validateQueryZod(schema) {
  return (req, res, next) => {
    req.query = validateZod(schema, req.query, next);
    next();
  };
}

function validateBodyZod(schema, data) {
  return (req, res, next) => {
    req.body = validateZod(schema, req.body, next);
    next();
  };
}

module.exports = {
  validateQueryZod,
  validateBodyZod,
}