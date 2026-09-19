import { useState } from "react";
import axios from "axios";
import crmImage from "../assets/img.jpeg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const nav = useNavigate();

  //================= CHECK TOKEN =================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      nav("/dashboard");
    }
  }, [nav]);
  
  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Remove error while typing
    setErrors({
      ...errors,
      [name]: "",
      general: "",
    });
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    const newErrors = {};

    // Name validation - Register only
    if (isRegister) {
      const name = formData.name.trim();

      if (!name) {
        newErrors.name = "Full name is required";
      } else if (name.length < 3) {
        newErrors.name = "Name must be at least 3 characters";
      }
    }

    // Email validation
    const email = formData.email.trim();

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    const password = formData.password;

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number";
    }

    // Confirm password - Register only
    if (isRegister) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    if (isRegister) {
      await register();
    } else {
      await login();
    }
  };

  // ================= REGISTER =================
  const register = async () => {
    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("Register Response:", response.data);

      alert("Registration successful!");

      // Switch to login
      setIsRegister(false);

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setErrors({});
    } catch (error) {
      console.log("Register Error:", error);

      setErrors({
        general:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN =================
  const login = async () => {
    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("Login Response:", response.data);

      // Save token
      localStorage.setItem("token", response.data.auth);

      // Save user
      localStorage.setItem("user", JSON.stringify(response.data.data));

      alert("Login successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setErrors({});
    } catch (error) {
      console.log("Login Error:", error);

      setErrors({
        general:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= SWITCH LOGIN / REGISTER =================
  const switchMode = () => {
    setIsRegister(!isRegister);

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setErrors({});
  };

  //   const logout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");

  //   window.location.href = "/login";
  // };

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
          {/* ================= LOGO / HEADING ================= */}
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

          {/* ================= GENERAL ERROR ================= */}
          {errors.general && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {errors.general}
            </div>
          )}

          {/* ================= FORM ================= */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ================= NAME ================= */}
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
                  className={`w-full px-4 py-3.5 border rounded-xl outline-none text-slate-800 placeholder:text-slate-400 transition-all duration-200 ${
                    errors.name
                      ? "border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-300 hover:border-indigo-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  }`}
                />

                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
            )}

            {/* ================= EMAIL ================= */}
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
                className={`w-full px-4 py-3.5 border rounded-xl outline-none text-slate-800 placeholder:text-slate-400 transition-all duration-200 ${
                  errors.email
                    ? "border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-slate-300 hover:border-indigo-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                }`}
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* ================= PASSWORD ================= */}
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
                className={`w-full px-4 py-3.5 border rounded-xl outline-none text-slate-800 placeholder:text-slate-400 transition-all duration-200 ${
                  errors.password
                    ? "border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-slate-300 hover:border-indigo-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                }`}
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* ================= CONFIRM PASSWORD ================= */}
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
                  className={`w-full px-4 py-3.5 border rounded-xl outline-none text-slate-800 placeholder:text-slate-400 transition-all duration-200 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-300 hover:border-indigo-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  }`}
                />

                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* ================= REMEMBER ME ================= */}
            {!isRegister && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
            )}

            {/* ================= SUBMIT BUTTON ================= */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold text-base shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              {loading
                ? "Please wait..."
                : isRegister
                  ? "Create Account"
                  : "Login"}
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
              onClick={switchMode}
              className="ml-2 font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition cursor-pointer"
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
