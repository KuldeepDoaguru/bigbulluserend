import React, { useState } from "react";
import axios from "axios";
import "./Addcourse.css";
import Navbar from "../../Navbar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
              placeholder="Enter Course Title"
            />

            <input
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              name="category"
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
            />

            <textarea
              onChange={(e) => {
                setcoursedescription(e.target.value);
              }}
              rows={3}
              placeholder="Course Description"
              name="description"
              value={course_description}
            ></textarea>
            <button onClick={PostData}>Submit</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Addcourse;
