import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import cogoToast from "cogo-toast";

const ManageAdmin = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const [adminList, setAdminList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const getAdminData = async () => {
    try {
      const { data } = await axios.get(
        `https://admin.bigbulls.co.in/api/v1/auth/getAdmin`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setAdminList(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(adminList);
  useEffect(() => {
    getAdminData();
  }, []);

  const trimmedKeyword = keyword.trim().toLowerCase();
  console.log(trimmedKeyword);

  const approveAdmin = async (id) => {
    setLoading(true);
    try {
      const confirm = window.confirm(
        "Are you sure you want to approve this admin?"
      );
      if (confirm) {
        const response = await axios.put(
          `https://admin.bigbulls.co.in/api/v1/auth/updateAdminDetails/${id}`,
          {
            approved_by: user.email,
            status: "active",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setLoading(false);
        getAdminData();
        cogoToast.success("Admin Approved Successfully");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const disApproveAdmin = async (id) => {
    setLoading(true);
    try {
      const confirm = window.confirm(
        "Are you sure you want to disapprove this admin?"
      );
      if (confirm) {
        const response = await axios.put(
          `https://admin.bigbulls.co.in/api/v1/auth/updateAdminDetails/${id}`,
          {
            approved_by: user.email,
            status: "notactive",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        getAdminData();
        cogoToast.success("Admin Approved Successfully");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <div className="paddingtop">
          <div className="head-main">Manage Admin</div>
          <div className="container">
            <div>
              <input
                placeholder="Search by email"
                value={keyword}
                className="inputsearch shadow"
                onChange={(e) => setKeyword(e.target.value.toLowerCase())}
                type="text"
              />
            </div>

            <div class="table-responsive mt-3">
              <table class="table table-bordered">
                <thead className="table-head">
                  <tr>
                    <th className="sticky">Admin ID</th>
                    <th className="sticky">Admin Email</th>
                    <th className="sticky">Status</th>
                    <th className="sticky">Approved By</th>
                    <th className="sticky">Action</th>
                    {/* <th className="sticky">Delete</th> */}
                  </tr>
                </thead>
                <tbody>
                  {adminList
                    .filter((val) => {
                      if (keyword === "") {
                        return true;
                      } else if (
                        val.email.toLowerCase().includes(trimmedKeyword)
                      ) {
                        return val;
                      }
                    })
                    .map((item, i) => {
                      return (
                        <tr className="table-row" key={item.admin_id}>
                          <td className="table-small">{item.admin_id}</td>
                          <td className="table-small">{item.email}</td>
                          <td className="table-email">{item.status}</td>
                          <td>
                            {item.status === "active" ? item.approved_by : ""}
                          </td>
                          <td>
                            {item.status === "active" ? (
                              <>
                                <button
                                  className="btn btn-info infobtn"
                                  onClick={() => disApproveAdmin(item.admin_id)}
                                  disabled={loading}
                                >
                                  {loading ? "Inactive..." : "Inactive"}{" "}
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-info"
                                  onClick={() => approveAdmin(item.admin_id)}
                                  disabled={loading}
                                >
                                  {loading ? "active..." : "active"}
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
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

  .inputsearch {
    width: 90%;
    margin-top: 1rem;
    border-radius: 15px;
    padding: 0.5rem 1rem;
    &:focus {
      border: 1px solid grey;
    }
  }

  .table-responsive {
    max-height: 30rem;
  }

  .paddingtop {
    padding-top: 7rem;
    @media screen and (max-width: 600px) {
      padding-top: 10rem;
    }
  }
`;
