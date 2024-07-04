import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../Navbar";
import ManageNav from "./ManageNav";
// import "./EditCourse.css";
import { useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import styled from "styled-components";

const EditCourse = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const { cid } = useParams();
  let navigate = useNavigate();
  console.log(cid);
  const [course_name, setcoursename] = useState("");
  const [course_image, setcourseimg] = useState(null);
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

  console.log(courseformdata);

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
      getCourseViaID();
      //   navigate("/managecourses");
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCourse = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to delete");
      if (confirm) {
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goBack = () => {
    window.history.go(-1);
  };

  useEffect(() => {
    setcoursename(data[0]?.course_name);
    setcourseimg(data[0]?.thumbnails);
    setcoursedescription(data[0]?.description);
    setcourseprice(data[0]?.price);
    setCourseCategory(data[0]?.category);
  }, [data]);

  console.log(data);

  return (
    <>
      <Container>
        <div className="editcourse-outer">
          <Navbar />
          <div className="mx-2">
            <div className="">
              <button className="btn btn-success backbtn" onClick={goBack}>
                <IoMdArrowRoundBack /> Back
              </button>
            </div>
          </div>
          <ManageNav
            editcourse={true}
            addvideo={false}
            showvideos={false}
            courseid={cid}
            addChapter={false}
          />
          <div className="head-main"> Update Course Data </div>
          <div className="container new-form">
            <form onSubmit={updateCourse} encType="multipart/form-data">
              <div className="form-inner">
                <div className="s1">
                  <div className="row">
                    <div className="col-xxl-8 col-xl-8 col-lg-6 col-md-6 col-sm-12 col-12">
                      <div className="d-flex flex-column">
                        <img src={course_image} width="200px" alt="profile" />
                      </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12">
                      <div className="s2">
                        <div>
                          <label className="text-start">Course Name</label>
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
                          <label className="text-start">Course Price</label>
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
                          <label className="text-start">Course Category</label>
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
                    <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                      <div className="bg-dark p-2 px-4 roundedupload">
                        <label className="text-light">
                          Update Course Thumbnail
                        </label>
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
                    <div className="hrline"></div>
                    <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="s4 mb-3">
                <button type="submit" className="btn btn-success">
                  Submit
                </button>
                {/* <button className="btn btn-danger" onClick={deleteCourse}>
                Delete this Course
              </button> */}
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={deleteCourse}
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </Container>
    </>
  );
};

export default EditCourse;
const Container = styled.div`
  .backbtn {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    justify-content: start;
    gap: 4px;
  }

  .new-form {
    form {
      border-radius: 20px;
    }
    .s1 {
      padding: 10px 10px;
      img {
        width: 500px;
        height: 281px;
      }
    }
    .s2 {
      display: flex;
      flex-direction: column;
      align-items: left;
      padding: 10px 0px;
      /* background-color: brown; */
      div {
        display: flex;
        /* width: 400px; */
        flex-direction: column;
        margin: 10px 0px;
      }
      label {
        font-weight: 700;
        padding-right: 20px;
      }
      input {
        border: 2px solid black;
        border-radius: 10px;
        font-size: 17px;
        padding: 10px;
      }
    }
    .hrline {
      width: 100%;
      height: 1px;
      background-color: rgb(209, 209, 209);
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .s3 {
      display: flex;
      flex-direction: column;
      margin: 10px 0px;
      align-items: center;
      label {
        font-weight: 500;
        font-size: 20px;
        padding-bottom: 5px;
        text-align: center;
      }
      textarea {
        border: 2px solid black;
        border-radius: 10px;
        font-size: 17px;
        width: 100%;
        min-height: 100px;
        max-height: 100px;
        padding: 10px;
      }
    }
    .s4 {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 10px 0px;
      button {
        background-color: black;
        color: white;
        font-size: 15px;
        padding: 5px 10px;
        border-radius: 10px;
        margin: 0px 10px;
        border: 2px solid white;
        &:hover {
          background-color: white;
          color: black;
          /* border: 2px solid black; */
          box-shadow: 0px 0px 10px rgb(209, 209, 209);
          cursor: pointer;
        }
      }
    }
  }

  label {
    color: gray;
    text-align: center;
    font-size: 16px;
    padding-right: 20px;
  }
  input {
    border-radius: 20px;
    border: none;
    font-size: 16px;
    color: gray;
  }

  .roundedupload {
    border-radius: 20px;
  }
`;
