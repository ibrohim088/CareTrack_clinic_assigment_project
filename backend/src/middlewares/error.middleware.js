const errorMiddleware = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Server error";
  res.status(status).json({ success: false, message });
};

export default errorMiddleware;
