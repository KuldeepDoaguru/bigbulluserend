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
  const [loading, setLoading] = useState(false);
  const [chapterList, setChapterList] = useState([]);
  const [videoData, setVideoData] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getVideoViaID = async () => {
    try {
      const response = await axios.get(
        `https://admin.bigbulls.co.in/api/v1/auth/getVideoViaVideoID/${vid}`,
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
    setLoading(true);
    try {
      const response = await axios.put(
        `https://admin.bigbulls.co.in/api/v1/auth/updateCourseVideoDetails/${vid}`,
        addvideoformdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );
      console.log(response);
      setLoading(false);
      cogoToast.success("CourseVideoDetails updated successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  /************************** start of  delete course section ***************************************/
  const deleteVideoViaID = async () => {
    setLoading(true);
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
      setLoading(false);
      toast.success("Video delete successfully");
      navigate(`/showvideos/${cid}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
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

  useEffect(() => {
    chapterIDList();
  }, []);

  return (
    <>
      <Container>
        <div className="addvideo-outer paddingtop">
          <ManageNav
            editcourse={true}
            addvideo={false}
            showvideos={false}
            courseid={cid}
            addChapter={false}
          />
          <div className="head-main"> Edit Video </div>
          <form onSubmit={updateVideo} encType="multipart/form-data mt-3">
            <div className="row g-3 mt-3 p-3">
              <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                <video
                  src={videoData[0]?.video_url}
                  controls
                  width={"100%"}
                  controlsList="nodownload"
                />
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                <div className="row g-3">
                  <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div>
                      <label className="form-label fw-bold">Video Title</label>
                      <input
                        name="title"
                        className="form-control"
                        onChange={(e) => {
                          setvideotitle(e.target.value);
                        }}
                        placeholder={videoData[0]?.title}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div>
                      <label className="form-label fw-bold">
                        Video duration
                      </label>
                      <input
                        name="duration"
                        className="form-control"
                        onChange={(e) => {
                          setvideoDuration(e.target.value);
                        }}
                        placeholder={videoData[0]?.duration}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    {" "}
                    <div>
                      <label className="form-label fw-bold">Chapter ID</label>
                      <select
                        name="chapterID"
                        className="form-control"
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
                  </div>
                  <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div>
                      <label className="form-label fw-bold">
                        Video<span className="spantag"> (* mp4 or mkv)</span>
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        name="videoFile" // Corrected from filename
                        onChange={(e) => {
                          setcoursevideo(e.target.files[0]);
                        }}
                        placeholder="Upload Video"
                        accept="video/mp4, video/mkv"
                      />
                      <div className="progress mt-2">
                        <div
                          className="progress-bar progress-bar-striped bg-info"
                          role="progressbar"
                          style={{ width: `${uploadProgress}%` }}
                          aria-valuenow={uploadProgress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {uploadProgress}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="form-textarea">
                      <label className="form-label fw-bold">
                        Video Description
                      </label>
                      <textarea
                        name="video_description"
                        className="form-control"
                        onChange={(e) => {
                          setvideodescription(e.target.value);
                        }}
                        placeholder={videoData[0]?.description}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="d-flex justify-content-start w-100">
                      <button
                        type="submit"
                        className="btn btn-danger bg-dark"
                        disabled={loading}
                      >
                        {loading ? "Submit..." : "Submit"}
                      </button>
                      <button
                        className="btn btn-danger mx-2"
                        onClick={deleteVideoViaID}
                        disabled={loading}
                      >
                        {loading ? "Delete..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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

  .paddingtop {
    padding-top: 7rem;
    @media screen and (max-width: 600px) {
      padding-top: 10rem;
    }
  }
`;
