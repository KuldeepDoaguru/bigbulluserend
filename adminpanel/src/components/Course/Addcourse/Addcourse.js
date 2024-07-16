import React, { useState } from "react";
import axios from "axios";
// import "./Addcourse.css";
import Navbar from "../../Navbar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import cogoToast from "cogo-toast";

const Addcourse = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const [course_name, setcoursename] = useState("");
  const [course_image, setcourseimg] = useState("");
  const [course_description, setcoursedescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [course_price, setcourseprice] = useState("");
  const navigate = useNavigate();

  const handleEmpProfilePicture = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);

    if (selectedFile) {
      const allowedSizes = [
        { width: 5195, height: 3463 },
        { width: 1920, height: 1280 },
        { width: 1280, height: 853 },
        { width: 640, height: 427 },
      ];

      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result;

        // Show the image preview before validation
        setcourseimg({
          file: selectedFile,
          imageUrl: reader.result,
        });

        image.onload = () => {
          const isValidSize = allowedSizes.some(
            (size) => size.width === image.width && size.height === image.height
          );

          if (!isValidSize) {
            alert(
              `Invalid image size (${image.width}x${image.height}). Allowed sizes are: 5195×3463, 1920×1280, 1280×853, 640×427.`
            );
            // Reset the file input
            e.target.value = "";
            // Clear the image preview
            setcourseimg({
              file: null,
              imageUrl: null,
            });
          }
        };
      };
    }
  };

  const formdata = new FormData();
  formdata.append("name", course_name);
  formdata.append("thumbnails", course_image.file);
  formdata.append("description", course_description);
  formdata.append("price", course_price);
  formdata.append("category", category);

  const PostData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://admin.bigbulls.co.in/api/v1/auth/add-course",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response.data);
      setLoading(false);
      cogoToast.success("course added successfully");
      navigate("/managecourses");
    } catch (error) {
      console.log(error);
      setLoading(false);
      cogoToast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Container>
        <div className="Addcourse-outer paddingtop">
          <div className="head-main"> Add New Course </div>
          <div className="new-form">
            <form onSubmit={PostData} encType="multipart/form-data">
              <div className="mb-3">
                <label htmlFor="" class="form-label text-start fw-bold">
                  Course Name
                </label>
                <input
                  onChange={(e) => {
                    setcoursename(e.target.value);
                  }}
                  name="name"
                  value={course_name}
                  required
                  class="form-control"
                  placeholder="Enter Course Title"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="" class="form-label text-start fw-bold">
                  Category
                </label>
                <input
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  name="category"
                  required
                  class="form-control"
                  value={category}
                  placeholder="Enter Course Category Name"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="" class="form-label text-start fw-bold">
                  Course Price
                </label>
                <input
                  onChange={(e) => {
                    const price = parseInt(e.target.value);
                    if (price !== 0) {
                      setcourseprice(price);
                    } else {
                      alert("Course price cannot be 0");
                    }
                  }}
                  placeholder="Enter Course Price in Rupees"
                  type="number"
                  required
                  name="price"
                  class="form-control"
                  value={course_price}
                />
              </div>

              {/* <input onChange={(e) => { setcourseoffer(e.target.value) }} placeholder='Enter Offer Price in Rupees' type='number' /> */}

              <div className="mb-3">
                <label htmlFor="" class="form-label fw-bold">
                  Course Image
                </label>

                <input
                  type="file"
                  filename="thumbnails"
                  onChange={handleEmpProfilePicture}
                  placeholder="Upload Course Thumbnail"
                  accept="image/jpeg,image/jpg,image/png"
                  class="form-control"
                  required
                />
                <div id="emailHelp" class="form-text text-danger">
                  Allowed sizes are: 5195×3463, 1920×1280, 1280×853, 640×427.
                </div>
              </div>

              <div className="mb-3 w-100">
                <label htmlFor="" class="form-label text-start fw-bold">
                  Course Description
                </label>
                <textarea
                  onChange={(e) => {
                    setcoursedescription(e.target.value);
                  }}
                  rows={3}
                  placeholder="Course Description"
                  name="description"
                  required
                  class="form-control"
                  value={course_description}
                ></textarea>
              </div>

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
        <ToastContainer />
      </Container>
    </>
  );
};

export default Addcourse;
const Container = styled.div`
  .Addcourse-outer {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    height: 100vh;
    form {
      /* background-color: aqua; */
      box-shadow: 0px 0px 10px gainsboro;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
      margin: 10px;
      border-radius: 10px;
      input {
        width: 500px;
        padding: 10px;
        /* margin: 10px 0px; */
        border: 1px solid #583b04;
        border-radius: 10px;
        @media screen and (max-width: 600px) {
          width: 100%;
        }
      }
      textarea {
        width: 100%;
        max-height: 100px;
        margin: 0px;
        padding: 10px;
        margin: 10px 0px;
        border: 1px solid #583b04;
        border-radius: 10px;
        @media screen and (max-width: 600px) {
          width: 100%;
        }
      }
      button {
        background-color: white;
        color: #583b04;
        font-weight: 700;
        padding: 10px 15px;
        border-radius: 10px;
        margin-top: 10px;
        border: 1px solid #583b04;
      }
    }
  }

  .new-form {
    /* background-color: aqua; */
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .Addcourse-outer form button:hover {
    background-color: #583b04;
    color: white;
    cursor: pointer;
  }

  .paddingtop {
    padding-top: 7rem;
    @media screen and (max-width: 600px) {
      padding-top: 10rem;
    }
  }
`;
