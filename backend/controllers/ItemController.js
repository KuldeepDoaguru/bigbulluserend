const fs = require("fs");
const { db } = require("../config/db");
const dotenv = require("dotenv");
const { log } = require("console");
const { loginController } = require("./authController");
dotenv.config();

const PORT = process.env.PORT;

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, price } = req.body;

    // Check if the user's cart exists; create it if not
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    // Add the item to the cart
    cart.items.push({
      product: productId,
      quantity,
      price,
    });

    await cart.save();

    res.status(201).json({ message: "Item added to the cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createCourse = async (req, res) => {
  try {
    // Extract course data from the request body
    const { name, description, price, category } = req.body;

    // Get the uploaded file (thumbnail)
    const thumbnails = req.file;
    console.log(thumbnails.filename, "40");

    if (!thumbnails) {
      return res.status(400).json({ error: "Thumbnail is required" });
    }
    const imageUrl = `http://localhost:6060/thumbnails/${thumbnails.filename}`;

    const values = [name, description, price, category, imageUrl];
    const insertQuery = `INSERT INTO courses (course_name, description, price, category, thumbnails) VALUES (?, ?, ?,?, ?)`;

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllCourses = async (req, res) => {
  try {
    db.query("SELECT * FROM courses", (err, result) => {
      if (err) {
        res.status(500).json({ error: "Failed to fetch data" });
      } else {
        res.status(200).json({ result });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const thumbnail = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);

    console.log("Course:", course);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    console.log("Thumbnails:", course.thumbnails);

    if (!course.thumbnails || course.thumbnails.length === 0) {
      return res.status(404).json({ error: "Course thumbnails not found" });
    }

    // Send the image data as the response
    res.send(course.thumbnails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const coursePage = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const getQuery = `SELECT * FROM courses WHERE course_id = ?`;
    db.query(getQuery, courseId, (err, result) => {
      if (err) {
        res.status(400).json({ error: "Invalid course ID" });
      }
      if (result.length === 0) {
        res.status(404).json({ error: "Failed to fetch Data" });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { name, description, price, category } = req.body;
    const thumbnails = req.file;

    const imageUrl = `http://localhost:6060/thumbnails/${thumbnails?.filename}`;
    const getQuery = `SELECT * FROM courses WHERE course_id = ?`;

    db.query(getQuery, courseId, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Invalid Course ID" });
      }

      if (result && result.length > 0) {
        const updateFields = [];
        const updateValues = [];

        if (name !== "undefined") {
          updateFields.push("course_name = ?");
          updateValues.push(name);
        }

        if (description !== "undefined") {
          updateFields.push("description = ?");
          updateValues.push(description);
        }

        if (price !== "undefined") {
          updateFields.push("price = ?");
          updateValues.push(price);
        }

        if (category !== "undefined") {
          updateFields.push("category = ?");
          updateValues.push(category);
        }

        if (thumbnails) {
          updateFields.push("thumbnails = ?");
          updateValues.push(imageUrl);
        }

        if (updateFields.length === 0) {
          return res.status(400).json({
            success: false,
            message: "No fields to update",
          });
        }

        const updateQuery = `UPDATE courses SET ${updateFields.join(
          ", "
        )} WHERE course_id = ?`;

        db.query(updateQuery, [...updateValues, courseId], (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Failed to update details",
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Details updated successfully",
            });
          }
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const getQuery = `SELECT * FROM courses WHERE course_id = ?`;
    db.query(getQuery, courseId, (err, result) => {
      if (err) {
        return res.status(400).json({ error: "Invalid course Id" });
      }

      if (result && result.length > 0) {
        const deleteQuery = `DELETE FROM courses WHERE course_id = ?`;
        db.query(deleteQuery, courseId, (err, result) => {
          if (err) {
            return res.status(400).json({ error: "Failed to delete course" });
          }

          res.status(200).json({ result });
        });
      } else {
        res.status(400).json({ error: "Course not found" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const videoListViaCourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const getQuery = `SELECT * FROM course_videos WHERE course_id = ?`;
    db.query(getQuery, courseId, (err, result) => {
      if (err) {
        res.status(500).json({ error: "Invalid course ID" });
      } else {
        res.status(200).json({ result });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Find the user's wishlist or create a new one if it doesn't exist
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        items: [productId],
      });
    } else {
      // Check if the product is already in the wishlist
      if (!wishlist.items.includes(productId)) {
        wishlist.items.push(productId);
      }
    }

    await wishlist.save();

    res
      .status(201)
      .json({ message: "Product added to the wishlist successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getWishlistItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ error: "Item not found in the wishlist" });
    }

    return res.status(200).json({ wishlist });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const addtocartBack = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Find the user's wishlist or create a new one if it doesn't exist
    let wishlist = await Cart.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Cart({
        user: userId,
        items: [productId],
      });
    } else {
      // Check if the product is already in the wishlist
      if (!wishlist.items.includes(productId)) {
        wishlist.items.push(productId);
      }
    }

    await wishlist.save();

    res.status(201).json({ message: "Product added to the cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const CartItem = await Cart.findOne({ user: userId });

    if (!CartItem) {
      return res.status(404).json({ error: "Item not found in the Cart" });
    }

    return res.status(200).json({ CartItem });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const LeaderBoardData = (req, res) => {
  try {
    const getQuery = `SELECT * FROM register
    JOIN bought_courses ON register.id = bought_courses.student_id`;
    db.query(getQuery, (err, result) => {
      if (err) {
        res.status(500).json({ error: "failed to fetch data" });
      } else {
        res.status(200).json({ result });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addChapterData = (req, res) => {
  try {
    const cid = req.params.cid;
    const chName = req.body.chName;
    const questionSheet = req.file;

    console.log(questionSheet.filename, "40");

    if (!questionSheet) {
      return res.status(400).json({ error: "Thumbnail is required" });
    }

    const questionUrl = `http://localhost:6060/questionSheet/${questionSheet.filename}`;
    console.log(questionUrl);

    const getQuery = `SELECT * FROM courses WHERE course_id = ?`;

    db.query(getQuery, cid, (err, result) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (result && result.length > 0) {
        const insertQuery = `INSERT INTO chapters (course_id, ch_name, question_sheet) VALUES (?, ?, ?)`;

        db.query(
          insertQuery,
          [cid, chName, questionUrl],
          (insertErr, insertResult) => {
            if (insertErr) {
              return res.status(400).json({ error: "Failed to add chapter" });
            }

            const fileID = insertResult.insertId;

            res.status(200).json({
              success: true,
              message: "Chapter added to the course successfully.",
              fileID: fileID,
              result: insertResult,
            });
          }
        );
      } else {
        res.status(404).json({ error: "Course not found" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addCourseVideos = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { title, chapterID, duration, description } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).json({ error: "Video file is required" });
    }

    const videoUrl = `http://localhost:${PORT}/videoCourse/${videoFile.filename}`;
    console.log(videoUrl);

    db.query(
      "INSERT INTO course_videos (course_id,	title, chapter_id, video_url,	duration,	description	) VALUES (?, ?, ?, ?, ?, ?)",
      [courseId, title, chapterID, videoUrl, duration, description],
      async (err, result) => {
        if (err) {
          res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }

        const videoID = result.insertId;

        res.status(200).json({
          success: true,
          message: "Video added to the course successfully.",
          videoId: videoID,
          result: result,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getChapterViaId = (req, res) => {
  try {
    const cid = req.params.cid;
    const getQuery = `SELECT * From chapters WHERE course_id = ?`;
    db.query(getQuery, cid, (err, result) => {
      if (err) {
        res.status(400).json({ error: "Invalid ID" });
      } else {
        res.status(200).json({ result });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getVideoViaVideoID = (req, res) => {
  try {
    const vid = req.params.vid;
    const getQuery = `SELECT * FROM course_videos WHERE coursevideo_id = ?`;
    db.query(getQuery, vid, (err, result) => {
      if (err) {
        res.status(500).json({ error: "Invalid course video id" });
      } else {
        res.status(200).json({ result });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateCourseVideoDetails = (req, res) => {
  try {
    const vid = req.params.vid;
    const { title, chapterID, duration, description } = req.body;
    const videoFile = req.file;

    // if (!videoFile) {
    //   return res.status(400).json({ error: "Video file is required" });
    // }

    const videoUrl = `${PORT}/videoCourse/${videoFile?.filename}`;
    console.log(videoUrl);

    const getQuery = `SELECT * FROM course_videos WHERE coursevideo_id = ?`;
    db.query(getQuery, vid, (err, result) => {
      if (err) {
        res.status(400).json({ error: "Invalid course ID" });
      }
      if (result && result.length > 0) {
        const updateFields = [];
        const updateValues = [];

        if (title) {
          updateFields.push("title = ?");
          updateValues.push(title);
        }

        if (description) {
          updateFields.push("description = ?");
          updateValues.push(description);
        }

        if (chapterID) {
          updateFields.push("chapter_id = ?");
          updateValues.push(chapterID);
        }

        if (duration) {
          updateFields.push("duration = ?");
          updateValues.push(duration);
        }
        if (videoFile) {
          updateFields.push("video_url = ?");
          updateValues.push(videoUrl);
        }
        console.log(updateFields, "532");
        if (updateFields.length === 0) {
          return res.status(400).json({
            success: false,
            message: "No fields to update",
          });
        }

        const updateQuery = `UPDATE course_videos SET ${updateFields.join(
          ", "
        )} WHERE coursevideo_id = ?`;

        db.query(updateQuery, [...updateValues, vid], (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Failed to update details",
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Details updated successfully",
            });
          }
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Course video not found",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getChapterDataViaChid = (req, res) => {
  try {
    const chid = req.params.chid;
    const getQuery = `SELECT * FROM chapters WHERE ch_id = ?`;
    db.query(getQuery, chid, (err, result) => {
      if (err) {
        res.status(400).json({ error: "Invalid chapter ID" });
      } else {
        res.status(200).json({ result });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateChapterDataViaChid = (req, res) => {
  try {
    const chid = req.params.chid;
    const cid = req.params.cid;
    const chName = req.body.chName;
    const questionSheet = req.file;

    console.log(questionSheet?.filename, "582");

    // if (!questionSheet) {
    //   return res.status(400).json({ error: "Thumbnail is required" });
    // }

    const questionUrl = `https://admin.bigbulls.co.in/questionSheet/${questionSheet?.filename}`;
    console.log(questionUrl);

    const getQuery = `SELECT * FROM chapters WHERE ch_id = ?`;
    db.query(getQuery, chid, (err, result) => {
      if (err) {
        res.status(400).json({ error: "Invalid chapter ID" });
      }
      if (result && result.length > 0) {
        const updateFields = [];
        const updateValues = [];

        if (chName) {
          updateFields.push("ch_name = ?");
          updateValues.push(chName);
        }

        if (questionSheet) {
          updateFields.push("question_sheet = ?");
          updateValues.push(questionUrl);
        }

        console.log(updateFields, "622");
        if (updateFields.length === 0) {
          return res.status(400).json({
            success: false,
            message: "No fields to update",
          });
        }

        const updateQuery = `UPDATE chapters SET ${updateFields.join(
          ", "
        )} WHERE ch_id = ? AND course_id = ?`;

        db.query(updateQuery, [...updateValues, chid, cid], (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Failed to update details",
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Details updated successfully",
            });
          }
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Course video not found",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteChapterDataViaChid = (req, res) => {
  try {
    const chid = req.params.chid;
    const getQuery = `SELECT * FROM chapters WHERE ch_id = ?`;
    db.query(getQuery, chid, (err, result) => {
      if (err) {
        res.status(400).json({ error: "Invalid chapter ID" });
      }
      if (result && result.length > 0) {
        const deleteQuery = `DELETE FROM chapters WHERE ch_id = ?`;
        db.query(deleteQuery, chid, (err, result) => {
          if (err) {
            return res.status(400).json({ error: "Failed to delete chapter" });
          }

          res.status(200).json({ result });
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteVideoViaVid = (req, res) => {
  try {
    const vid = req.params.vid;
    const getQuery = `SELECT * FROM course_videos WHERE coursevideo_id = ?`;
    db.query(getQuery, vid, (err, result) => {
      if (err) {
        res.status(400).json({ error: "Invalid Video ID" });
      }
      if (result && result.length > 0) {
        const deleteQuery = `DELETE FROM course_videos WHERE coursevideo_id = ?`;
        db.query(deleteQuery, vid, (err, result) => {
          if (err) {
            return res.status(400).json({ error: "Failed to delete chapter" });
          }

          res.status(200).json({ result });
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addToCart,
  createCourse,
  getAllCourses,
  thumbnail,
  coursePage,
  editCourse,
  deleteCourse,
  addCourseVideos,
  videoListViaCourseId,
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
};
