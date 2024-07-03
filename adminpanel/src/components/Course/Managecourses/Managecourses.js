import React, { useEffect, useState } from "react";
import "../../Recentpurchases/RecentPurchases.css";
import Navbar from "../../Navbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useSelector } from "react-redux";

const Managecourses = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const [allCourses, setallCourses] = useState([]);
  const [keyword, setkeyword] = useState("");
  const [newdata, setnewdata] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const getCourse = async () => {
    try {
      const res = await axios.get(
        "http://localhost:6060/api/v1/auth/getAllCourses",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(res.data.result);
      setallCourses(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourse();
  }, []);

  const deleteCourse = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:6060/api/v1/auth/deleteCourse/${id}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(res);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    const matchingCourses = allCourses.filter((course) => {
      return course.name.toLowerCase().includes(keyword.toLowerCase());
    });

    console.log(matchingCourses);
    setShowResults(matchingCourses);
  };

  console.log(showResults);
  console.log(searchResults);

  console.log(allCourses);

  return (
    <>
      <Container>
        <Navbar />
        <div className="container">
          <div className="head-main">Manage Courses</div>
          <div className="searchbar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              placeholder="Search any course by course name"
              value={keyword}
              onChange={(e) => setkeyword(e.target.value.toLowerCase())}
              type="text"
            />
            <button
              className="btn btn-info handlesearchbtn"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          <div>
            {showResults && (
              <div className="searchDiv">
                <h2>Search Results:</h2>
                <ul>
                  {showResults.map((result, index) => (
                    <li key={index}>
                      <a
                        href={`http://localhost:5500/course-details/${result._id}`}
                        target="_blank"
                      >
                        {result.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* <div className="table">
            <div className="table-head">
              <th className="table-small" style={{ width: "25%" }}>
                Course Name
              </th>
              <th className="table-small" style={{ width: "15%" }}>
                Course Category
              </th>
              <th className="table-email" style={{ width: "15%" }}>
                Courses Price
              </th>
              <th className="table-btn" style={{ width: "10%" }}>
                Delete
              </th>

              <th className="table-btn" style={{ width: "10%" }}>
                Edit
              </th>
            </div>
            <div className="table-body">
              {allCourses
                ?.filter((val) => {
                  if (keyword === "") {
                    return true;
                  } else if (
                    val.course_name.toLowerCase().includes(keyword) ||
                    val.course_name.toLowerCase().includes(keyword)
                  ) {
                    return val;
                  }
                })
                .map((item, index) => (
                  <>
                    <div className="table-row" key={index}>
                      <td className="table-small" style={{ width: "25%" }}>
                        <a
                          href={`https://bigbulls.co.in/course-details/${item.course_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>
                            <FaExternalLinkAlt />
                          </span>
                          {item.course_name}
                        </a>
                      </td>
                      <td className="table-small" style={{ width: "15%" }}>
                        {item.category}
                      </td>
                      <td className="table-email" style={{ width: "15%" }}>
                        {item.price}
                      </td>
                      <td
                        className="table-btn"
                        style={{ color: "black" }}
                        onClick={() => deleteCourse(item.course_id)}
                      >
                        Delete
                      </td>
                      <Link
                        to={`/editcourse/${item.course_id}`}
                        style={{ textDecoration: "none", width: "10%" }}
                      >
                        <td className="table-btn">Edit</td>
                      </Link>
                    </div>
                  </>
                ))}
            </div>
          </div> */}

          <div class="table-responsive">
            <table class="table table-bordered">
              <thead className="table-head">
                <tr>
                  <th className="table-small" style={{ width: "25%" }}>
                    Course Name
                  </th>
                  <th className="table-small" style={{ width: "15%" }}>
                    Course Category
                  </th>
                  <th className="table-email" style={{ width: "15%" }}>
                    Courses Price
                  </th>
                  <th style={{ width: "10%" }}>Delete</th>

                  <th style={{ width: "10%" }}>Edit</th>
                </tr>
              </thead>
              <tbody>
                {allCourses
                  .filter((val) => {
                    if (keyword === "") {
                      return true;
                    } else if (
                      val.name.toLowerCase().includes(keyword) ||
                      val.name.toLowerCase().includes(keyword)
                    ) {
                      return val;
                    }
                  })
                  .map((item, i) => {
                    return (
                      <tr className="table-row" key={item.id}>
                        <td className="table-small" style={{ width: "25%" }}>
                          <a
                            href={`https://bigbulls.co.in/course-details/${item.course_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>
                              <FaExternalLinkAlt />
                            </span>
                            {item.course_name}
                          </a>
                        </td>
                        <td className="table-small" style={{ width: "15%" }}>
                          {item.category}
                        </td>
                        <td className="table-email" style={{ width: "15%" }}>
                          {item.price}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteCourse(item.course_id)}
                          >
                            Delete
                          </button>
                        </td>

                        <td>
                          <Link
                            to={`/editcourse/${item.course_id}`}
                            style={{ textDecoration: "none", width: "10%" }}
                          >
                            <button className="btn btn-info">Edit</button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
        <ToastContainer />
      </Container>
    </>
  );
};

export default Managecourses;
const Container = styled.div`
  .table-row {
    border-radius: 5px;
  }

  .table-sno {
    width: 10rem;
    a {
      text-decoration: none;
      color: #22a6b3;
    }
  }
  .handlesearchbtn {
    border: none;
    background: transparent;
    padding: 0.5rem;
    border-radius: 5px;
    &:hover {
      background-color: #dff9fb;
    }
  }

  .table-head {
    background-color: #583b04;
    color: white;
  }
`;