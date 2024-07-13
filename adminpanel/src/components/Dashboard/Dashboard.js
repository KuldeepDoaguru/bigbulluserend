import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Leaderboard from "../Leaderboard/Leaderboard";
import Navbar from "../Navbar";
import Recentpurchases from "../Recentpurchases/Recentpurchases";
import "./Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../redux/slices/UserSlicer";
import styled from "styled-components";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);
  console.log(user?.token);
  const [invoices, setInvoices] = useState([]);
  const [keyword, setkeyword] = useState("");
  const [usersreg, setuserseg] = useState([]);
  const [usertilltime, setusertilltime] = useState([]);
  const [revenuegenerated, setrevenuegenerated] = useState(0);
  const [coursesSoldCount, setCoursesSoldCount] = useState(0);
  const [coursesSoldTime, setCoursesSoldTime] = useState("all");
  const [revenuetime, setrevenuetime] = useState("all");
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  // console.log(data[0].updatedAt.split('T'))

  const logoutHandleByToken = () => {
    // alert("Token Expired! You have been logged out");
    dispatch(clearUser());
    navigate("/");
  };

  const getRegStudent = async () => {
    try {
      const response = await axios.get(
        "https://admin.bigbulls.co.in/api/v1/auth/usersList",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "Unauthorized - Token expired") {
          logoutHandleByToken();
        } else {
          console.log("Unauthorized access:", errorMessage);
        }
      } else {
        console.log("An error occurred:", error.message);
      }
    }
  };

  const getBoughtCourseData = async () => {
    try {
      const response = await axios.get(
        "https://admin.bigbulls.co.in/api/v1/auth/getBoughtCourseDetails",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(invoices)

  const getdatedifference = (date1, date2) => {
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;

    return Math.floor(
      (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
        Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
        (1000 * 60 * 60 * 24)
    );
  };

  const currentdate = new Date();

  useEffect(() => {
    getBoughtCourseData();
    getRegStudent();
  }, []);

  useEffect(() => {
    const calculateCoursesSoldCount = () => {
      const filteredData = data.filter((item) => {
        const purchaseTime = new Date(item.purchase_time);
        const currentDate = new Date();

        if (coursesSoldTime === "1d") {
          return currentDate.getDate() === purchaseTime.getDate();
        } else if (coursesSoldTime === "1m") {
          return currentDate.getMonth() === purchaseTime.getMonth();
        } else if (coursesSoldTime === "6m") {
          // Adjust the logic for 6 months
          return currentDate.getMonth() >= purchaseTime.getMonth() - 6;
        } else if (coursesSoldTime === "1y") {
          // Adjust the logic for 1 year
          return currentDate.getFullYear() === purchaseTime.getFullYear();
        }

        // Default case for 'all'
        return true;
      });

      // Calculate the count of courses sold
      console.log(filteredData);
      const flattenedCourseIds = filteredData?.map((item) => item?.course_id);

      console.log(flattenedCourseIds?.length);
      setCoursesSoldCount(flattenedCourseIds?.length);
    };

    // Call the function to calculate courses sold count whenever coursesSoldTime changes
    calculateCoursesSoldCount();
  }, [coursesSoldTime, data]);

  useEffect(() => {
    const calculateRevenueCount = () => {
      const filteredRevenueData = data.filter((item) => {
        const purchaseTime = new Date(item.purchase_time);
        const currentDate = new Date();

        if (revenuetime === "1d") {
          return currentDate.getDate() === purchaseTime.getDate();
        } else if (revenuetime === "1m") {
          return currentDate.getMonth() === purchaseTime.getMonth();
        } else if (revenuetime === "6m") {
          // Adjust the logic for 6 months
          return currentDate.getMonth() >= purchaseTime.getMonth() - 6;
        } else if (revenuetime === "1y") {
          // Adjust the logic for 1 year
          return currentDate.getFullYear() === purchaseTime.getFullYear();
        }

        return true;
      });

      console.log(filteredRevenueData);
      const flattenedRevenueIds = filteredRevenueData.map((item) =>
        JSON.parse(item.amount)
      );

      console.log(flattenedRevenueIds);
      const totalRevenue = flattenedRevenueIds.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );

      console.log(totalRevenue);
      setrevenuegenerated(totalRevenue);
    };

    calculateRevenueCount();
  }, [revenuetime, data]);

  useEffect(() => {
    const calculateUserCount = () => {
      const filteredUserData = users.filter((item) => {
        const regTime = new Date(item.time);
        const currentDate = new Date();

        if (usertilltime === "1d") {
          return currentDate.getDate() === regTime.getDate();
        } else if (usertilltime === "1m") {
          return currentDate.getMonth() === regTime.getMonth();
        } else if (usertilltime === "6m") {
          // Adjust the logic for 6 months
          return currentDate.getMonth() >= regTime.getMonth() - 6;
        } else if (usertilltime === "1y") {
          // Adjust the logic for 1 year
          return currentDate.getFullYear() === regTime.getFullYear();
        }

        return true;
      });

      console.log(filteredUserData);
      const flattenedUserIds = filteredUserData.map((item) => item.time);

      console.log(flattenedUserIds);
      setuserseg(flattenedUserIds.length);
    };

    calculateUserCount();
  }, [usertilltime, data]);

  console.log(users);

  return (
    <>
      <Container>
        <div className="dashboard-outer paddingtop">
          <div className="dashborad-inner">
            <div className="head-main">Admin Dashboard</div>
            <div className="dashboard-indicators">
              <div className="statsbox bg1">
                <p>Courses Sold</p>
                {data.purchase_time === "1d"}
                <h1>{coursesSoldCount}</h1>
                <div className="DMYA">
                  <p
                    className={coursesSoldTime == "1d" ? "active" : ""}
                    onClick={() => setCoursesSoldTime("1d")}
                  >
                    1D
                  </p>
                  <p
                    className={coursesSoldTime == "1m" ? "active" : ""}
                    onClick={() => setCoursesSoldTime("1m")}
                  >
                    1M
                  </p>
                  <p
                    className={coursesSoldTime == "6m" ? "active" : ""}
                    onClick={() => setCoursesSoldTime("6m")}
                  >
                    6M
                  </p>
                  <p
                    className={coursesSoldTime == "1y" ? "active" : ""}
                    onClick={() => setCoursesSoldTime("1y")}
                  >
                    1Y
                  </p>
                  <p
                    className={coursesSoldTime == "all" ? "active" : ""}
                    onClick={() => setCoursesSoldTime("all")}
                  >
                    All
                  </p>
                </div>
              </div>

              <div className="statsbox bg2">
                <p>Revenue</p>
                <h1>
                  Rs.
                  {revenuegenerated}
                </h1>
                <div className="DMYA">
                  <p
                    className={revenuetime == "1d" ? "active" : ""}
                    onClick={() => setrevenuetime("1d")}
                  >
                    1D
                  </p>
                  <p
                    className={revenuetime == "1m" ? "active" : ""}
                    onClick={() => setrevenuetime("1m")}
                  >
                    1M
                  </p>
                  <p
                    className={revenuetime == "6m" ? "active" : ""}
                    onClick={() => setrevenuetime("6m")}
                  >
                    6M
                  </p>
                  <p
                    className={revenuetime == "1y" ? "active" : ""}
                    onClick={() => setrevenuetime("1y")}
                  >
                    1Y
                  </p>
                  <p
                    className={revenuetime == "all" ? "active" : ""}
                    onClick={() => setrevenuetime("all")}
                  >
                    All
                  </p>
                </div>
              </div>

              <div className="statsbox bg3">
                <p>Users Registered</p>
                <h1>{usersreg}</h1>
                <div className="DMYA">
                  <p
                    className={usertilltime == "1d" ? "active" : ""}
                    onClick={() => setusertilltime("1d")}
                  >
                    1D
                  </p>
                  <p
                    className={usertilltime == "1m" ? "active" : ""}
                    onClick={() => setusertilltime("1m")}
                  >
                    1M
                  </p>
                  <p
                    className={usertilltime == "6m" ? "active" : ""}
                    onClick={() => setusertilltime("6m")}
                  >
                    6M
                  </p>
                  <p
                    className={usertilltime == "1y" ? "active" : ""}
                    onClick={() => setusertilltime("1y")}
                  >
                    1Y
                  </p>
                  <p
                    className={usertilltime == "all" ? "active" : ""}
                    onClick={() => setusertilltime("all")}
                  >
                    All
                  </p>
                </div>
              </div>
            </div>
            <Recentpurchases data={invoices} />
          </div>
        </div>
        <ToastContainer />
      </Container>
    </>
  );
};

export default Dashboard;
const Container = styled.div`
  .paddingtop {
    padding-top: 7rem;
    @media screen and (max-width: 600px) {
      padding-top: 10rem;
    }
  }
`;
