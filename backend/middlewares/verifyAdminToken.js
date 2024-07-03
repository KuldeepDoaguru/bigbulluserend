const jwt = require("jsonwebtoken");
const { db } = require("../config/db");
const dotenv = require("dotenv");
dotenv.config();

// const verifyAdminToken = async (token) => {
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Check if the user exists in the database
//         const query = 'SELECT * FROM super_admin WHERE sa_id = ?';
//         const params = [decoded.id];

//         return new Promise((resolve, reject) => {
//             db.query(query, params, (error, results) => {
//                 if (error) {
//                     console.error('Error executing query:', error);
//                     reject(error);
//                     return;
//                 }

//                 if (!results || results.length === 0) {
//                     console.error('User not found in the database');
//                     resolve(null);
//                     return;
//                 }

//                 const user = results[0];
//                 resolve(user);
//             });
//         });
//     } catch (error) {
//         console.error('Error verifying token:', error);
//         return null;
//     }
// };

const verifyAdminToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user exists in the database
    const query = "SELECT * FROM admin_register WHERE admin_id = ?";
    const params = [decoded.id];

    return new Promise((resolve, reject) => {
      db.query(query, params, (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          reject(error);
          return;
        }

        if (!results || results.length === 0) {
          console.error("User not found in the database");
          resolve(null);
          return;
        }

        const user = results[0];
        resolve(user);
      });
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    // Check if the error is due to token expiration
    if (error.name === "TokenExpiredError") {
      // Return a specific error message
      return { error: "TokenExpiredError" };
    }
    return null;
  }
};

module.exports = verifyAdminToken;
