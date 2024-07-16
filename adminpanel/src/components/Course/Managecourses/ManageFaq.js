import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useParams } from "react-router-dom";
import ManageNav from "../Manage_Course_Video/ManageNav";
import styled from "styled-components";

const ManageFaq = () => {
  const { cid } = useParams();

  const goBack = () => {
    window.history.go(-1);
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
            manageAbout={false}
            manageFaq={true}
            manageReview={false}
          />
          <div className="head-main"> Manage Course FAQ </div>
          <div className="container new-form">
            {/* <form onSubmit={updateCourse} encType="multipart/form-data">
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
                          onChange={handleEmpProfilePicture}
                          placeholder="Upload Course Thumbnail"
                          accept="image/jpeg, image/png, image/jpg"
                        />
                      </div>
                      <small className="text-danger">
                        Allowed sizes are: 5195×3463, 1920×1280, 1280×853,
                        640×427.
                      </small>
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
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? "Submit..." : "Submit"}
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={loading}
                  onClick={deleteCourse}
                >
                  {loading ? "Delete...." : "Delete"}
                </button>
              </div>
            </form> */}
          </div>
        </div>
      </Container>
    </>
  );
};

export default ManageFaq;
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
