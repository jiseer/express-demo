const { BusinessException } = require("../common/utils/error");

function validateZod(schema, data, next) {
  const result = schema.safeParse(data);
  if (result.success) {
    next();
  } else {
    // const errors = result.error.issues.map(i => ({
    //   field: i.path.join('.'),
    //   message: i.message,
    // }));
    next(new BusinessException('BAD_REQUEST'))
  }
}

function validateQueryZod(schema) {
  return (req, res, next) => {
    validateZod(schema, req.query, next);
  };
}

function validateBodyZod(schema, data) {
  return (req, res, next) => {
    validateZod(schema, req.body, next);
  };
}

module.exports = {
  validateQueryZod,
  validateBodyZod,
}