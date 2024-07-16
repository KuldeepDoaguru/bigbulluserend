import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Navbar";
import ManageNav from "./ManageNav";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "./Addvideo.css";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import cogoToast from "cogo-toast";

const Addvideo = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const { cid } = useParams();
  const navigate = useNavigate();
  // const [video_Duration, setvideoDuration] = useState("");
  const [video_title, setvideotitle] = useState("");
  const [chapterID, setChapterID] = useState("");
  const [video_description, setvideodescription] = useState("");
  const [course_video, setcoursevideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [chapterList, setChapterList] = useState([]);
  const addVideoCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(course_video);

    const addvideoformdata = new FormData();
    // addvideoformdata.append("duration", video_Duration);
    addvideoformdata.append("title", video_title);
    addvideoformdata.append("videoFile", course_video);
    addvideoformdata.append("description", video_description);
    addvideoformdata.append("chapterID", chapterID);

    try {
      const response = await axios.post(
        `https://admin.bigbulls.co.in/api/v1/auth/courses/${cid}/videos`,
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
      cogoToast.success("Video added successfully");
      navigate(`/showvideos/${cid}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Failed to add video");
    }
  };

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

  const goBack = () => {
    window.history.go(-1);
  };

  return (
    <>
      <Container>
        <div className="addvideo-outer paddingtop">
          <div className="w-100">
            <div className="mx-2">
              <button className="btn btn-success backbtn" onClick={goBack}>
                <IoMdArrowRoundBack /> Back
              </button>
            </div>
          </div>
          <ManageNav
            editcourse={false}
            addvideo={true}
            showvideos={false}
            courseid={cid}
          />
          <div className="head-main"> Add New Video </div>
          <form
            className="mt-3"
            onSubmit={addVideoCourse}
            encType="multipart/form-data"
          >
            <div className="row">
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-1 col-sm-12 col-12"></div>
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-10 col-sm-12 col-12">
                <div className="inputMain shadow">
                  <div className="row g-3">
                    <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                      <div>
                        <label className="form-label">Video Title</label>
                        <input
                          name="title"
                          className="form-control"
                          onChange={(e) => {
                            setvideotitle(e.target.value);
                          }}
                          placeholder="Enter Video Title"
                          required
                        />
                      </div>
                    </div>
                    {/* <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                      <div>
                        <label className="form-label">Video duration</label>
                        <input
                          name="duration"
                          className="form-control"
                          onChange={(e) => {
                            setvideoDuration(e.target.value);
                          }}
                          placeholder="Enter Video Duration"
                          required
                        />
                      </div>
                    </div> */}
                    <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                      <div>
                        <label className="form-label">Chapter ID</label>
                        <select
                          name="chapterID"
                          required
                          className="form-control"
                          onChange={(e) => {
                            setChapterID(e.target.value);
                          }}
                        >
                          <option value="">Select an Option</option>
                          {chapterList?.map((item) => (
                            <option key={item.ch_id} value={item.ch_id}>
                              {item.ch_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                      <div>
                        <label className="form-label">
                          Video<span className="spantag"> (* mp4 or mkv)</span>
                        </label>
                        <input
                          type="file"
                          className="form-control"
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
                    <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                      <div className="form-textarea">
                        <label className="form-label">Video Description</label>
                        <textarea
                          name="video_description"
                          required
                          className="form-control"
                          onChange={(e) => {
                            setvideodescription(e.target.value);
                          }}
                          placeholder="Enter Video Description"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-1 col-sm-12 col-12"></div>
            </div>
            <div className="subbtn">
              <button type="submit" disabled={loading}>
                {loading ? "Submit..." : "Submit"}
              </button>
            </div>
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

  .backbtn {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    justify-content: start;
    gap: 4px;
  }

  .inputMain {
    padding: 2rem;
    border-radius: 15px;
  }

  .subbtn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem 0rem;
    button {
      background-color: black;
      color: white;
      font-weight: 600;
      padding: 5px 10px;
      font-size: 15px;
      border-radius: 5px;
      cursor: pointer;
    }
  }

  .paddingtop {
    padding-top: 7rem;
    @media screen and (max-width: 600px) {
      padding-top: 10rem;
    }
  }
`;
