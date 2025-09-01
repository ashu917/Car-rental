import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // function to check if user is logged in
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user?.role === "owner");
      } else {
        // Don't navigate here, just set user to null
        setUser(null);
        setIsOwner(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
      // Set user to null on error
      setUser(null);
      setIsOwner(false);
    }
  }, []);

  // Function to fetch all cars from the server
  const fetchCars = useCallback(async () => {
    try {
      // Use protected cars if token exists, else public cars
      const endpoint = token ? "/api/user/cars" : "/api/user/public/cars";
      const { data } = await axios.get(endpoint);
      if (data.success) {
        // Double-check: ensure we only have available and not booked cars
        const availableCars = data.cars.filter(car => car.isAvailable !== false && car.isBooked !== true);
        setCars(availableCars);
        
        // Log if any cars were filtered out
        const filteredOut = data.cars.length - availableCars.length;
        if (filteredOut > 0) {
          console.log(`AppContext: Filtered out ${filteredOut} cars (unavailable or booked)`);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }, [token]);

  // Function to refresh cars (useful for admin changes)
  const refreshCars = useCallback(() => {
    fetchCars();
  }, [fetchCars]);

  // function to login the user
  const login = useCallback((newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  }, []);

  // function to set token (for backward compatibility)
  const setTokenFunction = useCallback((newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem("token");
      axios.defaults.headers.common["Authorization"] = "";
    }
  }, []);

  // function to logout the user
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(null);
    axios.defaults.headers.common["Authorization"] = "";
    toast.success("You have been logged out");
  }, []);

  // initial auth readiness
  useEffect(() => {
    if (!token) {
      setIsOwner(false);
      setUser(null);
      setAuthReady(true);
    }
  }, []);

  // useEffect to fetch user + cars only after token is available
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Optimistically derive role from JWT to avoid wrong UI before fetch
      try {
        const payload = JSON.parse(atob(token.split(".")[1] || ""));
        if (payload && payload.role) {
          setIsOwner(payload.role === "owner");
        }
      } catch (e) {
        // ignore decode errors
      }

      fetchUser();
      fetchCars(); // ✅ now called only when token is ready
      setAuthReady(true);
    } else {
      // fetch public cars when logged out
      fetchCars();
      setAuthReady(true);
    }
  }, [token]);

  const value = useMemo(() => ({
    currency,
    axios,
    user,
    setUser,
    token,
    setToken: setTokenFunction,
    isOwner,
    setIsOwner,
    authReady,
    fetchUser,
    showLogin,
    setShowLogin,
    login,
    logout,
    fetchCars,
    refreshCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  }), [
    currency,
    axios,
    user,
    setUser,
    token,
    setTokenFunction,
    isOwner,
    setIsOwner,
    authReady,
    fetchUser,
    showLogin,
    setShowLogin,
    login,
    logout,
    fetchCars,
    refreshCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  ]);

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
