import React, { useState } from "react";
import styled from "styled-components";
import ManageNav from "./ManageNav";
import Navbar from "../../Navbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";

const AddChapter = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const { cid } = useParams();
  let navigate = useNavigate();
  const [chapterName, setChapterName] = useState("");
  const [questionSheet, setQuestionSheet] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(cid);

  const formdata = new FormData();
  formdata.append("chName", chapterName);
  formdata.append("questionSheet", questionSheet);
  console.log(formdata);
  const addChapter = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `https://admin.bigbulls.co.in/api/v1/auth/addChapterData/${cid}`,
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
      setLoading(false);
      navigate(`/showchapter/${cid}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const goBack = () => {
    window.history.go(-1);
  };

  return (
    <>
      <Container>
        <div className="editcourse-outer paddingtop">
          <div className="mx-2">
            <div className="">
              <button className="btn btn-success backbtn" onClick={goBack}>
                <IoMdArrowRoundBack /> Back
              </button>
            </div>
          </div>
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
              <div className="form-inner shadow">
                <div className="s2">
                  <div className="d-flex flex-column gap-1">
                    <label className="text-start fw-bold">Chapter Name</label>
                    <input
                      type="text"
                      name="chName"
                      required
                      placeholder="chapter name"
                      value={chapterName}
                      className="p-1 border rounded"
                      onChange={(e) => setChapterName(e.target.value)}
                    />
                  </div>
                  <div className="d-flex flex-column gap-1 mt-3">
                    <label className="text-start fw-bold">Question Sheet</label>
                    <input
                      type="file"
                      filename="questionSheet"
                      required
                      className="p-1"
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
                <button
                  type="submit"
                  className="btn btn-success successbtn shadow mb-2"
                  disabled={loading}
                >
                  {loading ? "Submit..." : "Submit"}{" "}
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
const Container = styled.div`
  .backbtn {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    justify-content: start;
    gap: 4px;
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

  .paddingtop {
    padding-top: 7rem;
    @media screen and (max-width: 600px) {
      padding-top: 10rem;
    }
  }
`;
