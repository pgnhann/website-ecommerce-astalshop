import React, { useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [checked, setChecked] = useState(false);

  const [errName, setErrName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPhone, setErrPhone] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errAddress, setErrAddress] = useState("");
  const [errState, setErrState] = useState("");


  const handleName = (e) => {
    setName(e.target.value);
    setErrName("");
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
    setErrPhone("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };
  const handleAddress = (e) => {
    setAddress(e.target.value);
    setErrAddress("");
  };
  const handleState = (e) => {
    setState(e.target.value);
    setErrState("");
  };

  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };
  
  const PhoneValidation = (phone) => {
    return String(phone).match(
      /^(\(\d{3}\)\s?|\d{3}-)?\d{3}-\d{4}$|^\d{10}$/
    );
  };


  const handleSignUp = async (e) => {
    e.preventDefault();

    setErrName("");
    setErrEmail("");
    setErrPhone("");
    setErrPassword("");
    setErrAddress("");
    setErrState("");

    let hasError = false;

    if (!name) {
      setErrName("Enter your name!");
      hasError = true;
    }

    if (!email) {
      setErrEmail("Enter your email!");
      hasError = true;
    } else if (!EmailValidation(email)) {
      setErrEmail("Enter a valid email!");
      hasError = true;
    }

    if (!phone) {
      setErrPhone("Enter your phone number!");
      hasError = true;
    } else if (!PhoneValidation(phone)) {
      setErrPhone("Enter a valid phone number!");
      hasError = true;
    }

    if (!password) {
      setErrPassword("Create a password!");
      hasError = true;
    } else if (password.length < 6) {
      setErrPassword("Passwords must be at least 6 characters!");
      hasError = true;
    }

    if (!address) {
      setErrAddress("Enter your address!");
      hasError = true;
    }

    if (!state) {
      setErrState("Enter your state!");
      hasError = true;
    }

    if (hasError || !checked) {
      toastr.options = {
        closeButton: true,
        timeOut: 1200,
      };

      if (hasError) {
        toastr.error("Please fill in all required information!", "");
      }

      if (!checked) {
        toastr.warning("Please agree to the terms and conditions!", "");
      }

      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        name,
        email,
        phone,
        password,
        address,
        state,
      });

      toastr.options = {
        closeButton: true,
        timeOut: 500,
        onHidden: function () {
          window.location.href = "/signin";
        },
      };

      toastr.success(response.data.message, "");

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setAddress("");
      setState("");
      setChecked(false);

    } catch (error) {
      toastr.options = {
        progressBar: true,
        closeButton: true,
        timeOut: 2000,
      };

      if (error.response && error.response.data.error) {
        toastr.error(error.response.data.error, "Error");
      } else {
        toastr.error("Server error!", "Error");
      }
    }
  };

