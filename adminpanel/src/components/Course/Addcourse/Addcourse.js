import React, { useState } from "react";
import axios from "axios";
// import "./Addcourse.css";
import Navbar from "../../Navbar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Addcourse = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const [course_name, setcoursename] = useState("");
  const [course_image, setcourseimg] = useState("");
  const [course_description, setcoursedescription] = useState("");
  const [category, setCategory] = useState("");
  const [course_price, setcourseprice] = useState("");
  const navigate = useNavigate();

  const formdata = new FormData();
  formdata.append("name", course_name);
  formdata.append("thumbnails", course_image);
  formdata.append("description", course_description);
  formdata.append("price", course_price);
  formdata.append("category", category);

  const PostData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:6060/api/v1/auth/add-course",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response.data);
      navigate("/managecourses");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Container>
        <div className="Addcourse-outer">
          <Navbar />
          <div className="head-main"> Add New Course </div>
          <div className="new-form">
            <form onSubmit={PostData} encType="multipart/form-data">
              <input
                onChange={(e) => {
                  setcoursename(e.target.value);
                }}
                name="name"
                value={course_name}
                required
                placeholder="Enter Course Title"
              />

              <input
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                name="category"
                required
                value={category}
                placeholder="Enter Course Category Name"
              />
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
                value={course_price}
              />

              {/* <input onChange={(e) => { setcourseoffer(e.target.value) }} placeholder='Enter Offer Price in Rupees' type='number' /> */}

              <input
                type="file"
                filename="thumbnails"
                onChange={(e) => {
                  setcourseimg(e.target.files[0]);
                }}
                placeholder="Upload Course Thumbnail"
                accept="image/jpeg,image/jpg,image/png"
                required
              />

              <textarea
                onChange={(e) => {
                  setcoursedescription(e.target.value);
                }}
                rows={3}
                placeholder="Course Description"
                name="description"
                required
                value={course_description}
              ></textarea>
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
        margin: 10px 0px;
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
`;
