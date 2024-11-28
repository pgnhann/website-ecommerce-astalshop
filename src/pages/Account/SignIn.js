import React, { useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    toastr.clear();
  
    toastr.options = {
      closeButton: true,
      timeOut: 1000,
    };
  
    if (!email) {
      toastr.error("Enter your email!", "");
      return;
    }
  
    if (!password) {
      toastr.error("Enter your password!", "");
      return;
    }
    
    try {
      const response = await axios.post("http://localhost:5000/signin",
        { email, password, rememberMe },
        { withCredentials: true } // Đảm bảo thêm `withCredentials`
      );

      const { fullname, message,  email: responseEmail, role} = response.data;

      localStorage.setItem("fullname", fullname);
      localStorage.setItem("email", responseEmail);
      localStorage.setItem("role", role);

      toastr.success(message, "");
      setTimeout(() => {
        if (role === 0) {
            window.location.href = "/";
        } else if (role === 1 || role === 2) {
            window.location.href = "/admin";
        }
    }, 1200);

      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.response) {
        const errorMessages = error.response.data.errors || {};
  
        toastr.options = {
          progressBar: true,
          closeButton: true,
          timeOut: 1000,
        };
  
        if (errorMessages.email && errorMessages.password) {
          toastr.error("Both email and password are invalid!", "");
        } else if (errorMessages.email) {
          toastr.error(errorMessages.email, "");
        } else if (errorMessages.password) {
          toastr.error(errorMessages.password, "");
        }
      } else {
        toastr.error("Server error!", "");
      }
    }
  };
  
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[500px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <img src={"images/logoLight.png"} alt="logoImg" className="w-28 mr-4" />
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">
              Stay signed in for more
            </h1>
            <p className="text-base">When you sign in, you are with us!</p>
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
              Our user-friendly interface ensures that you can navigate easily and find what you need in no time.
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
              Manage your account, track orders, and explore new products effortlessly.
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
            <Link to="/">
              <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
                © ASTAL
              </p>
            </Link>
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

      <div className="w-full lgl:w-1/2 h-full">
        <form onSubmit={handleSignIn} className="w-full lgl:w-[450px] h-screen flex items-center justify-center">
          <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
            <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">
              Sign In
            </h1>
            <div className="flex flex-col gap-3">
              {/* Email */}
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600"> Email </p>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="email"
                  placeholder="Your email"
                />
              </div>
              {/* Password */}
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600"> Password </p>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="password"
                  placeholder="Your password"
                />
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-1 text-gray-600 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="cursor-pointer mr-1"
                  />
                   Remember me
                </label>
                <Link to="/forgotpassword" className="text-sm hover:text-blue-600 duration-300">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="bg-primeColor hover:bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md duration-300"
              >
                Sign In
              </button>
              <p className="text-sm text-center font-titleFont font-medium">
                Don't have an Account?{" "}
                <Link to="/signup">
                  <span className="hover:text-blue-600 duration-300"> Sign Up </span>
                </Link>
              </p>

                {/* Google & Facebook */}
                <div className="flex flex-col items-center">
                    <p className="font-titleFont text-base font-semibold text-gray-600">Or sign in with</p>
                    <div className="flex flex-col gap-2 mt-2 w-full">
                    <button 
                      className="flex items-center justify-center bg-red-600 text-white rounded-md w-full h-10 hover:bg-red-700 duration-300"
                      onClick={() => window.open("http://localhost:5000/services/auth/google", "_self")}
                    >
                            <FaGoogle className="mr-2" /> 
                            Google
                        </button>
                        {/* <button className="flex items-center justify-center bg-blue-600 text-white rounded-md w-full h-10 hover:bg-blue-700 duration-300">
                            <FaFacebook className="mr-2" /> 
                            Facebook
                        </button> */}
                    </div>
                </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
