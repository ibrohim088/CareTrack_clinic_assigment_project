import multer from "multer";
import path from "path";

const makeStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, `uploads/${folder}`),
    filename: (req, file, cb) =>
      cb(null, `${folder}_${Date.now()}${path.extname(file.originalname)}`),
  });

const imageFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only image files allowed"));
};

const docFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "image/jpeg", "image/png"];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only PDF or image files allowed"));
};

// avatras max 2MB,
// documents max 10MB
export const uploadAvatar = multer({ storage: makeStorage("avatars"), fileFilter: imageFilter, limits: { fileSize: 2 * 1024 * 1024 } });
export const uploadDocument = multer({ storage: makeStorage("documents"), fileFilter: docFilter, limits: { fileSize: 10 * 1024 * 1024 } });
