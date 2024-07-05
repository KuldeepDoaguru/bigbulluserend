import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Navbar";
import ManageNav from "./ManageNav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import styled from "styled-components";
import { FaExternalLinkAlt } from "react-icons/fa";

const ShowVideos = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const { cid } = useParams();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [keyword, setKeyword] = useState("");

  const displayCourseVideo = async () => {
    try {
      const response = await axios.get(
        `https://admin.bigbulls.co.in/api/v1/auth/videoListViaCourseId/${cid}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSelectedCourse(response.data.result);
      console.log(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    displayCourseVideo();
  }, [cid]);

  const deleteVideoViaID = async (vid) => {
    try {
      const response = await axios.delete(
        `https://admin.bigbulls.co.in/api/v1/auth/deleteVideoViaVid/${vid}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response);
      toast.success("Video delete successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  console.log(selectedCourse);

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
            showvideos={true}
            courseid={cid}
            addChapter={false}
          />
          <div className="head-main text-center"> Update Course Videos </div>

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
              placeholder="Search Course Video"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value.toLowerCase())}
            />
          </div>
          <div class="container table-responsive">
            <table class="table table-bordered">
              <thead className="table-head">
                <tr>
                  <th className="sticky">Video ID</th>
                  <th className="sticky">Video</th>
                  <th className="sticky">Video Title</th>
                  <th className="sticky">Description</th>
                  <th className="sticky">Chapter ID</th>
                  <th className="sticky">Edit</th>
                  <th className="sticky">Delete</th>
                </tr>
              </thead>
              <tbody>
                {selectedCourse
                  .filter((val) => {
                    if (keyword === "") {
                      return true;
                    } else if (
                      val.title.toLowerCase().includes(trimmedKeyword)
                    ) {
                      return val;
                    }
                  })
                  .map((video, index) => {
                    return (
                      <tr className="table-row" key={video.coursevideo_id}>
                        <td>{video.coursevideo_id}</td>
                        <td className="table-small">
                          <video controls width="150">
                            <source src={video.video_url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </td>
                        <td className="table-small">{video.title}</td>
                        <td className="table-email">{video.description}</td>
                        <td>{video.chapter_id}</td>
                        <td>
                          {" "}
                          <Link
                            to={`/editvideo/${cid}/${video.coursevideo_id}`}
                          >
                            <button
                              style={{ width: "100%" }}
                              className="btn btn-success infobtn shadow"
                            >
                              Edit
                            </button>
                          </Link>
                        </td>
                        <button
                          onClick={() => deleteVideoViaID(video.coursevideo_id)}
                          className="btn btn-danger bg-dark mt-2 mx-2 shadow"
                        >
                          Delete
                        </button>
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

export default ShowVideos;
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
