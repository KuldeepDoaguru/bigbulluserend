import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ManageNav from "../Manage_Course_Video/ManageNav";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import cogoToast from "cogo-toast";

const ManageReview = () => {
  const { cid } = useParams();
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const [courseReview, setCourseReview] = useState([]);
  const [keyword, setKeyword] = useState("");

  const getReviews = async () => {
    try {
      const { data } = await axios.get(
        `https://test.bigbulls.co.in/api/v1/auth/getCourseReviews/${cid}`
      );
      setCourseReview(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  const goBack = () => {
    window.history.go(-1);
  };

  console.log(courseReview);

  const trimmedKeyword = keyword.trim().toLowerCase();
  console.log(trimmedKeyword);

  const deleteRev = async (id) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete");
      if (confirm) {
        const res = await axios.delete(
          `https://admin.bigbulls.co.in/api/v1/auth/deleteReview/${id}`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
      }
      cogoToast.success("review deleted successfully");
      getReviews();
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
            manageAbout={false}
            manageFaq={false}
            manageReview={true}
          />
          <div className="head-main"> Manage Course Review </div>
          <div className="container new-form">
            <div className="searchbar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                placeholder="Search by username"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value.toLowerCase())}
                type="text"
              />
              <button
                className="btn btn-info handlesearchbtn"
                // onClick={handleSearch}
              >
                Search
              </button>
            </div>
            <div class="table-responsive mt-3">
              <table class="table table-bordered">
                <thead className="table-head">
                  <tr>
                    <th className="sticky">User ID</th>
                    <th className="sticky">Username</th>
                    <th className="sticky">Stars</th>
                    <th className="sticky">Review</th>
                    <th className="sticky">Delete</th>
                    {/* <th className="sticky">Delete</th> */}
                  </tr>
                </thead>
                <tbody>
                  {courseReview
                    .filter((val) => {
                      if (keyword === "") {
                        return true;
                      } else if (
                        val.name.toLowerCase().includes(trimmedKeyword)
                      ) {
                        return val;
                      }
                    })
                    .map((item, i) => {
                      return (
                        <tr className="table-row" key={item.user_id}>
                          <td>{item.user_id}</td>
                          <td className="table-small">{item.name}</td>
                          <td className="table-small">{item.stars}</td>
                          <td className="table-small">{item.review_details}</td>
                          <td className="table-email">
                            <button
                              className="btn btn-danger infobtn"
                              onClick={() => deleteRev(item.review_id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ManageReview;
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

  .table-responsive {
    max-height: 30rem;
  }

  th {
    background-color: #583b04;
    color: white;
    position: sticky;
    white-space: nowrap;
  }

  td {
    white-space: nowrap;
  }

  .sticky {
    position: sticky;
    top: 0;
    background-color: #583b04;
    color: white;
    z-index: 1;
  }

  .infobtn {
    background-color: #583b04;
    color: white;
  }

  .inputsearch {
    width: 90%;
    margin-top: 1rem;
    border-radius: 15px;
    padding: 0.5rem 1rem;
    &:focus {
      border: 1px solid grey;
    }
  }
`;
