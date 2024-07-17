import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useParams } from "react-router-dom";
import ManageNav from "../Manage_Course_Video/ManageNav";
import styled from "styled-components";
import { useSelector } from "react-redux";
import axios from "axios";
import cogoToast from "cogo-toast";

const ManageFaq = () => {
  const { cid } = useParams();
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const [faqList, setFaqList] = useState([]);
  const [faqListSingle, setFaqListSingle] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState();
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [addFormData, setAddFormData] = useState({
    question: "",
    answer: "",
  });
  const [upFormData, setUpFormData] = useState({
    question: "",
    answer: "",
  });

  const handlechangeAdd = (e) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlechangeUp = (e) => {
    const { name, value } = e.target;
    setUpFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(addFormData);

  const getFaqList = async () => {
    try {
      const { data } = await axios.get(
        `https://admin.bigbulls.co.in/api/v1/auth/getCourseFaq/${cid}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setFaqList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const goBack = () => {
    window.history.go(-1);
  };

  useEffect(() => {
    getFaqList();
  }, []);

  console.log(faqList);
  console.log(faqListSingle);

  const displayEdit = (id) => {
    setShowEdit(true);
    setSelectedFaq(id);
    setShowAddFaq(false);
  };

  const displayAddFaq = () => {
    setShowEdit(false);
    setShowAddFaq(true);
  };

  const addFaqDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `https://admin.bigbulls.co.in/api/v1/auth/createFaq/${cid}`,
        addFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      cogoToast.success("Faq Added Successfully");
      getFaqList();
      setShowAddFaq(false);
    } catch (error) {
      console.log(error);
    }
  };

  const updateFaqDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `https://admin.bigbulls.co.in/api/v1/auth/updateCourseFaq/${cid}/${selectedFaq}`,
        upFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      cogoToast.success("details updated successfully");
      getFaqList();
      setShowEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getFaqListByFaqId = async () => {
    try {
      const { data } = await axios.get(
        `https://admin.bigbulls.co.in/api/v1/auth/getCourseFaqbyFaqId/${cid}/${selectedFaq}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setFaqListSingle(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFaqListByFaqId();
  }, [selectedFaq]);

  console.log(faqListSingle);

  useEffect(() => {
    setUpFormData({
      question: faqListSingle[0]?.question,
      answer: faqListSingle[0]?.answer,
    });
  }, [faqListSingle]);

  const deleteFaqCourse = async (id) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete");
      if (confirm) {
        const res = await axios.delete(
          `https://admin.bigbulls.co.in/api/v1/auth/deleteCourseFaq/${cid}/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        cogoToast.success("faq deleted successfully");
        getFaqList();
      }
    } catch (error) {
      console.log(error);
    }
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
            addChapter={false}
            manageAbout={false}
            manageFaq={true}
            manageReview={false}
          />
          <div className="head-main"> Manage Course FAQ </div>
          <div className="container new-form">
            <div className="row mt-5">
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                <div className="container-fluid maxheight py-5">
                  <h2 className="fw-bold fs-3">FAQ List</h2>
                  <button
                    className="btn btn-success mt-3"
                    onClick={displayAddFaq}
                  >
                    Add FAQ
                  </button>
                  <ul>
                    {faqList?.map((item) => (
                      <>
                        <li className="">
                          <div className="mt-4">
                            <h2 className="fw-bold">
                              Question : {item.question?.toUpperCase()} ?
                            </h2>
                            <p>Answer : {item.answer}</p>
                          </div>
                          <div className="d-flex mt-2">
                            <button
                              className="btn btn-info"
                              onClick={() => displayEdit(item.faq_id)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger mx-2"
                              onClick={() => deleteFaqCourse(item.faq_id)}
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      </>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                <div className="container-fluid">
                  {showAddFaq && (
                    <>
                      <h2 className="fw-bold">Add FAQ</h2>

                      <form className="mt-4" onSubmit={addFaqDetails}>
                        <div class="mb-3">
                          <label for="" class="form-label">
                            FAQ Question
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            name="question"
                            value={addFormData.question}
                            onChange={handlechangeAdd}
                            placeholder="FAQ Question"
                          />
                        </div>
                        <div class="mb-3">
                          <label for="" class="form-label">
                            FAQ Answer
                          </label>
                          <textarea
                            class="form-control"
                            rows="3"
                            placeholder="write answer here..."
                            name="answer"
                            value={addFormData.answer}
                            onChange={handlechangeAdd}
                          ></textarea>
                        </div>
                        <button
                          className="btn btn-outline-success shadow"
                          type="submit"
                        >
                          Submit
                        </button>
                      </form>
                    </>
                  )}
                  {showEdit && (
                    <>
                      <h2 className="fw-bold">Update FAQ</h2>
                      <form className="mt-4" onSubmit={updateFaqDetails}>
                        <div class="mb-3">
                          <label for="" class="form-label">
                            FAQ Question
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="FAQ Question"
                            name="question"
                            value={upFormData.question}
                            onChange={handlechangeUp}
                          />
                        </div>
                        <div class="mb-3">
                          <label for="" class="form-label">
                            FAQ Answer
                          </label>
                          <textarea
                            class="form-control"
                            rows="3"
                            placeholder="write answer here"
                            name="answer"
                            value={upFormData.answer}
                            onChange={handlechangeUp}
                          ></textarea>
                        </div>
                        <button
                          className="btn btn-outline-success shadow"
                          type="submit"
                        >
                          Submit
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ManageFaq;
const Container = styled.div`
  .backbtn {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    justify-content: start;
    gap: 4px;
  }

  .paddingtop {
    padding-top: 7rem;
    @media screen and (max-width: 600px) {
      padding-top: 10rem;
    }
  }

  .maxheight {
    max-height: 20rem;
    overflow: scroll;
  }
`;
