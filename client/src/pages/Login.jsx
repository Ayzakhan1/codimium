import { useState } from "react";
import axios from "axios";
import crmImage from "../assets/img.jpeg";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

     if (isRegister) {
    register();
  } else {
    login();
  }
}
   
  };
  const register = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
      );

      console.log("Register Response:", response.data);

      alert("Registration successful!");
    } catch (error) {
      console.log("Register Error:", error);

      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const login = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
      );

      console.log("Login Response:", response.data);

      localStorage.setItem("token", response.data.auth);

      localStorage.setItem("user", JSON.stringify(response.data.data));

      alert("Login successful!");
    } catch (error) {
      console.log("Login Error:", error);

      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* ================= LEFT SIDE ================= */}
      <div className="hidden lg:block lg:w-[60%] relative overflow-hidden">
        <img
          src={crmImage}
          alt="CRM Dashboard"
          className="w-full h-full object-contain"
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-black/35"></div>

        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">
            Manage Your Business Smarter
          </h1>

          <p className="text-lg text-white/90 max-w-xl leading-relaxed">
            Manage customers, projects, employees and your business operations
            from one powerful CRM platform.
          </p>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="w-full lg:w-[40%] flex items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-md">
          {/* Logo / Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white text-2xl font-bold mb-5 shadow-lg shadow-indigo-200">
              C
            </div>

            <h2 className="text-3xl font-bold text-slate-900">
              {isRegister ? "Create Your Account" : "Welcome Back"}
            </h2>

            <p className="mt-2 text-slate-500">
              {isRegister
                ? "Create an account to start using your CRM"
                : "Login to your CRM account"}
            </p>
          </div>

          {/* ================= FORM ================= */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Name - Register Only */}
            {isRegister && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="
                    w-full px-4 py-3.5
                    border border-slate-300
                    rounded-xl
                    outline-none
                    text-slate-800
                    placeholder:text-slate-400
                    transition-all duration-200
                    hover:border-indigo-400
                    focus:border-indigo-600
                    focus:ring-4 focus:ring-indigo-100
                  "
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="
                  w-full px-4 py-3.5
                  border border-slate-300
                  rounded-xl
                  outline-none
                  text-slate-800
                  placeholder:text-slate-400
                  transition-all duration-200
                  hover:border-indigo-400
                  focus:border-indigo-600
                  focus:ring-4 focus:ring-indigo-100
                "
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>

                {!isRegister && (
                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="
                  w-full px-4 py-3.5
                  border border-slate-300
                  rounded-xl
                  outline-none
                  text-slate-800
                  placeholder:text-slate-400
                  transition-all duration-200
                  hover:border-indigo-400
                  focus:border-indigo-600
                  focus:ring-4 focus:ring-indigo-100
                "
              />
            </div>

            {/* Confirm Password */}
            {isRegister && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="
                    w-full px-4 py-3.5
                    border border-slate-300
                    rounded-xl
                    outline-none
                    text-slate-800
                    placeholder:text-slate-400
                    transition-all duration-200
                    hover:border-indigo-400
                    focus:border-indigo-600
                    focus:ring-4 focus:ring-indigo-100
                  "
                />
              </div>
            )}

            {/* Remember Me */}
            {!isRegister && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="
                    w-4 h-4
                    accent-indigo-600
                    cursor-pointer
                  "
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="
                w-full
                py-3.5
                px-4
                rounded-xl
                bg-indigo-600
                hover:bg-indigo-700
                active:bg-indigo-800
                text-white
                font-semibold
                text-base
                shadow-lg
                shadow-indigo-200
                hover:shadow-xl
                hover:shadow-indigo-300
                hover:-translate-y-0.5
                active:translate-y-0
                transition-all
                duration-200
                cursor-pointer
              "
            >
              {isRegister ? "Create Account" : "Login"}
            </button>
          </form>

          {/* ================= SWITCH ================= */}
          <div className="flex items-center gap-3 my-7">
            <div className="h-px bg-slate-200 flex-1"></div>

            <span className="text-sm text-slate-400">OR</span>

            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="text-center text-sm text-slate-600">
            {isRegister ? "Already have an account?" : "Don't have an account?"}

            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);

                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                });
              }}
              className="
                ml-2
                font-semibold
                text-indigo-600
                hover:text-indigo-800
                hover:underline
                transition
                cursor-pointer
              "
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
