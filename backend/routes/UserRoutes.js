const express = require("express");
const multer = require("multer");
const path = require("path");
const { fileURLToPath } = require("url");
const { dirname } = require("path");
const { db } = require("../config/db");
const {
  AdminRegister,
  adminLoginUser,
  getUserViaId,
  manageUsers,
  sendOtpAdmin,
  updateAdminPassword,
  updatePassword,
  updateProfilePicture,
  updateUsers,
  verifyOtp,
  deleteUser,
} = require("../controllers/authController.js");
const {
  addToWishlist,
  addtocartBack,
  getCartItems,
  getWishlistItems,
  LeaderBoardData,
  addChapterData,
  addCourseVideos,
  getChapterViaId,
  getVideoViaVideoID,
  updateCourseVideoDetails,
  getChapterDataViaChid,
  updateChapterDataViaChid,
  deleteChapterDataViaChid,
  deleteVideoViaVid,
} = require("../controllers/ItemController.js");
const authenticate = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/usersList", authenticate, manageUsers);
router.put("/users/:id", updateUsers);
router.get("/getUserViaId/:id", authenticate, getUserViaId);
router.post("/addToWishlist/:userId/:productId", authenticate, addToWishlist);
router.get("/getWishlistItems/:userId", authenticate, getWishlistItems);
router.post("/addtocart/:userId/:productId", authenticate, addtocartBack);
router.get("/getCartItems/:userId", authenticate, getCartItems);
router.post("/AdminRegister", AdminRegister);
router.post("/adminLoginUser", adminLoginUser);
// router.post("/sendOtpAdmin", sendOtpAdmin);
router.post("/verifyOtp", verifyOtp);
router.put("/updateAdminPassword", updateAdminPassword);
router.delete("/deleteUser/:userId", authenticate, deleteUser);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "profilePicture/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.put(
  "/update-profile-picture/:userId",
  upload.single("profilePicture"),
  authenticate,
  updateProfilePicture
);
router.get("/LeaderBoardData", authenticate, LeaderBoardData);

// question paper sheet multer
const queStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "questionSheet/");
  },
  filename: function (req, file, cb) {
    const fileName =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const queUpload = multer({ storage: queStorage });

router.post(
  "/addChapterData/:cid",
  queUpload.single("questionSheet"),
  authenticate,
  addChapterData
);

const Videostorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "videoCourse/"); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    const fileName =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const Videoupload = multer({ storage: Videostorage });

router.post(
  "/courses/:courseId/videos",
  Videoupload.single("videoFile"),
  authenticate,
  addCourseVideos
);

router.get("/getChapterViaId/:cid", authenticate, getChapterViaId);
router.get("/getVideoViaVideoID/:vid", authenticate, getVideoViaVideoID);
router.put(
  "/updateCourseVideoDetails/:vid",
  Videoupload.single("videoFile"),
  authenticate,
  updateCourseVideoDetails
);

router.get("/getChapterDataViaChid/:chid", authenticate, getChapterDataViaChid);
router.put(
  "/updateChapterDataViaChid/:cid/:chid",
  queUpload.single("questionSheet"),
  authenticate,
  updateChapterDataViaChid
);

router.delete(
  "/deleteChapterDataViaChid/:chid",
  authenticate,
  deleteChapterDataViaChid
);
router.delete("/deleteVideoViaVid/:vid", authenticate, deleteVideoViaVid);

module.exports = router;
