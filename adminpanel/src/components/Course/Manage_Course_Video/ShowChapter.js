import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar";
import ManageNav from "./ManageNav";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import styled from "styled-components";

const ShowChapter = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const { cid } = useParams();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [chapterList, setChapterList] = useState([]);

  const chapterIDList = async () => {
    try {
      const response = await axios.get(
        `https://admin.bigbulls.co.in/api/v1/auth/getChapterViaId/${cid}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response.data.result);
      setChapterList(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(chapterList);

  const deleteChapter = async (chid) => {
    console.log(chid);
    try {
      const response = await axios.delete(
        `https://admin.bigbulls.co.in/api/v1/auth/deleteChapterDataViaChid/${chid}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response);
      cogoToast.success("chapter deleted successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    chapterIDList();
  }, []);

  const goBack = () => {
    window.history.go(-1);
  };

  const trimmedKeyword = keyword.trim().toLowerCase();
  console.log(trimmedKeyword);

  return (
    <>
      <Container>
        <div className="paddingtop">
          <div className="w-100">
            <div className="mx-2">
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
            showchapter={true}
          />
          <div className="head-main text-center"> Update Course Chapter </div>

          <div className="searchbar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              placeholder="Search Course Chapter"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value.toLowerCase())}
            />
          </div>
          <div class="container table-responsive">
            <table class="table table-bordered">
              <thead className="table-head">
                <tr>
                  <th className="sticky">Chapter ID</th>
                  <th className="sticky">Chapter Name</th>
                  <th className="sticky">Question Sheet Link</th>
                  <th className="sticky">Edit</th>
                  <th className="sticky">Delete</th>
                </tr>
              </thead>
              <tbody>
                {chapterList
                  .filter((val) => {
                    if (keyword === "") {
                      return true;
                    } else if (
                      val.ch_name.toLowerCase().includes(trimmedKeyword)
                    ) {
                      return val;
                    }
                  })
                  .map((video, index) => {
                    return (
                      <tr className="table-row" key={video.ch_id}>
                        <td>{video.ch_id}</td>
                        <td className="table-small">{video.ch_name}</td>
                        <td className="table-small">{video.question_sheet}</td>
                        <td className="table-email">
                          {" "}
                          <Link to={`/editchapter/${cid}/${video.ch_id}`}>
                            <button
                              style={{ width: "100%" }}
                              className="btn btn-success infobtn shadow"
                            >
                              Edit
                            </button>
                          </Link>
                        </td>
                        <td>
                          {" "}
                          <button
                            onClick={() => deleteChapter(video.ch_id)}
                            className="btn btn-danger bg-dark mx-2 shadow"
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
        <ToastContainer />
      </Container>
    </>
  );
};

export default ShowChapter;
const Container = styled.div`
  .backbtn {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    justify-content: start;
    gap: 4px;
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

  .paddingtop {
    padding-top: 7rem;
    @media screen and (max-width: 600px) {
      padding-top: 10rem;
    }
  }

  .table-responsive {
    max-height: 30rem;
  }
`;
