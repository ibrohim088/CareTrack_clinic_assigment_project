const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error)
    return res.status(422).json({
      success: false,
      message: error.details.map((d) => d.message),
    });
  next();
};

export default validate;
