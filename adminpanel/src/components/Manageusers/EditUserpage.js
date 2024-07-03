import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EditUserpage.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import styled from "styled-components";

const EditUserpage = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);
  const { uid } = useParams();
  let navigate = useNavigate();
  const [useractive, setUseractive] = useState();
  const [allCountries, setAllCountries] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [userData, setUserData] = useState([]);
  const [data, setData] = useState({
    name: userData.name || "",
    phone: userData.phone || "",
    email: userData.email || "",
    gender: userData.gender || "",
    dob: userData.dob || "",
    country: userData.country || "",
    state: userData.state || "",
    city: userData.city || "",
    address: userData.address || "",
  });

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
    if (data.country === "") {
      return country.name === userData.country;
    } else {
      return country.name === data.country;
    }
  });

  console.log(countryFilter);

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
    if (data.state === "") {
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
  }, [data.country]);

  useEffect(() => {
    getAllCities();
  }, [data.state]);

  // const allCountries = Object.keys(countryToStatesMap);

  const getUserViaId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6060/api/v1/auth/getUserViaId/${uid}`,
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
    try {
      const response = await axios.put(
        `http://localhost:6060/api/v1/auth/users/${uid}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("User details updated successfully");
        navigate("/manageusers");
      } else {
        toast.error("Failed to update user details");
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
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
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      gender: userData.gender,
      dob: "",
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
        <div className="user-profile">
          <Navbar />
          <div className="head-main">Update User Data</div>
          <div className="container-fluid mt-4">
            <button className="btn btn-success backbtn" onClick={goBack}>
              <IoMdArrowRoundBack /> Back
            </button>
            {/* <Card /> */}
          </div>
          <div className="userprofile-container">
            <form onSubmit={updateUserProfile}>
              <div className="content-half">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleInputs}
                  placeholder={userData.name}
                />
              </div>

              <div className="content-half">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={data.phone}
                  onChange={handleInputs}
                  placeholder={userData.phone}
                  maxLength={10}
                />
              </div>

              <div className="content-half">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleInputs}
                  placeholder={userData.email}
                />
              </div>
              <div className="content-half">
                <label>Gender</label>
                <select
                  id="gender"
                  name="gender"
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
              <div className="content-half">
                <label>DOB</label>
                {/* <small>Current DOB : {userData.dob}</small> */}
                <DatePicker
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
                />
              </div>
              <div className="content-half">
                <label>Select Country</label>
                <select
                  id="country"
                  name="country"
                  value={data.country}
                  onChange={handleInputs}
                  placeholder={userData.country}
                  className="inputsel"
                >
                  <option value="">{userData.country}</option>
                  {allCountries.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="content-half">
                <label>Select State</label>
                <select
                  id="state"
                  name="state"
                  value={data.state}
                  onChange={handleInputs}
                  placeholder={userData.state}
                  className="inputsel"
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
              <div className="content-half">
                <label>Enter City</label>
                {/* <input
                  name="city"
                  value={data.city}
                  onChange={handleInputs}
                  placeholder={userData.city}
                /> */}

                <select
                  name="city"
                  value={data.city}
                  onChange={handleInputs}
                  placeholder={userData.city}
                  className="inputsel"
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
              <div className="contentfullwidth mt-3">
                <label>Address</label>
                <textarea
                  name="address"
                  defaultValue={data.address}
                  onChange={handleInputs}
                  placeholder={userData.address}
                />
              </div>

              <div className="btn-group">
                <button type="submit">Save Changes</button>
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
`;