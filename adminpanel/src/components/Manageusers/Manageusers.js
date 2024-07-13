import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";
import cogoToast from "cogo-toast";

const Manageusers = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const [userdetails, setuserDeatils] = useState([]);
  const [keyword, setkeyword] = useState("");
  const [newdata, setnewdata] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const getUsers = async () => {
    try {
      const response = await axios.get(
        "https://admin.bigbulls.co.in/api/v1/auth/usersList",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response.data);
      setuserDeatils(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = () => {
    if (keyword.trim() === "") {
      setShowResults(false);
    } else {
      const matchingUsers = userdetails.filter((user) => {
        return user.name.toLowerCase().includes(keyword.toLowerCase());
      });
      setShowResults(matchingUsers);
    }
  };

  const deleteUser = async (id) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete user");
      if (confirm) {
        const response = await axios.delete(
          `https://admin.bigbulls.co.in/api/v1/auth/deleteUser/${id}`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log(response);
        getUsers();
        cogoToast.success("user deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(userdetails);

  const trimmedKeyword = keyword.trim().toLowerCase();
  console.log(trimmedKeyword);
  return (
    <>
      <Container>
        <div className="container paddingtop">
          <div className="head-main">Manage Users</div>
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
              placeholder="Search by username, email or Mobile "
              value={keyword}
              onChange={(e) => setkeyword(e.target.value.toLowerCase())}
              type="text"
            />
          </div>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead className="table-head">
                <tr>
                  <th className="sticky">User ID</th>
                  <th className="sticky">Name</th>
                  <th className="sticky">Email</th>
                  <th className="sticky">Gender</th>
                  <th className="sticky">Phone</th>
                  <th className="sticky">Delete</th>
                  <th className="sticky">Edit</th>
                </tr>
              </thead>
              <tbody>
                {userdetails
                  .filter((val) => {
                    if (keyword === "") {
                      return true;
                    } else if (
                      val.firstname.toLowerCase().includes(trimmedKeyword) ||
                      val.email.toLowerCase().includes(trimmedKeyword) ||
                      val.phone.toLowerCase().includes(trimmedKeyword)
                    ) {
                      return val;
                    }
                  })
                  .map((e, i) => {
                    return (
                      <tr className="table-row" key={e.id}>
                        <td>{e.id}</td>
                        <td>
                          {e.firstname} {e.lastname}
                        </td>
                        <td>{e.email}</td>
                        <td>{e.gender}</td>
                        <td>{e.phone}</td>
                        <td>
                          <button
                            className="btn btn-danger bg-dark"
                            onClick={() => deleteUser(e.id)}
                          >
                            Delete
                          </button>
                        </td>
                        <td>
                          <Link
                            to={`/edituserdetails/${e.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <button className="btn btn-info btnin">Edit</button>
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

export default Manageusers;
const Container = styled.div`
  .table-head {
    background-color: #583b04;
    color: white;
  }

  .table {
    width: 100%;

    @media screen and (max-width: 500px) {
      width: 100%;
    }
  }

  .table-responsive {
    max-height: 30rem;
  }

  th {
    background-color: #583b04;
    color: white;
    position: sticky;
    white-space: nowrap;
  }

  td {
    white-space: break-spaces;
  }

  .sticky {
    position: sticky;
    top: 0;
    background-color: #583b04;
    color: white;
    z-index: 1;
  }

  .btnin {
    background-color: #583b04;
    color: white;
  }

  .paddingtop {
    padding-top: 7rem;
    @media screen and (max-width: 600px) {
      padding-top: 10rem;
    }
  }
`;
