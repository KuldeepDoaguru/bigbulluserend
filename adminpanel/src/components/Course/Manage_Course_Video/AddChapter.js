import React, { useState } from "react";
import styled from "styled-components";
import ManageNav from "./ManageNav";
import Navbar from "../../Navbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const AddChapter = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const { cid } = useParams();
  let navigate = useNavigate();
  const [chapterName, setChapterName] = useState("");
  const [questionSheet, setQuestionSheet] = useState("");
  console.log(cid);

  const formdata = new FormData();
  formdata.append("chName", chapterName);
  formdata.append("questionSheet", questionSheet);
  console.log(formdata);
  const addChapter = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:6060/api/v1/auth/addChapterData/${cid}`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response);
      cogoToast.success("Chapter Added succesfully");
      setChapterName("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Container>
        <div className="editcourse-outer">
          <Navbar />
          <ManageNav
            editcourse={false}
            addvideo={false}
            showvideos={false}
            courseid={cid}
            addChapter={true}
          />

          <div className="head-main">Add Chapters</div>
          <div className="new-form">
            <form onSubmit={addChapter} encType="multipart/form-data">
              <div className="form-inner">
                <div className="s2">
                  <div>
                    <label>Chapter Name</label>
                    <input
                      type="text"
                      name="chName"
                      placeholder="chapter name"
                      value={chapterName}
                      onChange={(e) => setChapterName(e.target.value)}
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
              </div>
              <div className="hrline"></div>

              <div className="s4">
                <button type="submit" className="btn btn-success">
                  Submit
                </button>
                {/* <button className="btn btn-danger">Delete this Course</button> */}
              </div>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AddChapter;
const Container = styled.div``;
