import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import deliveryboy from "../assets/deliberyboy.png";
import api from "../config/api.config";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [validateError, setValidateError] = useState("");

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });

    setValidateError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!loginData.email || !loginData.password) {
      setValidateError("Please fill all fields");
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      email: loginData.email.toLowerCase(),
      password: loginData.password,
    };

    try {
      const res = await api.post("/auth/login", payload);

      toast.success(
        res?.data?.message || "Login successful"
      );

      sessionStorage.setItem(
        "UserData",
        JSON.stringify(res?.data?.data)
      );

      // Delay navigation so toast is visible
      setTimeout(() => {
        navigate("/user/dashboard");
      }, 1200);

    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(errorMessage);
    }
  };

  const inputClass =
    "border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-[90vh] bg-linear-to-r from-(--secondary) to-(--primary) grid md:grid-cols-2 p-10">

      {/* Left Image */}
      <div className="hidden md:flex items-center justify-center">
        <img
          src={deliveryboy}
          alt="delivery boy"
          className="rotate-y-180 w-[80%]"
        />
      </div>

      {/* Login Form */}
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-10 flex flex-col justify-center">

        <h1 className="text-3xl font-bold mb-2">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500 mb-6">
          Login to continue
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4"
        >
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {validateError && (
            <p className="text-red-500 text-sm">
              {validateError}
            </p>
          )}

          <button
            type="submit"
            className="bg-(--primary) text-white py-3 rounded-lg hover:bg-(--accent) transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-(--primary) font-semibold hover:underline"
            >
              Register here
            </button>
          </p>

          <p>
            Having Trouble?{" "}
            <button
              onClick={() => navigate("/contact")}
              className="text-(--primary) font-semibold hover:underline"
            >
              Contact Us
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;