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

const EditCourseChapter = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const { cid, chid } = useParams();
  console.log(cid + "  Cid", chid + "  Vid");
  const navigate = useNavigate();
  const [chapterName, setChapterName] = useState("");
  const [questionSheet, setQuestionSheet] = useState("");
  const [chapterList, setChapterList] = useState([]);

  const formdata = new FormData();
  formdata.append("chName", chapterName);
  formdata.append("questionSheet", questionSheet);
  console.log(formdata);

  const updateChapter = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:6060/api/v1/auth/updateChapterDataViaChid/${cid}/${chid}`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response);
      navigate(`/showchapter/${cid}`);
    } catch (error) {
      console.log(error);
    }
  };

  /************************** start of  delete chapter section ***************************************/
  const deleteChapter = async () => {
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
      navigate(`/showchapter/${cid}`);
    } catch (error) {
      console.log(error);
    }
  };
  /************************** End of  delete chapter section ***************************************/

  const getChapterViaChid = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6060/api/v1/auth/getChapterDataViaChid/${chid}`,
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
    getChapterViaChid();
  }, []);

  return (
    <>
      <Container>
        <div className="addvideo-outer">
          <Navbar />
          <ManageNav
            editcourse={false}
            addvideo={false}
            showvideos={false}
            courseid={cid}
            addChapter={false}
          />
          <div className="head-main"> Edit Chapter </div>

          <form onSubmit={updateChapter} encType="multipart/form-data">
            <img src={chapterList[0]?.question_sheet} alt="question sheet" />
            <div className="form-inner">
              <div>
                <label>Chapter Name</label>
                <input
                  name="chName"
                  onChange={(e) => {
                    setChapterName(e.target.value);
                  }}
                  placeholder={chapterList[0]?.ch_name}
                />
              </div>

              <div>
                <label>Question Sheet</label>
                <input
                  type="file"
                  filename="questionSheet"
                  onChange={(e) => {
                    setQuestionSheet(e.target.files[0]);
                  }}
                  placeholder="Upload chapter question sheet"
                  accept="image/jpeg,image/jpg,image/png"
                />
              </div>
            </div>
            <div className="d-flex justify-content-evenly w-100">
              <button type="submit">Submit</button>
              <button className="btn btn-ouline-danger" onClick={deleteChapter}>
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

export default EditCourseChapter;
const Container = styled.div`
  textarea {
    border: 1px solid #e0e0e0;
  }
`;
