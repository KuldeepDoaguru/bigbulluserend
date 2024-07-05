import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../Navbar";
import "./Contact.css";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Contact = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const [contactus, setcontactus] = useState([]);
  const [keyword, setkeyword] = useState("");

  const getContact = async () => {
    try {
      const response = await axios.get(
        "https://admin.bigbulls.co.in/api/v1/auth/contactInquiry",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response.data.result);
      setcontactus(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getContact();
  }, []);

  console.log(contactus);

  const trimmedKeyword = keyword.trim().toLowerCase();
  console.log(trimmedKeyword);

  return (
    <>
      <Container>
        <div className="container paddingtop">
          <div className="head-main">Contact Requests</div>
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
              placeholder="Search by username, email or mobile number"
              value={keyword}
              onChange={(e) => setkeyword(e.target.value.toLowerCase())}
              type="text"
            />
          </div>

          <div class="table-responsive">
            <table class="table table-bordered">
              <thead className="table-head">
                <tr>
                  <th className="sticky">Sno.</th>
                  <th className="sticky">Name</th>
                  <th className="sticky">Email ID</th>
                  <th className="sticky">Mobile</th>
                  <th className="sticky">Message</th>
                  <th className="sticky">Time</th>
                </tr>
              </thead>
              <tbody>
                {contactus
                  .filter((val) => {
                    if (keyword === "") {
                      return true;
                    } else if (
                      val.name.toLowerCase().includes(trimmedKeyword) ||
                      val.email.toLowerCase().includes(trimmedKeyword) ||
                      val.mobile.toLowerCase().includes(trimmedKeyword)
                    ) {
                      return val;
                    }
                  })
                  .map((e, i) => {
                    return (
                      <tr className="table-row" key={e.id}>
                        <td className="table-sno">{i + 1}</td>
                        <td className="table-small">{e.name}</td>
                        <td className="table-small">{e.email}</td>
                        <td className="table-small">{e.mobile}</td>
                        <td className="table-small">{e.message}</td>
                        <td className="table-small">
                          {e.time.toString().split("T")[0]}
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

export default Contact;
const Container = styled.div`
  .table-head {
    background-color: #583b04;
    color: white;
  }

  th {
    background-color: #583b04;
    color: white;
    position: sticky;
    white-space: nowrap;
  }

  .sticky {
    position: sticky;
    top: 0;
    background-color: #583b04;
    color: white;
    z-index: 1;
  }
  .paddingtop {
    padding-top: 7rem;
    @media screen and (max-width: 600px) {
      padding-top: 10rem;
    }
  }
`;
