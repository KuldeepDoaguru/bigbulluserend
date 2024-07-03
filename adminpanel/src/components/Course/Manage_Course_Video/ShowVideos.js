import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Navbar";
import ManageNav from "./ManageNav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

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
        `http://localhost:6060/api/v1/auth/videoListViaCourseId/${cid}`,
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
        `http://localhost:6060/api/v1/auth/deleteVideoViaVid/${vid}`,
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

  return (
    <>
      <div className="recentpurchases-outer">
        <Navbar />
        <ManageNav
          editcourse={false}
          addvideo={false}
          showvideos={true}
          courseid={cid}
          addChapter={false}
        />
        <div className="head-main"> Update Course Videos </div>

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

        <div className="table">
          <div className="table-head">
            <p style={{ width: "5%" }}>Sno.</p>
            <p style={{ width: "20%" }}>Video</p>
            <p style={{ width: "20%" }}>Video Title</p>
            <p style={{ width: "25%" }}>Description</p>
            <p style={{ width: "15%" }}>Chapter ID</p>
            <p style={{ width: "15%" }}>Edit</p>
            <p style={{ width: "15%" }}>Delete</p>
          </div>
          <div className="table-body">
            {selectedCourse
              .filter((val) => {
                if (keyword === "") {
                  return true;
                } else if (
                  val.title.toLowerCase().includes(keyword) ||
                  val.title.toLowerCase().includes(keyword)
                ) {
                  return val;
                }
              })
              .map((video, index) => (
                <div className="table-row" key={video.coursevideo_id}>
                  <p style={{ width: "5%" }}>{index + 1}</p>
                  <video controls width="150">
                    <source src={video.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <p style={{ width: "20%" }}>{video.title}</p>
                  <p style={{ width: "25%" }}>{video.description}</p>
                  <p style={{ width: "15%" }}>{video.chapter_id}</p>
                  <Link to={`/editvideo/${cid}/${video.coursevideo_id}`}>
                    <button style={{ width: "100%" }}>Edit</button>
                  </Link>
                  <button
                    style={{ width: "15%" }}
                    onClick={() => deleteVideoViaID(video.coursevideo_id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ShowVideos;
