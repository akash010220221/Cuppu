import axios from 'axios'
import LogoIcon from "../icons/LogoIcon"
import { BASE_URL } from '../config/config'
import { useEffect, useState } from 'react'
import { usePasswordValidation } from "../hooks/usePasswordValidation"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from '../context/AuthContext'
import ButtonSpinner from '../components/ButtonSpinner'



const ValidationItem = ({ condition, text }) => (
  <p className={`flex items-center gap-2 transition-colors duration-200 text-sm ${condition ? "text-green-600 font-medium" : "text-gray-500"}`}>
    <span className='font-extrabold'>
      {condition ? '✔' : '•'}
    </span>
    {text}
  </p>
);


const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const { password, setPassword, validation } = usePasswordValidation();
  const [loading, setLoading] = useState(false);

  const showValidation = !isLogin && password.length >= 1;

  const { user, setUser } = useAuth()



  const handleLogin = async () => {
    if (!email || !password) {
      toast.warning("Email and Password are required");
      return
    }
    if (!isLogin && (!firstName || !lastName)) {
      toast.warning("Please fill all fields to sign up!")
      return
    }
    if (!isLogin && Object.values(validation).includes(false)) {
      toast.warning("Please enter a strong password!")
      return;
    }

    try {
      setLoading(true)
      const endpoint = isLogin ? "/login" : "/signup";
      const payload = isLogin ? { email, password } : { firstName, lastName, email, password };

      const response = await axios.post(BASE_URL + endpoint, payload, { withCredentials: true })

      if (response.status === 200) {
        toast.success(response.data.message)
        navigate("/dashboard")
      }
      setLoading(false)
    } catch (err) {
      toast.error(err.response?.data?.message || "An unknown error occurred.");
      setLoading(false)
    }
  }

  const redirect = async () => {
    try {
      const response = await axios.get(BASE_URL + "/verify", { withCredentials: true })
      if (response.status === 200) {
        setUser(response.data.data)
        navigate("/dashboard")
      }
    } catch (err) {

    }
  }

  useEffect(() => {
    redirect()
  }, [])

  useEffect(() => {
    const inputs = document.querySelectorAll("input");
    const preventSpace = (e) => {
      if (e.key === " ") {
        e.preventDefault();
      }
    }
    inputs.forEach((input) => document.addEventListener("keydown", preventSpace));
    return () => {
      inputs.forEach((input) => document.removeEventListener("keydown", preventSpace));
    }
  }, [])

  const isButtonDisabled = !email || !password || (!isLogin && (!firstName || !lastName || Object.values(validation).includes(false)));



  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4'>


      <div className='text-4xl font-extrabold text-indigo-700 mb-8 flex items-center gap-2'>
        <span className='text-indigo-600'><LogoIcon /></span> CUPPU
      </div>


      <div className='bg-white w-full max-w-md p-8 md:p-10 rounded-xl shadow-2xl border border-gray-200'>

        <h2 className='text-3xl font-bold text-gray-900 mb-2 text-center'>
          {isLogin ? "Welcome Back" : "Create Your Account"}
        </h2>
        <p className='text-gray-500 mb-6 text-center'>
          {isLogin ? "Sign in to manage your coupons." : "Start saving smarter today!"}
        </p>

        <div className='flex flex-col gap-4'>

          {!isLogin && (
            <>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className='border border-gray-300 rounded-lg p-3 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors'
                placeholder='First Name'
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className='border border-gray-300 rounded-lg p-3 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors'
                placeholder='Last Name'
              />
            </>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-gray-300 rounded-lg p-3 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors'
            placeholder='Email Address'
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-gray-300 rounded-lg p-3 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors'
            placeholder='Password'
          />


          <button
            onClick={handleLogin}
            disabled={isButtonDisabled}
            className={`font-semibold py-3 rounded-lg text-lg transition-all flex justify-center gap-1 items-center duration-300
                            ${isButtonDisabled
                ? 'bg-indigo-300 text-white cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}
          >
            {loading ? <>Loading <ButtonSpinner /></> : (isLogin ? "Log In" : "Sign Up")}
          </button>


          <p
            onClick={() => setIsLogin(!isLogin)}
            className='font-medium cursor-pointer text-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors mt-2'
          >
            {isLogin ? "New User? Create an Account" : "Already Have an Account? Log In"}
          </p>

          {showValidation && (
            <div className='bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4 text-left space-y-1'>
              <p className="font-semibold text-gray-700 mb-1">Password Requirements:</p>
              <ValidationItem condition={validation.upper} text="One uppercase letter" />
              <ValidationItem condition={validation.lower} text="One lowercase letter" />
              <ValidationItem condition={validation.number} text="One number (0-9)" />
              <ValidationItem condition={validation.length} text="Minimum 8 characters" />
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default Login