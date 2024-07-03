import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Navbar";
import ManageNav from "./ManageNav";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Addvideo.css";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Addvideo = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const { cid } = useParams();
  const navigate = useNavigate();
  const [video_Duration, setvideoDuration] = useState("");
  const [video_title, setvideotitle] = useState("");
  const [chapterID, setChapterID] = useState("");
  const [video_description, setvideodescription] = useState("");
  const [course_video, setcoursevideo] = useState(null);
  const [chapterList, setChapterList] = useState([]);
  const addVideoCourse = async (e) => {
    e.preventDefault();

    const addvideoformdata = new FormData();
    addvideoformdata.append("duration", video_Duration);
    addvideoformdata.append("title", video_title);
    addvideoformdata.append("videoFile", course_video);
    addvideoformdata.append("description", video_description);
    addvideoformdata.append("chapterID", chapterID);

    try {
      const response = await axios.post(
        `http://localhost:6060/api/v1/auth/courses/${cid}/videos`,
        addvideoformdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log(response);
      toast.success("Video added successfully");
      navigate(`/showvideos/${cid}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add video");
    }
  };

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
            editcourse={false}
            addvideo={true}
            showvideos={false}
            courseid={cid}
          />
          <div className="head-main"> Add New Video </div>
          <form onSubmit={addVideoCourse} encType="multipart/form-data">
            <div className="form-inner">
              <div>
                <label>Video Title</label>
                <input
                  name="title"
                  onChange={(e) => {
                    setvideotitle(e.target.value);
                  }}
                  placeholder="Enter Video Title"
                  required
                />
              </div>

              <div>
                <label>Video duration</label>
                <input
                  name="duration"
                  onChange={(e) => {
                    setvideoDuration(e.target.value);
                  }}
                  placeholder="Enter Video Duration"
                  required
                />
              </div>
            </div>

            <div className="form-inner">
              <div>
                <label>Chapter ID</label>
                <select
                  name="chapterID"
                  required
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
                  name="videoFile"
                  disabled={!chapterID ? true : false}
                  required
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
                required
                onChange={(e) => {
                  setvideodescription(e.target.value);
                }}
                placeholder="Enter Video Description"
              />
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
        <ToastContainer />
      </Container>
    </>
  );
};

export default Addvideo;
const Container = styled.div`
  textarea {
    border: 1px solid #e0e0e0;
  }
`;
