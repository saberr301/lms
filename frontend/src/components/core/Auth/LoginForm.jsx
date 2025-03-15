import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../services/operations/authAPI";
import loginBg from "../../../assets/Images/login0.png"; // Image d'arrière-plan
import logo from "../../../assets/Logo/1.png"; // Logo

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { email, password } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
  };

  return (
    <div className="flex h-screen items-center justify-center bg-blue-50">
      <div className="relative w-[90%] max-w-3xl bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left side (Image & Wave Design) */}
        <div
          className="relative hidden md:block w-1/2 bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${loginBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-90 rounded-l-lg"></div>
          <img
            src={logo}
            alt="Logo"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-50 md:w-48 lg:w-56 z-10"
          />
        </div>

        {/* Right side (Login Form) */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-4">
            LOGIN
          </h2>
          <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-6">
            <label className="w-full">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Email Address
              </p>
              <input
                required
                type="text"
                name="email"
                value={email}
                onChange={handleOnChange}
                placeholder="youname@email.com"
                className="w-full rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 shadow-sm"
              />
            </label>

            <label className="relative w-full">
              <p className="mb-2 text-sm font-medium text-gray-700">Password</p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="********"
                className="w-full rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-blue-600 shadow-sm"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-12 cursor-pointer text-gray-600"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={22} />
                ) : (
                  <AiOutlineEye fontSize={22} />
                )}
              </span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-blue-700 text-right hover:underline"
            >
              Forgot your password?
            </Link>

            <button
              type="submit"
              className="w-full bg-blue-400 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 shadow-md"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
