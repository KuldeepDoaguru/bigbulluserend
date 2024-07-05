import React, { useEffect, useState } from "react";
import "../Recentpurchases/RecentPurchases.css";
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Leaderboard = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const [lbdetails, setlbDeatils] = useState([]);
  const [keyword, setkeyword] = useState("");
  const [userLeader, setUsersLeader] = useState([]);
  const [allUser, setAllUser] = useState([]);

  const getLeaderBoardDetails = async () => {
    try {
      const response = await axios.get(
        "https://admin.bigbulls.co.in/api/v1/auth/LeaderBoardData",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response.data.result);
      setUsersLeader(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUsers = async () => {
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
      setAllUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLeaderBoardDetails();
    getAllUsers();
  }, []);

  console.log(allUser);
  console.log(userLeader);

  const result = userLeader?.reduce((acc, item) => {
    // Check if the user exists in allUser
    const userExists = allUser.some((user) => user.id === item.id);
    if (userExists) {
      if (!acc[item.id]) {
        acc[item.id] = { ...item, amount: 0 };
      }
      acc[item.id].amount += Number(item.amount);
    }
    return acc;
  }, {});

  const filterData = Object.values(result);

  console.log(filterData);

  // Calculate total amount from the filtered data using reduce
  const totalAmount = filterData.reduce(
    (sum, item) => sum + parseInt(item.amount, 10),
    0
  );

  console.log("Total Amount:", totalAmount);

  return (
    <>
      <Container>
        <div className="container paddingtop">
          <div className="head-main">Leaderboard</div>
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
              placeholder="Search by username or user email"
              value={keyword}
              onChange={(e) => setkeyword(e.target.value.toLowerCase())}
            />
          </div>

          <div class="table-responsive">
            <table class="table table-bordered">
              <thead className="table-head">
                <tr>
                  <th className="sticky">SN</th>
                  <th className="sticky">Email ID</th>
                  <th className="sticky">User name</th>
                  <th className="sticky">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {filterData
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
                  .sort((a, b) => b.amount - a.amount)
                  .map((user, i) => {
                    return (
                      <tr className="table-row" key={user.id}>
                        <td className="table-sno">{i + 1}</td>
                        <td className="table-small">{user.email}</td>
                        <td className="table-small">{user.name}</td>
                        <td className="table-small">₹ {user.amount}</td>
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

export default Leaderboard;
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

  td {
    white-space: break-spaces;
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
