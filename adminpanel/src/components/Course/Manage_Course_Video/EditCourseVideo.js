import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../../Navbar";
import ManageNav from "./ManageNav";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const EditCourseVideo = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const { cid, vid } = useParams();
  console.log(cid + "  Cid", vid + "  Vid");
  const navigate = useNavigate();
  const [video_Duration, setvideoDuration] = useState("");
  const [video_title, setvideotitle] = useState("");
  const [chapterID, setChapterID] = useState("");
  const [video_description, setvideodescription] = useState("");
  const [course_video, setcoursevideo] = useState();
  const [chapterList, setChapterList] = useState([]);
  const [videoData, setVideoData] = useState([]);

  const getVideoViaID = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6060/api/v1/auth/getVideoViaVideoID/${vid}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response.data.result);
      setVideoData(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const addvideoformdata = new FormData();
  addvideoformdata.append("duration", video_Duration);
  addvideoformdata.append("title", video_title);
  addvideoformdata.append("videoFile", course_video);
  addvideoformdata.append("description", video_description);
  addvideoformdata.append("chapterID", chapterID);

  const updateVideo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:6060/api/v1/auth/updateCourseVideoDetails/${vid}`,
        addvideoformdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response);
      cogoToast.success("CourseVideoDetails updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  /************************** start of  delete course section ***************************************/
  const deleteVideoViaID = async () => {
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
      navigate(`/showvideos/${cid}`);
    } catch (error) {
      console.log(error);
    }
  };
  /************************** End of  delete course section ***************************************/
  useEffect(() => {
    getVideoViaID();
  }, []);

  console.log(videoData[0]?.video_url);

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

  useEffect(() => {
    chapterIDList();
  }, []);

  return (
    <>
      <Container>
        <div className="addvideo-outer">
          <Navbar />
          <ManageNav
            editcourse={true}
            addvideo={false}
            showvideos={false}
            courseid={cid}
            addChapter={false}
          />
          <div className="head-main"> Edit Video </div>
          <form onSubmit={updateVideo} encType="multipart/form-data">
            <video
              src={videoData[0]?.video_url}
              controls
              width={"100%"}
              controlsList="nodownload"
            />
            <div className="form-inner">
              <div>
                <label>Video Title</label>
                <input
                  name="title"
                  onChange={(e) => {
                    setvideotitle(e.target.value);
                  }}
                  placeholder={videoData[0]?.title}
                />
              </div>

              <div>
                <label>Video duration</label>
                <input
                  name="duration"
                  onChange={(e) => {
                    setvideoDuration(e.target.value);
                  }}
                  placeholder={videoData[0]?.duration}
                />
              </div>
            </div>

            <div className="form-inner">
              <div>
                <label>Chapter ID</label>
                <select
                  name="chapterID"
                  onChange={(e) => {
                    setChapterID(e.target.value);
                  }}
                >
                  <option value="">Select an Option</option>
                  {chapterList?.map((item) => (
                    <option key={item.ch_id} value={item.ch_id}>
                      {item.ch_id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>
                  Video<span className="spantag"> (* mp4 or mkv)</span>
                </label>
                <input
                  type="file"
                  name="videoFile" // Corrected from filename
                  onChange={(e) => {
                    setcoursevideo(e.target.files[0]);
                  }}
                  placeholder="Upload Video"
                  accept="video/mp4, video/mkv"
                />
              </div>
            </div>

            <div className="form-textarea">
              <label>Video Description</label>
              <textarea
                name="video_description"
                onChange={(e) => {
                  setvideodescription(e.target.value);
                }}
                placeholder={videoData[0]?.description}
              />
            </div>

            <div className="d-flex justify-content-evenly w-100">
              <button type="submit">Submit</button>
              <button
                className="btn btn-ouline-danger"
                onClick={deleteVideoViaID}
              >
                Delete
              </button>
            </div>
          </form>
        </div>
        <ToastContainer />
      </Container>
    </>
  );
};

export default EditCourseVideo;
const Container = styled.div`
  textarea {
    border: 1px solid #e0e0e0;
  }
`;
