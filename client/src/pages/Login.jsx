import { useState, useEffect } from "react";
import axios from "axios";
import crmImage from "../assets/img.jpeg";
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

  // ================= CHECK TOKEN =================

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (token && user) {
      if (user.role === "admin") {
        nav("/admin/dashboard");
      } else if (user.role === "team_member") {
        nav("/user/dashboard");
      }
    }
  }, [nav]);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
      general: "",
    });
  };

  // ================= VALIDATION =================

  const validateForm = () => {
    const newErrors = {};

    if (isRegister) {
      const name = formData.name.trim();

      if (!name) {
        newErrors.name = "Full name is required";
      } else if (name.length < 3) {
        newErrors.name = "Name must be at least 3 characters";
      }
    }

    const email = formData.email.trim();

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

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
    localStorage.setItem("user", JSON.stringify(response.data.user));

    // Clear form and errors
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setErrors({});

    // Redirect according to role
    if (response.data.user.role === "admin") {
      nav("/admin/dashboard", { replace: true });
    } else if (response.data.user.role === "team_member") {
      nav("/user/dashboard", { replace: true });
    } else {
      setErrors({
        general: "User role is not recognized.",
      });
    }
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

  return (
    <div className="min-h-screen flex bg-background">
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

      <div className="w-full lg:w-[40%] flex items-center justify-center px-6 py-10 bg-surface">
        <div className="w-full max-w-md">
          {/* ================= LOGO / HEADING ================= */}

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white text-2xl font-bold mb-5 shadow-lg">
              C
            </div>

            <h2 className="text-3xl font-bold text-ink">
              {isRegister ? "Create Your Account" : "Welcome Back"}
            </h2>

            <p className="mt-2 text-ink-muted">
              {isRegister
                ? "Create an account to start using your CRM"
                : "Login to your CRM account"}
            </p>
          </div>

          {/* ================= GENERAL ERROR ================= */}

          {errors.general && (
            <div className="mb-5 rounded-xl bg-red-50 border border-error px-4 py-3 text-sm text-error">
              {errors.general}
            </div>
          )}

          {/* ================= FORM ================= */}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ================= NAME ================= */}

            {isRegister && (
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3.5 border rounded-xl outline-none text-ink placeholder:text-ink-muted transition-all duration-200 ${
                    errors.name
                      ? "border-error focus:ring-4 focus:ring-red-100"
                      : "border-border hover:border-primary focus:border-primary focus:ring-4 focus:ring-sky-100"
                  }`}
                />

                {errors.name && (
                  <p className="mt-1 text-sm text-error">{errors.name}</p>
                )}
              </div>
            )}

            {/* ================= EMAIL ================= */}

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3.5 border rounded-xl outline-none text-ink placeholder:text-ink-muted transition-all duration-200 ${
                  errors.email
                    ? "border-error focus:ring-4 focus:ring-red-100"
                    : "border-border hover:border-primary focus:border-primary focus:ring-4 focus:ring-sky-100"
                }`}
              />

              {errors.email && (
                <p className="mt-1 text-sm text-error">{errors.email}</p>
              )}
            </div>

            {/* ================= PASSWORD ================= */}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-ink">
                  Password
                </label>

                {!isRegister && (
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:text-primary-hover transition"
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
                className={`w-full px-4 py-3.5 border rounded-xl outline-none text-ink placeholder:text-ink-muted transition-all duration-200 ${
                  errors.password
                    ? "border-error focus:ring-4 focus:ring-red-100"
                    : "border-border hover:border-primary focus:border-primary focus:ring-4 focus:ring-sky-100"
                }`}
              />

              {errors.password && (
                <p className="mt-1 text-sm text-error">{errors.password}</p>
              )}
            </div>

            {/* ================= CONFIRM PASSWORD ================= */}

            {isRegister && (
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3.5 border rounded-xl outline-none text-ink placeholder:text-ink-muted transition-all duration-200 ${
                    errors.confirmPassword
                      ? "border-error focus:ring-4 focus:ring-red-100"
                      : "border-border hover:border-primary focus:border-primary focus:ring-4 focus:ring-sky-100"
                  }`}
                />

                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-error">
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
                  className="w-4 h-4 accent-primary cursor-pointer"
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-ink-secondary cursor-pointer"
                >
                  Remember me
                </label>
              </div>
            )}

            {/* ================= SUBMIT BUTTON ================= */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary disabled:bg-primary-hover disabled:cursor-not-allowed text-white font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              {loading
                ? "Please wait..."
                : isRegister
                  ? "Create Account"
                  : "Login"}
            </button>
          </form>

          {/* ================= SWITCH DIVIDER ================= */}

          <div className="flex items-center gap-3 my-7">
            <div className="h-px bg-border flex-1"></div>

            <span className="text-sm text-ink-muted">OR</span>

            <div className="h-px bg-border flex-1"></div>
          </div>

          {/* ================= SWITCH LOGIN / REGISTER ================= */}

          <div className="text-center text-sm text-ink-secondary">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              type="button"
              onClick={switchMode}
              className="ml-2 font-semibold text-primary hover:text-primary-hover hover:underline transition cursor-pointer"
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
