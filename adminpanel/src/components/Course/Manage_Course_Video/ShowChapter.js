import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar";
import ManageNav from "./ManageNav";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

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
        `http://localhost:6060/api/v1/auth/getChapterViaId/${cid}`,
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
        `http://localhost:6060/api/v1/auth/deleteChapterDataViaChid/${chid}`,
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

  return (
    <>
      <div className="recentpurchases-outer">
        <Navbar />
        <ManageNav
          editcourse={false}
          addvideo={false}
          showvideos={false}
          courseid={cid}
          addChapter={false}
          showchapter={true}
        />
        <div className="head-main"> Update Course Chapter </div>

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
            <p style={{ width: "5%" }} className="text-center">
              Chapter ID
            </p>
            <p style={{ width: "25%" }} className="text-center">
              Chapter Name
            </p>
            <p style={{ width: "40%" }} className="text-center">
              Question Sheet Link
            </p>
            <p style={{ width: "15%" }} className="text-center">
              Edit
            </p>
            <p style={{ width: "15%" }} className="text-center">
              Delete
            </p>
          </div>
          <div className="table-body">
            {chapterList
              .filter((val) => {
                if (keyword === "") {
                  return true;
                } else if (
                  val.ch_name.toLowerCase().includes(keyword) ||
                  val.ch_name.toLowerCase().includes(keyword)
                ) {
                  return val;
                }
              })
              .map((video, index) => (
                <div className="table-row" key={video.ch_id}>
                  <p style={{ width: "5%" }}>{video.ch_id}</p>

                  <p style={{ width: "25%" }}>{video.ch_name}</p>
                  <p style={{ width: "40%" }}>{video.question_sheet}</p>
                  {/* <p style={{ width: "15%" }}>{video.chapter_id}</p> */}
                  <Link to={`/editchapter/${cid}/${video.ch_id}`}>
                    <button style={{ width: "100%" }}>Edit</button>
                  </Link>
                  <button
                    onClick={() => deleteChapter(video.ch_id)}
                    style={{ width: "15%" }}
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

export default ShowChapter;
