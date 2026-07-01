import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import deliveryboy from "../assets/images/contact-us.webp";
import api from "../config/api.config";

const ContactUs = () => {
  const navigate = useNavigate();

  const [contactData, setContactData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [validateError, setValidateError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setContactData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !contactData.fullName ||
      !contactData.email ||
      !contactData.phone ||
      !contactData.subject ||
      !contactData.message
    ) {
      setValidateError("All fields are required");
      return;
    }

    setValidateError("");

    const payload = {
      fullName: contactData.fullName,
      email: contactData.email.toLowerCase(),
      phone: contactData.phone,
      subject: contactData.subject,
      message: contactData.message,
    };

    try {
      const res = await api.post("/public/contact-us", payload);

      console.log("Response:", res.data);

      setSuccessMessage(
        "Thank you for contacting us! We'll get back to you soon."
      );

      setContactData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (error) {
      console.log("Error:", error);

      setValidateError(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const inputClass =
    "border p-2 rounded focus:outline-none focus:ring-2";

  return (
    <div className="min-h-[90vh] bg-linear-to-r from-(--secondary) to-(--primary) grid grid-cols-2 p-10">
      
      <div className="hidden md:block">
        <img src={deliveryboy} alt="delivery-boy" />
      </div>

      <div className="w-2xl bg-(--background) rounded shadow p-10 flex flex-col justify-center">
        <div className="text-xl font-semibold mb-4">
          Contact Us
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          <div className="flex flex-col gap-2">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={contactData.fullName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={contactData.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={contactData.phone}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={contactData.subject}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="col-span-2 flex flex-col gap-2">
            <label>Message</label>
            <textarea
              name="message"
              value={contactData.message}
              onChange={handleChange}
              rows="5"
              className={inputClass}
            />
          </div>

          {validateError && (
            <p className="text-red-500 col-span-2">
              {validateError}
            </p>
          )}

          {successMessage && (
            <p className="text-green-500 col-span-2">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            className="col-span-2 bg-blue-500 text-white p-2 rounded"
          >
            Send Message
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="mr-4"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;