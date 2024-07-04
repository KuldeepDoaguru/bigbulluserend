import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// import "./ManageNav.css";
import styled from "styled-components";

const ManageNav = ({
  editcourse,
  showvideos,
  courseid,
  addvideo,
  addChapter,
  showchapter,
}) => {
  return (
    <>
      <Container>
        <div className="manage-nav">
          <div className="row">
            <div className="col-xxl-1 col-xl-1 col-lg-1 col-md-12 col-sm-12 col-12"></div>
            <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
              {" "}
              <Link to={`/editcourse/${courseid}`}>
                {" "}
                <button
                  className={
                    editcourse == true
                      ? "btn-active shadow"
                      : "btn btn-secondary shadow"
                  }
                >
                  Edit Course
                </button>
              </Link>
            </div>
            <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
              <Link to={`/addChapters/${courseid}`}>
                {" "}
                <button
                  className={
                    addChapter == true
                      ? "btn-active shadow"
                      : "btn btn-secondary shadow"
                  }
                >
                  Add Chapter
                </button>
              </Link>
            </div>
            <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
              <Link to={`/addvideo/${courseid}`}>
                {" "}
                <button
                  className={
                    addvideo == true
                      ? "btn-active shadow"
                      : "btn btn-secondary shadow"
                  }
                >
                  Add Video
                </button>
              </Link>
            </div>
            <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
              <Link to={`/showvideos/${courseid}`}>
                {" "}
                <button
                  className={
                    showvideos == true
                      ? "btn-active shadow"
                      : "btn btn-secondary shadow"
                  }
                >
                  Course Videos
                </button>
              </Link>
            </div>
            <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
              <Link to={`/showchapter/${courseid}`}>
                {" "}
                <button
                  className={
                    showchapter == true
                      ? "btn-active shadow"
                      : "btn btn-secondary shadow"
                  }
                >
                  Course Chapter
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ManageNav;
const Container = styled.div`
  .manage-nav {
    /* display: flex;
    justify-content: center; */
    margin: 10px;
    .btn {
      background-color: white;
      margin: 10px;
      width: 100%;
      color: black;
      padding: 10px 0px;
      border-radius: 10px;
      font-size: 17px;
      cursor: pointer;
    }
    .btn-active {
      background-color: black;
      margin: 10px;
      width: 100%;
      color: white;
      padding: 10px 0px;
      border-radius: 10px;
      font-size: 17px;
    }
  }
`;
