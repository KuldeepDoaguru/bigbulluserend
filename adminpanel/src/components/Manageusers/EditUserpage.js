import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "./EditUserpage.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import styled from "styled-components";
import cogoToast from "cogo-toast";

const EditUserpage = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const { uid } = useParams();
  let navigate = useNavigate();
  const [useractive, setUseractive] = useState();
  const [allCountries, setAllCountries] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [data, setData] = useState({
    firstname: userData.firstname || "",
    lastname: userData.lastname || "",
    phone: userData.phone || "",
    email: userData.email || "",
    gender: userData.gender || "",
    dob: userData.dob || "",
    country: userData.country || "",
    state: userData.state || "",
    city: userData.city || "",
    address: userData.address || "",
  });

  console.log(data);
  console.log(userData);

  const getAllCountries = async () => {
    try {
      const res = await axios.get(
        `https://api.countrystatecity.in/v1/countries`,
        {
          headers: {
            "X-CSCAPI-KEY":
              "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==",
          },
        }
      );

      setAllCountries(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const countryFilter = allCountries?.filter((country) => {
    if (data.country === userData.country) {
      return country.name === userData.country;
    } else {
      return country.name === data.country;
    }
  });

  console.log(countryFilter[0]?.iso2);

  const getAllStates = async () => {
    try {
      const res = await axios.get(
        `https://api.countrystatecity.in/v1/countries/${countryFilter[0]?.iso2}/states`,
        {
          headers: {
            "X-CSCAPI-KEY":
              "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==",
          },
        }
      );

      setAllStates(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterCities = allStates?.filter((state) => {
    if (data.state === userData.state) {
      return state.name === userData.state;
    } else {
      return state.name === data.state;
    }
  });

  console.log(filterCities);

  const getAllCities = async () => {
    try {
      const res = await axios.get(
        `https://api.countrystatecity.in/v1/countries/${countryFilter[0]?.iso2}/states/${filterCities[0]?.iso2}/cities`,
        {
          headers: {
            "X-CSCAPI-KEY":
              "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==",
          },
        }
      );

      setAllCities(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(allCountries);
  console.log(allStates);
  console.log(allCities);

  useEffect(() => {
    getAllCountries();
  }, []);

  useEffect(() => {
    getAllStates();
  }, [countryFilter]);

  useEffect(() => {
    getAllCities();
  }, [filterCities]);

  // const allCountries = Object.keys(countryToStatesMap);

  const getUserViaId = async () => {
    try {
      const response = await axios.get(
        `https://admin.bigbulls.co.in/api/v1/auth/getUserViaId/${uid}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response.data);
      setUserData(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserViaId();
  }, [uid]);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setData((prevEmpData) => ({
          ...prevEmpData,
          [name]: value,
        }));
      }
    } else {
      setData({ ...data, [name]: value });
    }
  };

  console.log(data);

  const updateUserProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `https://admin.bigbulls.co.in/api/v1/auth/users/${uid}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.data.success) {
        cogoToast.success("User details updated successfully");
        setLoading(false);
        navigate("/manageusers");
      } else {
        toast.error("Failed to update user details");
        setLoading(false);
      }
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    console.log(date);
    setData((prevData) => ({
      ...prevData,
      dob: date,
    }));
  };

  const formattedDate = userData.dob
    ? userData.dob.toString().split("T")[0]
    : "";
  console.log(userData);
  console.log(data);

  console.log(formattedDate);

  useEffect(() => {
    setData({
      firstname: userData.firstname,
      lastname: userData.lastname,
      phone: userData.phone,
      email: userData.email,
      gender: userData.gender,
      dob: userData.dob,
      country: userData.country,
      state: userData.state,
      city: userData.city,
      address: userData.address,
    });
  }, [userData]);

  const goBack = () => {
    window.history.go(-1);
  };

  return (
    <>
      <Container>
        <div className="user-profile paddingtop">
          <div className="head-main">Update User Data</div>
          <div className="container-fluid mt-4">
            <button className="btn btn-success backbtn" onClick={goBack}>
              <IoMdArrowRoundBack /> Back
            </button>
            {/* <Card /> */}
          </div>
          <div className="userprofile-container">
            <form onSubmit={updateUserProfile}>
              <div className="row g-2">
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                  <div className="content-half">
                    <label className="form-label">Firstname</label>
                    <input
                      type="text"
                      name="firstname"
                      value={data.firstname}
                      className="form-control"
                      onChange={handleInputs}
                      placeholder={userData.firstname}
                    />
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                  <div className="content-half">
                    <label className="form-label">Lastname</label>
                    <input
                      type="text"
                      name="lastname"
                      value={data.lastname}
                      className="form-control"
                      onChange={handleInputs}
                      placeholder={userData.lastname}
                    />
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                  <div className="content-half">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={data.phone}
                      onChange={handleInputs}
                      className="form-control"
                      placeholder={userData.phone}
                      maxLength={10}
                    />
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                  {" "}
                  <div className="content-half">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={data.email}
                      className="form-control"
                      onChange={handleInputs}
                      placeholder={userData.email}
                    />
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                  <div className="content-half">
                    <label className="form-label">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      className="form-control"
                      defaultValue={data.gender}
                      onChange={handleInputs}
                      placeholder={userData.gender}
                    >
                      <option disabled>{userData.gender}</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                  <div className="content-half">
                    <label className="form-label">
                      DOB - <span className="text-danger">{userData.dob}</span>
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      onChange={handleInputs}
                      name="dob"
                      value={data.dob}
                    />

                    {/* <DatePicker
                    selected={data.dob}
                    onChange={(date) => handleDateChange(date)}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    placeholderText={formattedDate}
                    // value={formattedDate}
                    placeholder={formattedDate}
                    showMonthDropdown={true}
                    showYearDropdown={true}
                    scrollableYearDropdown={false}
                  /> */}
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                  <div className="content-half">
                    <label className="form-label">Select Country</label>
                    <select
                      id="country"
                      name="country"
                      value={data.country}
                      onChange={handleInputs}
                      placeholder={userData.country}
                      className="form-control"
                    >
                      <option value="">{userData.country}</option>
                      {allCountries.map((country) => (
                        <option key={country.name} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                  <div className="content-half">
                    <label className="form-label">Select State</label>
                    <select
                      id="state"
                      name="state"
                      value={data.state}
                      onChange={handleInputs}
                      placeholder={userData.state}
                      className="form-control"
                      disabled={!data.country}
                    >
                      <option value="">{userData.state}</option>
                      {allStates.map((state) => (
                        <option key={state.name} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                  <div className="content-half">
                    <label className="form-label">Enter City</label>
                    <select
                      name="city"
                      value={data.city}
                      onChange={handleInputs}
                      placeholder={userData.city}
                      className="form-control"
                      disabled={!data.country && !data.state}
                    >
                      <option value="">{userData.city}</option>
                      {allCities.map((state) => (
                        <option key={state.name} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  {" "}
                  <div className="contentfullwidth mt-3">
                    <label className="form-label">Address</label>
                    <textarea
                      name="address"
                      defaultValue={data.address}
                      onChange={handleInputs}
                      className="form-control"
                      placeholder={userData.address}
                    />
                  </div>
                </div>
              </div>

              <div className="">
                <button
                  className="btn btn-danger bg-dark mt-2"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Save Changes..." : "Save Changes"}
                </button>
                {/* <button onClick={Deleteuser}>Delete User</button> */}
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </Container>
    </>
  );
};

export default EditUserpage;
const Container = styled.div`
  .backbtn {
    display: flex;
    align-items: center;
    gap: 4px;
    background-color: #000;
  }

  .paddingtop {
    padding-top: 7rem;
    @media screen and (max-width: 600px) {
      padding-top: 10rem;
    }
  }

  .user-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .userprofile-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      width: 100%;
      height: 100%;
      /* background-color: aqua; */
    }
    form {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      background-color: white;
      /* width: 50%; */
      padding: 20px;
      box-shadow: 0px 0px 10px gray;
      border-radius: 10px;
      margin: 20px;
    }
  }
`;
