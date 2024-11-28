import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../components/pageprops/breadcrumbs";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

const Contact = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  useEffect(() => {
    setPrevLocation(location.state?.data || "");
  }, [location]);

  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState("");

  const handleName = (e) => {
    setClientName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleMessages = (e) => {
    setMessages(e.target.value);
  };

  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  toastr.options = {
    closeButton: true,
    progressBar: true,
    timeOut: 2000,
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!clientName) {
      toastr.error("Enter your name!", "");
      return;
    }
    if (!email) {
      toastr.error("Enter your email!", "");
      return;
    } else if (!EmailValidation(email)) {
      toastr.error("Enter a valid email!", "");
      return;
    }
    if (!messages) {
      toastr.error("Enter your message!", "");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, email, messages }),
      });

      if (response.ok) {
        toastr.success(`Thank you ${clientName}, your message was sent successfully!`);
        setClientName("");
        setEmail("");
        setMessages("");
      } else {
        toastr.error("Failed to send your message. Please try again.");
      }
    } catch (error) {
      toastr.error("Network error. Please try again later.");
    }
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Contact" prevLocation={prevLocation} />
      <form className="pb-20">
        <h1 className="font-titleFont font-semibold text-3xl">
          Fill up a Form
        </h1>
        <div className="w-[500px] h-auto py-6 flex flex-col gap-6">
          <div>
            <p className="text-base font-titleFont font-semibold px-2">
              Name
            </p>
            <input
              onChange={handleName}
              value={clientName}
              className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
              type="text"
              placeholder="Enter your name here"
            />
          </div>
          <div>
            <p className="text-base font-titleFont font-semibold px-2">
              Email
            </p>
            <input
              onChange={handleEmail}
              value={email}
              className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
              type="email"
              placeholder="Enter your email here"
            />
          </div>
          <div>
            <p className="text-base font-titleFont font-semibold px-2">
              Messages
            </p>
            <textarea
              onChange={handleMessages}
              value={messages}
              cols="30"
              rows="3"
              className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor resize-none"
              placeholder="Enter your text here"
            ></textarea>
          </div>
          <button
            onClick={handleSend}
            type="submit"
            className="w-44 bg-primeColor text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:bg-black hover:text-white duration-200"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
