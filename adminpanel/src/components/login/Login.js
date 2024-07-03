import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import cogoToast from "cogo-toast";
import { IoEye, IoEyeOffOutline } from "react-icons/io5";
import { setUser } from "../../redux/slices/UserSlicer";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [verification, setVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localhost, setLocalhost] = useState([]);
  const user = useSelector((state) => state);
  console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);

  const sendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:6060/api/v1/auth/sendOtp",
        {
          email,
        }
      );
      setLoading(false);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const adminLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:6060/api/v1/auth/adminLoginUser",
        {
          email,
          password,
        }
      );
      setLoading(false);
      console.log(response.data.success);
      // cogoToast.success(response.data.message);
      setLocalhost(response.data);
      if (response.data.success === "true") {
        setPopupVisible(true);
        sendOtp();
        cogoToast.success("OTP sent Successfully");
      } else {
        cogoToast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("Axios error:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // If there is a response object and it contains a message property
        cogoToast.error(error.response.data.message);
      } else {
        // If there is no response object or no message property
        console.log(error);
        setLoading(false);
        cogoToast.error("An error occurred while processing your request.");
      }
    }
  };

  console.log(localhost.user);

  const closeUpdatePopup = () => {
    setPopupVisible(false);
  };

  const Popup = ({ email, onClose }) => {
    const [otp, setOtp] = useState("");
    console.log(email);

    const verifyOtpAdmin = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(
          "http://localhost:6060/api/v1/auth/verifyOtp",
          {
            email,
            otp,
          }
        );
        console.log(response);
        console.log(localhost);
        const userData = localhost.user;
        localStorage.setItem("userData", JSON.stringify(userData));
        dispatch(setUser(userData));
        navigate("/");
        setVerification(true);
        cogoToast.success("Login successful");
      } catch (error) {
        console.log(error);
        cogoToast.error("Wrong OTP!");
      }
    };

    useEffect(() => {
      console.log("Popup visible state updated:", popupVisible);
    }, [popupVisible]);

    return (
      <>
        <div>
          <div className={`popup-container${popupVisible ? " active" : ""}`}>
            <div className="popup">
              <form onSubmit={verifyOtpAdmin} className="d-flex flex-column">
                <div className="d-flex justify-content-evenly flex-column">
                  <label htmlFor="otp" className="fw-bold">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="mb-3 rounded p-1"
                    name="otp"
                    value={otp}
                    required
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-success mt-2 mb-2">
                      Login
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger mt-2 mb-2"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <Container>
        <div className="d-flex justify-content-center">
          <div className="text-black cardstyle shadow">
            <div className="card-body p-md-5">
              <div className="row justify-content-center">
                <div className="col-md-10 col-lg-6 col-xl-5 col-12 order-2">
                  <h2 className="text-center fw-bold mb-5 mx-1 mt-4">
                    Admin Login
                  </h2>

                  <form className="mx-1" onSubmit={adminLogin}>
                    <div className="d-flex flex-row align-items-center mb-4">
                      <i className="fas fa-envelope fa-lg me-2 fa-fw"></i>
                      <div className="form-outline flex-fill mb-0">
                        <label className="form-label" for="form3Example3c">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={email}
                          required
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-control"
                          placeholder="email"
                        />
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-center mb-4">
                      <i className="fas fa-lock fa-lg me-2 fa-fw"></i>
                      <div className="form-outline flex-fill mb-0">
                        <label className="form-label" for="form3Example4c">
                          Password
                        </label>
                        <div className="input-container">
                          <input
                            name="password"
                            type="password"
                            id="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control relative"
                            placeholder="password"
                          />
                          {/* <div className="eye-icon">
                            {show ? (
                              <IoEye onClick={() => setShow(false)} />
                            ) : (
                              <IoEyeOffOutline onClick={() => setShow(true)} />
                            )}
                          </div> */}
                        </div>
                      </div>
                    </div>

                    <div className="col-5 ms-3">
                      <p>
                        <Link to={`/password-reset`}>Forgot Password?</Link>
                      </p>
                    </div>

                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      {/* <Link to="/superadmin-dashboard"></Link> */}
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                      >
                        {loading ? "Login..." : "Login"}
                      </button>
                    </div>
                  </form>
                  <hr className="shadow" />
                  <div className="forgotreg mb-2 mt-2">
                    <p>
                      Click here register admin
                      <Link className="fw-bold mx-2" to={`/admin-register`}>
                        <button className="btn btn-primary shadow">
                          Register
                        </button>
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1">
                  <img
                    src="https://res.cloudinary.com/dq5upuxm8/image/upload/v1719905527/bigbull_test_l2k7zf.png"
                    className="img-fluid img-fr"
                    alt="Sample"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {popupVisible && <Popup email={email} onClose={closeUpdatePopup} />}
      </Container>
    </>
  );
};

export default Login;
const Container = styled.div`
  .cardstyle {
    border-radius: 25px;
    height: 100%;
    width: 80%;
    margin-top: 2rem;
    margin-bottom: 2rem;
    background-color: #38ada9 !important;
    @media screen and (max-width: 500px) {
      width: 100%;
      border-radius: 0px;
      margin: 0px;
    }
  }

  a {
    text-decoration: none;
  }

  .select-style {
    border: none;
    background-color: #22a6b3;
    font-weight: bold;
    color: white;
  }

  .popup-container {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
  }

  .popup-container.active {
    display: flex;
    background-color: #00000075;
    z-index: 1;
  }

  .popup {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .img-fr {
    height: 80vh;
    width: auto;
    @media screen and (max-width: 500px) {
      height: 40vh;
    }
  }

  .input-container {
    display: flex;
    align-items: center;
    position: relative;
  }

  .eye-icon {
    position: absolute;
    right: 10px; /* Adjust the value to your preference */
    cursor: pointer;
  }

  h2 {
    font-size: 2.5rem;
    font-family: "Ga Maamli", sans-serif;
    font-weight: 400;
    font-style: normal;
    letter-spacing: 8px;
  }

  i {
    margin-top: 1.5rem !important;
  }

  .forgotreg {
    display: flex;
    justify-content: flex-end;
    @media screen and (max-width: 500px) {
      justify-content: space-evenly;
      gap: 1rem;
    }
  }
`;
