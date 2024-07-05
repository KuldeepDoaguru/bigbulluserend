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
        `https://admin.bigbulls.co.in/api/v1/auth/updateChapterDataViaChid/${cid}/${chid}`,
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
      navigate(`/showchapter/${cid}`);
    } catch (error) {
      console.log(error);
    }
  };
  /************************** End of  delete chapter section ***************************************/

  const getChapterViaChid = async () => {
    try {
      const response = await axios.get(
        `https://admin.bigbulls.co.in/api/v1/auth/getChapterDataViaChid/${chid}`,
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
        <div className="addvideo-outer paddingtop">
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
                <label className="form-label fw-bold">Chapter Name</label>
                <input
                  name="chName"
                  className="form-control"
                  onChange={(e) => {
                    setChapterName(e.target.value);
                  }}
                  placeholder={chapterList[0]?.ch_name}
                />
              </div>

              <div>
                <label className="form-label fw-bold">Question Sheet</label>
                <input
                  type="file"
                  className="form-control"
                  filename="questionSheet"
                  onChange={(e) => {
                    setQuestionSheet(e.target.files[0]);
                  }}
                  placeholder="Upload chapter question sheet"
                  accept="image/jpeg,image/jpg,image/png"
                />
              </div>
            </div>
            <div className="d-flex justify-content-center w-100">
              <button type="submit" className="btn btn-danger successbtn">
                Submit
              </button>
              <button
                className="btn btn-ouline-danger mx-2"
                onClick={deleteChapter}
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

export default EditCourseChapter;
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

  form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-top: 2rem;
    align-items: center;
    gap: 1rem;
  }

  .form-inner {
    border: 2px solid grey;
    padding: 2rem;
    border-radius: 15px;
  }

  .successbtn {
    background: black;
    color: white;
    &:hover {
      background: wheat;
      color: black;
      border: none;
    }
  }
`;
