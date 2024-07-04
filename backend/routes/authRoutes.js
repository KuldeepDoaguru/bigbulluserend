const express = require("express");
const multer = require("multer");
const path = require("path");
const { fileURLToPath } = require("url");
const { dirname } = require("path");

const {
  loginController,
  profilePictureView,
  registerController,
  sendOtp,
  updatePassword,
  contactInquiry,
  getBoughtCourseDetails,
  sendOtpAdminRegistration,
  updateAdminDetails,
} = require("../controllers/authController.js");
const {
  addCourseVideos,
  addToCart,
  coursePage,
  createCourse,
  deleteCourse,
  editCourse,
  getAllCourses,
  thumbnail,
  videoListViaCourseId,
} = require("../controllers/ItemController.js");
const authenticate = require("../middlewares/authMiddleware.js");

// router object
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "thumbnails/");
  },
  filename: function (req, file, cb) {
    const fileName =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/add-course",
  upload.single("thumbnails"),
  authenticate,
  createCourse
);

// routing
// REGISTER || METHOD POST
router.post("/register", upload.single("profilePicture"), registerController);
// router.post("/login", loginController);
router.post("/sendOtp", sendOtp);
router.post("/updatePassword", updatePassword);
router.post("/add-to-cart", authenticate, addToCart);
router.get("/getAllCourses", authenticate, getAllCourses);
router.get("/thumbnail/:courseId", authenticate, thumbnail);
router.get("/coursePage/:courseId", authenticate, coursePage);
router.put(
  "/editCourse/:courseId",
  upload.single("thumbnails"),
  authenticate,
  editCourse
);
router.delete("/deleteCourse/:courseId", authenticate, deleteCourse);

const Videostorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "videoCourse/"); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});

const Videoupload = multer({ storage: Videostorage });

router.post(
  "/courses/:courseId/videos",
  Videoupload.single("videoFile"),
  authenticate,
  addCourseVideos
);

router.get(
  `/videoListViaCourseId/:courseId`,
  authenticate,
  videoListViaCourseId
);
router.get("/profilePictureView/:userId", authenticate, profilePictureView);
router.get("/contactInquiry", authenticate, contactInquiry);
router.get("/getBoughtCourseDetails", authenticate, getBoughtCourseDetails);
// router.post("/sendOtpAdminRegistration", sendOtpAdminRegistration);
router.put("/updateAdminDetails/:aid", updateAdminDetails);

module.exports = router;
