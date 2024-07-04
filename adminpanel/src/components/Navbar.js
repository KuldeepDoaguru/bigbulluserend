import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import mainlogo from '../images/logofull1.png';
import "./Navbar.css";
import Cookies from "js-cookie";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { clearUser } from "../redux/slices/UserSlicer";
import { RiAdminFill, RiAdminLine } from "react-icons/ri";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    try {
      dispatch(clearUser());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Container>
        <div className="adminnav">
          <div className="s1">
            <div className="left">
              <img
                src="https://res.cloudinary.com/dq5upuxm8/image/upload/v1704632318/bigbull/bigbull_logosmall_psuvum.png"
                alt="logo"
              />
              <Link to="/">
                {location.pathname === "/" ? (
                  <button className="iconbtn-active">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </button>
                ) : (
                  <button className="iconbtn-inactive">
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
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <p className={"notification-circle"}></p>
                  </button>
                )}
              </Link>

              <Link to="/manageusers">
                {" "}
                {location.pathname === "/manageusers" ? (
                  <button className="iconbtn-active">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </button>
                ) : (
                  <button className="iconbtn-inactive">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className={"notification-circle"}></p>
                  </button>
                )}
              </Link>
              <Link to="/contact" style={{ textDecoration: "none" }}>
                {location.pathname === "/contact" ? (
                  <button className="iconbtn-active">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                ) : (
                  <button className="iconbtn-inactive">
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <p className={"notification-circle"}></p>
                  </button>
                )}
              </Link>
              <Link to="/manage-admin" style={{ textDecoration: "none" }}>
                {location.pathname === "/manage-admin" ? (
                  <button className="iconbtn-active">
                    <RiAdminFill className="currentColor fs-1" />
                  </button>
                ) : (
                  <button className="iconbtn-inactive">
                    <RiAdminLine className="currentColor" />
                    <p className={"notification-circle"}></p>
                  </button>
                )}
              </Link>
            </div>

            <div className="right">
              <Link to="/leaderboard">
                <button
                  className={
                    location.pathname === "/leaderboard"
                      ? "btn-active"
                      : "btn-inactive"
                  }
                >
                  Leaderboard
                </button>
              </Link>
              <Link to="/addcourse">
                <button
                  className={
                    location.pathname === "/addcourse"
                      ? "btn-active"
                      : "btn-inactive"
                  }
                >
                  Add Course
                </button>
              </Link>
              <Link to="/managecourses">
                <button
                  className={
                    location.pathname === "/managecourses"
                      ? "btn-active"
                      : "btn-inactive"
                  }
                >
                  Manage Courses
                </button>
              </Link>
              {/* <Link to='/kycstatus'><button className={location.pathname === '/kycstatus' ? 'btn-active' : 'btn-inactive'}>Kyc Status</button></Link> */}
              {/* <Link to='/login'><button className={location.pathname === '/login' ? 'btn-active' : 'btn-inactive'}>login</button></Link> */}
              <button
                variant="outline-info"
                className="btn-inactive"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
          <div className="s2">Bigbull Admin Panel</div>
        </div>
      </Container>
    </>
  );
};

export default Navbar;
const Container = styled.div`
  width: 100%;
  .s1 {
    @media screen and (max-width: 500px) {
      display: flex;
      flex-direction: column;
    }
  }
  .right {
    font-size: 12px;
  }
`;
