import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsCheckCircleFill } from "react-icons/bs";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        toastr.clear();
        toastr.options = {
            closeButton: true,
            timeOut: 1200,
        };

        if (!otp) {
            toastr.error("Please enter the OTP!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/verify-otp", { otp });
            toastr.options = {
                closeButton: true,
                timeOut: 1000,
                onHidden: function () {
                    // window.location.href = `/resetpassword?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;
                    window.location.href = "/resetpassword";
                },
            };
            toastr.success(response.data.message);
            setOtp(""); 
            // Redirect to reset password page or home page
        } catch (error) {
            if (error.response) {
                toastr.error(error.response.data.message || "Verification failed!");
            } else {
                toastr.error("Server error!");
            }
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
                <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
                    <Link to="/">
                        <img src={"images/logoLight.png"} alt="logoImg" className="w-28 mr-4" />
                    </Link>
                    <div className="flex flex-col gap-1 -mt-1">
                        <h1 className="font-titleFont text-xl font-medium">Stay signed in for more</h1>
                        <p className="text-base">When you sign in, you are with us!</p>
                    </div>
                    
                    {/* Additional Information Section */}
                    <div className="w-[300px] flex items-start gap-3">
                        <span className="text-green-500 mt-1">
                            <BsCheckCircleFill />
                        </span>
                        <p className="text-base text-gray-300">
                            <span className="text-white font-semibold font-titleFont">Get started fast with ASTAL</span>
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

                    {/* Additional features can be added here as needed */}
                    <div className="flex items-center justify-between mt-10">
                        <Link to="/">
                            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">© ASTAL</p>
                        </Link>
                        <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Terms</p>
                        <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Privacy</p>
                        <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Security</p>
                    </div>
                </div>
            </div>

            {/* Form Section for Forgot Password */}
            <div className="w-full lgl:w-1/2 h-full">
                <form onSubmit={handleVerifyOTP} className="w-full lgl:w-[450px] h-screen flex items-center justify-center">
                    <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
                        <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold mdl:text-3xl mb-4">Verify OTP</h1>
                        <div className="flex flex-col gap-3">
                            {/* OTP Input */}
                            <div className="flex flex-col gap-.5">
                                <p className="font-titleFont text-base font-semibold text-gray-600 mb-1">Your OTP</p>
                                <input
                                    onChange={(e) => setOtp(e.target.value)}
                                    value={otp}
                                    className="w-full h-10 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                                    type="text"
                                    placeholder="Enter your OTP"
                                    required
                                />
                            </div>
                            {/* Submit Button */}
                            <button type="submit" className="bg-primeColor hover:bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md duration-300 mt-4">
                                Verify
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;