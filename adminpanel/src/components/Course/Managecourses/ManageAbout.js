import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useParams } from "react-router-dom";
import ManageNav from "../Manage_Course_Video/ManageNav";
import styled from "styled-components";
import { useSelector } from "react-redux";
import axios from "axios";
import cogoToast from "cogo-toast";

const ManageAbout = () => {
  const { cid } = useParams();
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const [courseAbout, setCourseAbout] = useState([]);
  const [addAbout, setAddAbout] = useState("");
  const [aboutAddEdit, setAboutAddEdit] = useState("");

  console.log(addAbout);

  const getAboutData = async () => {
    try {
      const { data } = await axios.get(
        `https://admin.bigbulls.co.in/api/v1/auth/getCourseAbout/${cid}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setCourseAbout(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(courseAbout);
  const filterCourse = courseAbout[0]?.about?.split(",");
  console.log(filterCourse);

  useEffect(() => {
    getAboutData();
  }, []);

  const goBack = () => {
    window.history.go(-1);
  };

  const addOrUpdate = (value) => {
    setAboutAddEdit(value);
  };

  console.log(aboutAddEdit);

  useEffect(() => {
    setAddAbout(courseAbout[0]?.about);
  }, [courseAbout]);

  console.log(toString(addAbout));

  const updateAbout = async () => {
    try {
      const res = await axios.put(
        `https://admin.bigbulls.co.in/api/v1/auth/updateCourseAbout/${courseAbout[0]?.course_id}`,
        { about: String(addAbout) },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      cogoToast.success("Course about updated successfully");
      getAboutData();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Container>
        <div className="editcourse-outer paddingtop">
          <div className="mx-2">
            <div className="">
              <button className="btn btn-success backbtn" onClick={goBack}>
                <IoMdArrowRoundBack /> Back
              </button>
            </div>
          </div>
          <ManageNav
            editcourse={false}
            addvideo={false}
            showvideos={false}
            courseid={cid}
            addChapter={false}
            manageAbout={true}
            manageFaq={false}
            manageReview={false}
          />
          <div className="head-main"> Manage Course About </div>
          <div className="container new-form">
            <div className="row">
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                <div className="container-fluid">
                  <h2 className="fw-bold mt-5 fs-1">Course About</h2>
                  <p>{courseAbout[0]?.about}</p>
                  {/* <ul>
                    {filterCourse?.map((item) => (
                      <>
                        <li className="fw-bold">* {item}</li>
                      </>
                    ))}
                  </ul> */}
                  <div className="d-flex mt-4">
                    {courseAbout.length > 0 && (
                      <>
                        <button
                          className="btn btn-success shadow"
                          onClick={() => addOrUpdate("Edit")}
                        >
                          Edit
                        </button>
                      </>
                    )}

                    {courseAbout.length === 0 && (
                      <button
                        className="btn btn-info mx-2 shadow"
                        onClick={() => addOrUpdate("Add")}
                      >
                        Add About
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                {aboutAddEdit === "Edit" && (
                  <>
                    <h2 className="fw-bold mt-5 fs-1">Update About Details</h2>
                    <div class="form-floating mt-2">
                      <textarea
                        class="form-control"
                        placeholder="Leave a comment here"
                        id="floatingTextarea"
                        name="addAbout"
                        value={addAbout}
                        onChange={(e) => setAddAbout(e.target.value)}
                      ></textarea>
                      <label for="floatingTextarea">write about course</label>
                    </div>
                    <button
                      className="btn btn-info mt-3 shadow"
                      onClick={updateAbout}
                    >
                      Update About
                    </button>
                  </>
                )}
                {aboutAddEdit === "Add" && (
                  <>
                    <h2 className="fw-bold mt-5 fs-3">Add About Coourse</h2>
                    <div class="form-floating mt-2">
                      <textarea
                        class="form-control"
                        placeholder="Leave a comment here"
                        id="floatingTextarea"
                      ></textarea>
                      <label for="floatingTextarea">write about course</label>
                    </div>
                    <button className="btn btn-info mt-3 shadow">
                      Submit About
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ManageAbout;
const Container = styled.div`
  .backbtn {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    justify-content: start;
    gap: 4px;
  }

  .paddingtop {
    padding-top: 7rem;
    @media screen and (max-width: 600px) {
      padding-top: 10rem;
    }
  }
`;