return (
  <div className="w-full h-screen flex items-center justify-start">
      <div className="w-1/3 hidden lgl:inline-flex h-full text-white">
          <div className="w-[500px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
              <Link to="/">
                  <img src={'images/logoLight.png'} alt="logoImg" className="w-28" />
              </Link>
              <div className="flex flex-col gap-1 -mt-1">
                  <h1 className="font-titleFont text-xl font-medium">Get started for free</h1>
                  <p className="text-base">Create your account to access more!</p>
              </div>
              <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Get started fast with ASTAL
              </span>
              <br />
              Sign up today and unlock exclusive features designed to enhance your shopping experience.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Access all ASTAL services
              </span>
              <br />
              Enjoy exclusive access to member-only promotions and services tailored just for you.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Trusted by online Shoppers
              </span>
              <br />
              Join thousands of satisfied customers who trust us for their online shopping needs.
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              © ASTAL
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Terms
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Privacy
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Security
            </p>
          </div>
        </div>
      </div>

      {/* Phần bên phải - Form Đăng Ký */}
      <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
          {/* Form Đăng Ký */}
          <form className="w-full lgl:w-[600px] h-screen flex items-center justify-center ml-4">
              <div className="px-6 py-4 w-full h-[96%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
                  <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-2xl mdl:text-3xl mb-4">Create your account</h1>
                  <div className="flex flex-col gap-3">
                    {/* client name */}
                    <div className="flex flex-col gap-.5">
                      <p className="font-titleFont text-base font-semibold text-gray-600">
                        Full Name
                      </p>
                      <input
                        onChange={handleName}
                        value={name}
                        className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                        type="text"
                        placeholder="eg. Jess Anleza"
                      />
                      {errName && (
                        <p className="text-sm text-red-500 font-titleFont font-semibold px-4 mt-1">
                          {errName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-.5">
                      <p className="font-titleFont text-base font-semibold text-gray-600">
                        Email
                      </p>
                      <input
                        onChange={handleEmail}
                        value={email}
                        className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                        type="email"
                        placeholder="anlezajess98@email.com"
                      />
                      {errEmail && (
                        <p className="text-sm text-red-500 font-titleFont font-semibold px-4 mt-1">
                          {errEmail}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                      <div className="flex flex-col gap-.5">
                        <p className="font-titleFont text-base font-semibold text-gray-600">
                          Phone Number
                        </p>
                        <input
                          onChange={handlePhone}
                          value={phone}
                          className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                          type="text"
                          placeholder="08431163812"
                        />
                        {errPhone && (
                          <p className="text-sm text-red-500 font-titleFont font-semibold px-4 mt-1">
                            {errPhone}
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="flex flex-col gap-.5">
                        <p className="font-titleFont text-base font-semibold text-gray-600">
                          Password
                        </p>
                        <input
                          onChange={handlePassword}
                          value={password}
                          className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                          type="password"
                          placeholder="Create password"
                        />
                        {errPassword && (
                          <p className="text-sm text-red-500 font-titleFont font-semibold px-4 mt-1">
                            {errPassword}
                          </p>
                        )}
                      </div>

                      {/* State */}
                      <div className="flex flex-col gap-.5">
                        <p className="font-titleFont text-base font-semibold text-gray-600"> State </p>
                        <input
                          className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                          type="text"
                          value={state}
                          onChange={handleState}
                          placeholder="Your State"
                        />
                        {errState && (<p className="text-sm text-red-500 font-titleFont font-semibold px-4 mt-1">{errState}</p>)}
                      </div>

                      {/* Address */}
                      <div className="flex flex-col gap-.5">
                        <p className="font-titleFont text-base font-semibold text-gray-600"> Address </p>
                        <input
                          className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                          type="text"
                          value={address}
                          onChange={handleAddress}
                          placeholder="House number, street name"
                        />
                        {errAddress && (<p className="text-sm text-red-500 font-titleFont font-semibold px-4 mt-1">{errAddress}</p>)}
                      </div>

                      {/* Checkbox */}
                      <div className="flex items-start mdl:items-center gap-2 mb-2">
                        <input
                          onChange={() => setChecked(!checked)}
                          className="w-4 h-4 mt-1 mdl:mt-0 cursor-pointer"
                          type="checkbox"
                        />
                        <p className="text-sm text-primeColor">
                          I agree to the ASTAL{" "}
                          <span className="text-blue-500">Terms of Service </span>and{" "}
                          <span className="text-blue-500">Privacy Policy</span>.
                        </p>
                      </div>
                  </div>

                  
                  <button onClick={handleSignUp} className={`${ checked ? "bg-primeColor hover:bg-black hover:text-white cursor-pointer" : "bg-gray-500 hover:bg-gray-500 hover:text-gray-200 cursor-none" } 
                    w-full text-gray-200 text-base font-medium h-10 rounded-md hover:text-white duration-300 mb-2`}>
                      Create Account
                  </button>

               
                  <p className="text-sm text-center font-titleFont font-medium">Have an Account?{" "}
                      <Link to="/signin">
                          <span className="hover:text-blue-600 duration-300">Sign In</span>
                      </Link>
                  </p>
              </div>
          </form>
      </div>


        {/* Google & Facebook */}
        <div className="ml-44 w-full lgl:w-[400px] h-full flex flex-col justify-center">
          <div className="flex flex-col items-center">
              <p className="font-titleFont text-base font-semibold text-gray-600">Or sign up with</p>
              <div className="flex flex-col gap-2 mt-2 w-full">
              <button 
                className="flex items-center justify-center bg-red-600 text-white rounded-md w-full h-10 hover:bg-red-700 duration-300 mb-2"
                onClick={() => window.open("http://localhost:5000/services/auth/google", "_self")}
              >
                      <FaGoogle className="mr-2" /> 
                      Google
                  </button>
                  {/* <button className="flex items-center justify-center bg-blue-600 text-white rounded-md w-full h-10 hover:bg-blue-700 duration-300"
                   onClick={() => window.open("http://localhost:5000/services/auth/facebook", "_self")}
                  >
                      <FaFacebook className="mr-2" /> 
                      Facebook
                  </button> */}
              </div>
          </div>
        </div>


  </div>
);
};

export default SignUp;