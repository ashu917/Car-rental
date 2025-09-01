import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './Context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { setShowLogin, axios, setToken } = useAppContext();
  const navigate = useNavigate();
  const [state, setState] = React.useState("login"); // "login" or "register" or "verify"
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [otp, setOtp] = React.useState("");

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL || 'http://localhost:8000'}/auth/google`;
  };

  // handle submit
  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

             if (state === 'register') {
         const { data } = await axios.post(
           `/api/user/register`,
           { name, email, password },
           { headers: { "Content-Type": "application/json" } }
         );
        if (data.success) {
          toast.success('OTP sent to your email');
          setState('verify');
          return;
        } else {
          toast.error(data.message);
          return;
        }
      }

      if (state === 'verify') {
        const { data } = await axios.post(
          `/api/user/verify-otp`,
          { email, otp },
          { headers: { "Content-Type": "application/json" } }
        );
        if (data.success) {
          setToken(data.token);
          localStorage.setItem('token', data.token);
          setShowLogin(false);
          
          // Show success message
          toast.success('User successfully logged in!');
          
          const userRole = data.user?.role;
          if (userRole === 'owner') {
            navigate('/owner');
          } else {
            navigate('/dashboard');
          }
          return;
        } else {
          toast.error(data.message);
          return;
        }
      }

      // login
      const { data } = await axios.post(
        `/api/user/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setShowLogin(false);

        // Show success message
        toast.success('User successfully logged in!');

        // Role-based redirect using returned user role when available
        const userRole = data.user?.role;
        if (userRole === 'owner') {
          navigate('/owner');
        } else {
          navigate('/dashboard');
        }
      } else {
        if (data.message?.toLowerCase().includes('verify')) {
          toast.error(data.message);
          setState('verify');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center text-sm text-gray-600 bg-black/60 backdrop-blur-sm"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-6 m-auto items-start p-8 py-12 w-80 sm:w-[400px] text-gray-700 rounded-2xl shadow-2xl border border-white/30 bg-white/95 backdrop-blur-xl"
      >
        <p className="text-3xl font-bold m-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          <span className="text-indigo-600">User</span> {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <p className="font-semibold text-gray-700 mb-2">Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Type here"
              className="border border-gray-200 rounded-xl w-full p-3 mt-1 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
              type="text"
              required={state === "register"}
            />
          </div>
        )}

        <div className="w-full">
          <p className="font-semibold text-gray-700 mb-2">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Type here"
            className="border border-gray-200 rounded-xl w-full p-3 mt-1 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
            type="email"
            required
          />
        </div>

        {state !== 'verify' && (
          <div className="w-full">
            <p className="font-semibold text-gray-700 mb-2">Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Type here"
              className="border border-gray-200 rounded-xl w-full p-3 mt-1 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
              type="password"
              required
            />
          </div>
        )}

        {state === 'verify' && (
          <div className="w-full">
            <p className="font-semibold text-gray-700 mb-2">Enter OTP</p>
            <input
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              placeholder="6-digit code"
              className="border border-gray-200 rounded-xl w-full p-3 mt-1 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300 tracking-widest text-center text-lg"
              type="text"
              required
            />
            <button
              type="button"
              onClick={async () => {
                try {
                  const { data } = await axios.post('/api/user/resend-otp', { email }, { headers: { 'Content-Type': 'application/json' } })
                  data.success ? toast.success('OTP resent') : toast.error(data.message)
                } catch (e) {
                  toast.error(e.response?.data?.message || e.message || 'Failed to resend')
                }
              }}
              className="text-indigo-600 mt-2 hover:text-indigo-700 transition-colors duration-300 font-medium"
            >
              Resend code
            </button>
          </div>
        )}

        {state === "register" ? (
          <p className="text-gray-600">
            Already have account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors duration-300 font-medium"
            >
              click here
            </span>
          </p>
        ) : state === 'login' ? (
          <p className="text-gray-600">
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors duration-300 font-medium"
            >
              click here
            </span>
          </p>
        ) : (
          <p className="text-gray-600">
            Entered the wrong email?{" "}
            <span
              onClick={() => setState("register")}
              className="text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors duration-300 font-medium"
            >
              go back
            </span>
          </p>
        )}



        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-white w-full py-3 rounded-xl cursor-pointer font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1">
          {state === "register" ? "Send OTP" : state === 'verify' ? 'Verify' : "Login"}
        </button>

        {state !== 'verify' && (
          <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full mt-3 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Continue with Google
            </button>
        )}
       
      </form>
    </div>
  );
};

export default Login;


