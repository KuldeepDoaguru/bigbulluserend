const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const JWT = require("jsonwebtoken");
const { db } = require("../config/db");

dotenv.config();

const PORT = process.env.PORT;

const registerController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validations
    const requiredFields = [email, password];
    if (requiredFields.some((field) => !field)) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Hash the "password" and "cpassword"
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // Check if the user already exists
    const checkUserQuery = "SELECT * FROM register WHERE email = ?";
    console.log("email", email);

    db.query(checkUserQuery, [email], (err, result) => {
      if (err) {
        console.error("Error checking if user exists in MySQL:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        // Check if there are any rows in the result
        if (result.length > 0) {
          return res.status(400).json({
            error: "User already exists.",
          });
        } else {
          // User not found, proceed with registration
          const insertUserQuery = `
            INSERT INTO register (
              name, email, phone, gender, password, cpassword, country, state, address, dob, profile_picture, refferel_code
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const insertUserParams = [
            name,
            email,
            phone,
            gender,
            hashedPassword,
            hashedCPassword,
            country,
            state,
            address,
            dob,
            imageUrl,
            refferelCode,
          ];

          db.query(
            insertUserQuery,
            insertUserParams,
            (insertErr, insertResult) => {
              if (insertErr) {
                console.error("Error inserting user:", insertErr);
                res.status(500).json({ error: "Internal server error" });
              } else {
                console.log("User registered successfully");
                return res.status(200).json({
                  success: true,
                  message: "User registered successfully",
                });
              }
            }
          );
        }
      }
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

// const loginController = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log(req.body);
//     //validation
//     if (!email || !password) {
//       return res.status(404).send({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     //check user
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "Email is not registered",
//       });
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(200).send({
//         success: false,
//         message: "Invalid Password",
//       });
//     }

//     //token
//     const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.status(200).send({
//       success: true,
//       message: "login successfully",
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//       },
//       token,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, message: "Error in login", error });
//   }
// };

const sendOtp = (req, res) => {
  const { email } = req.body;

  // random otp
  function generateOTP(length) {
    const chars = "0123456789";
    let otp = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      otp += chars[randomIndex];
    }

    return otp;
  }

  const OTP = generateOTP(6);

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAILSENDER,
        pass: process.env.EMAILPASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAILSENDER,
      to: email,
      subject: "Password OTP",
      text: `Your OTP is: ${OTP}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json("An error occurred while sending the email.");
      } else {
        console.log("OTP sent:", info.response);

        // Assuming you have a 'db' object for database operations
        const selectQuery = "SELECT * FROM otpcollections WHERE email = ?";
        db.query(selectQuery, email, (err, result) => {
          if (err) {
            res.status(400).json({ success: false, message: err.message });
          }
          if (result && result.length > 0) {
            const updateQuery =
              "UPDATE otpcollections SET code = ? WHERE email = ?";
            db.query(updateQuery, [OTP, email], (upErr, upResult) => {
              if (upErr) {
                res
                  .status(400)
                  .json({ success: false, message: upErr.message });
              }
              res.status(200).send(upResult);
            });
          } else {
            // Assuming you have a 'db' object for database operations
            db.query(
              "INSERT INTO otpcollections (email, code) VALUES (?, ?) ON DUPLICATE KEY UPDATE code = VALUES(code)",
              [email, OTP],
              (err, result) => {
                if (err) {
                  console.error(err);
                  return res
                    .status(500)
                    .send({ message: "Failed to store OTP" });
                }

                res.status(200).json({ message: "OTP sent successfully" });
              }
            );
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("An error occurred.");
  }
};

const updatePassword = async (req, res) => {
  try {
    const { email, password, cpassword, otp } = req.body;
    console.log(req.body);
    if (!email || !password || !cpassword || !otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid email, password, or OTP",
      });
    }

    // Fetch the user based on the provided email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // otpmatch
    const otpDocument = await otpModel.findOne({ email });
    if (!otpDocument || otpDocument.code !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash both the "password" and "cpassword"
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const hashedCPassword = await bcrypt.hash(cpassword, saltRounds);

    await userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      cpassword: hashedCPassword,
    });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

const manageUsers = async (req, res) => {
  try {
    db.query("SELECT * FROM register", (err, result) => {
      if (err) {
        res.status(500).json({ data: "Data not found" });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUsers = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, phone, gender, country, state, city, address, dob } =
      req.body;

    const getQuery = `SELECT * FROM register WHERE id = ?`;
    db.query(getQuery, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }

      if (result && result.length > 0) {
        const updateFields = [];
        const updateValues = [];

        if (name) {
          updateFields.push("name = ?");
          updateValues.push(name);
        }

        if (email) {
          updateFields.push("email = ?");
          updateValues.push(email);
        }

        if (phone) {
          updateFields.push("phone = ?");
          updateValues.push(phone);
        }

        if (gender) {
          updateFields.push("gender = ?");
          updateValues.push(gender);
        }

        if (country) {
          updateFields.push("country = ?");
          updateValues.push(country);
        }

        if (state) {
          updateFields.push("state = ?");
          updateValues.push(state);
        }

        if (city) {
          updateFields.push("city = ?");
          updateValues.push(city);
        }

        if (address) {
          updateFields.push("address = ?");
          updateValues.push(address);
        }

        if (dob) {
          updateFields.push("dob = ?");
          updateValues.push(dob);
        }

        const updateQuery = `UPDATE register SET ${updateFields.join(
          ", "
        )} WHERE id = ?`;

        db.query(updateQuery, [...updateValues, userId], (err, result) => {
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
          message: "User not found",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getUserViaId = async (req, res) => {
  try {
    const userId = req.params.id;
    const getQuery = `SELECT * FROM register WHERE id = ?`;
    db.query(getQuery, [userId], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Invalid user id" });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const AdminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.query(
      "SELECT * FROM admin_register WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ success: "false", message: "internal server error" });
        }
        if (result.length > 0) {
          return res.status(200).json({
            success: "false",
            message: "Admin already registered, Please login",
          });
        }

        const insertUserParams = [email, hashedPassword, "notactive"];
        db.query(
          "INSERT INTO admin_register (email, password, status) VALUES(?,?, ?)",
          insertUserParams,
          (err, result) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: false,
                message: "Error registering admin user",
              });
            }
            res.status(201).json({
              success: true,
              message: "Admin registered successfull",
              adminuser: {
                id: result.insertId,
                email,
                status: "notactive",
              },
            });
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const adminLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    db.query(
      `SELECT * FROM admin_register WHERE email = ?`,
      [email],
      async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Internal server error",
          });
        }
        if (result.length === 0) {
          return res.status(500).json({
            success: false,
            message:
              "Email is not registered please contact team for furthur assistance",
          });
        }

        const user = result[0];
        if (user.status !== "active") {
          return res.status(500).json({
            success: false,
            message:
              "Email is not activated please contact team for furthur assistance",
          });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(200).json({
            success: "false",
            message: "Invalid password",
          });
        }

        const token = await JWT.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "12h",
        });

        res.status(200).json({
          success: "true",
          message: "Login successful",
          user: {
            id: user.admin_id,
            email: user.email,
            token: token,
          },
        });
      }
    );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: "false", message: "Login failed", error: error });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    db.query(
      "SELECT * FROM otpcollections WHERE email = ? AND code = ?",
      [email, otp],
      async (err, result) => {
        console.log("result: ", result);
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Internal server error",
          });
        }
        if (result.length > 0) {
          return res.status(200).json({
            success: true,
            message: "OTP verification success",
          });
        } else {
          return res.status(404).json({
            success: false,
            message: "Invalid email or OTP",
          });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateAdminPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid email, password, or OTP",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.query(
      "SELECT * FROM admin_register WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }

        if (result.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "user not found" });
        }

        const user = result[0];

        db.query(
          "UPDATE admin_register SET password = ? WHERE email = ?",
          [hashedPassword, email],
          (err) => {
            if (err) {
              console.log(err);
              return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
            }

            res
              .status(200)
              .json({ success: true, message: "successfully updated" });
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.params.userId;
    const profilePicture = req.file.filename;

    if (!profilePicture) {
      return res
        .status(400)
        .json({ error: "Please provide a valid profile picture." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update the user's profilePicture field
    user.profilePicture = profilePicture;

    // Save the user with the updated profilePicture
    await user.save();
    return res
      .status(200)
      .json({ message: "Profile picture updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const profilePictureView = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userPicture = await userModel.findById(userId);

    console.log("user picture:", userPicture);

    if (!userPicture) {
      return res.status(404).json({ error: "userPicture not found" });
    }

    console.log("Thumbnails:", userPicture.profilePicture);

    if (
      !userPicture.profilePicture ||
      userPicture.profilePicture.length === 0
    ) {
      return res
        .status(404)
        .json({ error: "userPicture profilePicture not found" });
    }

    // Send the image data as the response
    res.send(userPicture.profilePicture);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    db.query(
      "SELECT * FROM register WHERE id = ?",
      [userId],
      async (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }
        console.log(result.length, "664");
        if (result.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "user not found" });
        }

        db.query(
          "DELETE FROM register WHERE id = ?",
          [userId],
          async (err, result) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: "Error while deleting course",
              });
            }

            res.status(200).json({
              success: true,
              message: "user deleted successfully",
            });
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const contactInquiry = (req, res) => {
  try {
    db.query(`SELECT * FROM inquiry_mail`, (err, result) => {
      if (err) {
        res.status(401).json({ error: "Failed to fetch data" });
      } else {
        res.status(200).json({ result });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBoughtCourseDetails = (req, res) => {
  try {
    db.query("SELECT * FROM bought_courses", (err, result) => {
      if (err) {
        res.status(404).json({ error: "failed to fetch data" });
      } else {
        res.status(200).json({ result });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAdminDetails = async (req, res) => {
  try {
    const adminId = req.params.aid;
    const { approved_by, status } = req.body;

    const getQuery = `SELECT * FROM admin_register WHERE admin_id = ?`;
    db.query(getQuery, [adminId], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }

      if (result && result.length > 0) {
        const updateFields = [];
        const updateValues = [];

        if (approved_by) {
          updateFields.push("approved_by = ?");
          updateValues.push(approved_by);
        }

        if (status) {
          updateFields.push("status = ?");
          updateValues.push(status);
        }

        const updateQuery = `UPDATE admin_register SET ${updateFields.join(
          ", "
        )} WHERE admin_id = ?`;

        db.query(updateQuery, [...updateValues, adminId], (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Failed to update details",
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Admin Approved successfully",
            });
          }
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "admin not found",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  registerController,
  // loginController,
  sendOtp,
  updatePassword,
  manageUsers,
  updateUsers,
  getUserViaId,
  AdminRegister,
  adminLoginUser,
  // sendOtpAdmin,
  verifyOtp,
  updateAdminPassword,
  updateProfilePicture,
  profilePictureView,
  deleteUser,
  contactInquiry,
  getBoughtCourseDetails,
  // sendOtpAdminRegistration,
  updateAdminDetails,
};
