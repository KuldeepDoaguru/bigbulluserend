import React from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";

const ManageAdmin = () => {
  return (
    <>
      <Container>
        <div>
          <Navbar />
          <div className="head-main">Manage Admin</div>
          <div className="container">
            <div class="table-responsive mt-3">
              <table class="table table-bordered">
                <thead className="table-head">
                  <tr>
                    <th className="sticky">Admin ID</th>
                    <th className="sticky">Admin Email</th>
                    <th className="sticky">Status</th>
                    <th className="sticky">Approved By</th>
                    <th className="sticky">Edit</th>
                    <th className="sticky">Delete</th>
                  </tr>
                </thead>
                {/* <tbody>
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
                            className="btn btn-danger bg-dark"
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
                            <button className="btn btn-info infobtn">
                              Edit
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody> */}
              </table>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ManageAdmin;
const Container = styled.div`
  th {
    background-color: #583b04;
    color: white;
    position: sticky;
    white-space: nowrap;
  }

  td {
    white-space: nowrap;
  }

  .sticky {
    position: sticky;
    top: 0;
    background-color: #583b04;
    color: white;
    z-index: 1;
  }

  .infobtn {
    background-color: #583b04;
    color: white;
  }
`;
