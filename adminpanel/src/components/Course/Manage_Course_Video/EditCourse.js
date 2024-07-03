import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../Navbar";
import ManageNav from "./ManageNav";
import "./EditCourse.css";
import { useSelector } from "react-redux";

const EditCourse = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const { cid } = useParams();
  let navigate = useNavigate();
  console.log(cid);
  const [course_name, setcoursename] = useState("");
  const [course_image, setcourseimg] = useState();
  const [course_description, setcoursedescription] = useState("");
  const [course_price, setcourseprice] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [data, setData] = useState([]);

  const getCourseViaID = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6060/api/v1/auth/coursePage/${cid}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setData(response.data);
      console.log(response.data);
      setcoursename(data.course_name);
      setcourseimg(data.thumbnails);
      setcoursedescription(data.description);
      setcourseprice(data.price);
      setCourseCategory(data.category);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(data[0].thumbnails);

  useEffect(() => {
    getCourseViaID();
  }, []);

  const courseformdata = new FormData();
  courseformdata.append("name", course_name);
  courseformdata.append("description", course_description);
  courseformdata.append("price", course_price);
  courseformdata.append("category", courseCategory);
  courseformdata.append("thumbnails", course_image);

  // const responseImage = async () => {
  //   console.log(cid);
  //   try {
  //     const res = await axios.get(
  //       `http://localhost:6060/api/v1/auth/coursePage/${cid}`
  //     );
  //     console.log(res.data);
  //     setcourseimg(res.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   responseImage();
  // }, []);

  //   update course details
  const updateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:6060/api/v1/auth/editCourse/${cid}`,
        courseformdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(res.data);
      toast.success(res.data.message);
      //   navigate("/managecourses");
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCourse = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:6060/api/v1/auth/deleteCourse/${cid}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(res);
      navigate("/managecourses");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="editcourse-outer">
        <Navbar />
        <ManageNav
          editcourse={true}
          addvideo={false}
          showvideos={false}
          courseid={cid}
          addChapter={false}
        />
        <div className="head-main"> Update Course Data </div>
        <div className="new-form">
          <form onSubmit={updateCourse} encType="multipart/form-data">
            <div className="form-inner">
              <div className="s1">
                <img src={data[0]?.thumbnails} width="200px" alt="profile" />
                <div>
                  <label>Update Course Thumbnail</label>
                  <input
                    type="file"
                    filename={course_image}
                    onChange={(e) => {
                      setcourseimg(e.target.files[0]);
                    }}
                    placeholder="Upload Course Thumbnail"
                    accept="image/jpeg, image/png, image/jpg"
                  />
                </div>
              </div>

              <div className="s2">
                <div>
                  <label>Course Name</label>
                  <input
                    onChange={(e) => {
                      setcoursename(e.target.value);
                    }}
                    name="course_name"
                    value={course_name}
                    placeholder={data[0]?.course_name}
                  />
                </div>

                <div>
                  <label>Course Price</label>
                  <input
                    onChange={(e) => {
                      setcourseprice(e.target.value);
                    }}
                    value={course_price}
                    placeholder={data[0]?.price}
                    type="number"
                  />
                </div>
                <div>
                  <label>Course Category</label>
                  <input
                    onChange={(e) => {
                      setCourseCategory(e.target.value);
                    }}
                    value={courseCategory}
                    placeholder={data[0]?.price}
                    type="text"
                  />
                </div>
              </div>
            </div>
            <div className="hrline"></div>

            <div className="s3">
              <label>Change Course Description</label>
              <textarea
                onChange={(e) => {
                  setcoursedescription(e.target.value);
                }}
                value={course_description}
                name="course_description"
                rows={3}
                placeholder={data[0]?.description}
              ></textarea>
            </div>

            <div className="s4">
              <button type="submit" className="btn btn-success">
                Submit
              </button>
              {/* <button className="btn btn-danger" onClick={deleteCourse}>
                Delete this Course
              </button> */}
              <button
                type="button"
                className="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-body">
                <h2 className="text-center">
                  Do you really want to delete course ?
                </h2>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-warning"
                  data-bs-dismiss="modal"
                >
                  Back
                </button>
                <button
                  type="button"
                  class="btn btn-danger"
                  onClick={deleteCourse}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EditCourse;
