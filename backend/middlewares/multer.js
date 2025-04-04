import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  // Limit file size to 5MB
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadImage = upload.single("profilePic");

export default uploadImage;
