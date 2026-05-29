export const success = (res, data, message = "OK", code = 200) => res.status(code).json({ success: true, message, data });

export const error = (res, message = "Server error", code = 500) => res.status(code).json({ success: false, message });
