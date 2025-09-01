import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../Components/Title";
import { useAppContext } from "../../Components/Context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext();
  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: "Total Cars",
      value: data.totalCars,
      icon: assets.carIconColored,
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.listIconColored,
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      textColor: "text-green-600",
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Pending Bookings",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      textColor: "text-yellow-600",
      gradient: "from-yellow-500 to-yellow-600"
    },
    {
      title: "Completed Bookings",
      value: data.completedBookings,
      icon: assets.listIconColored,
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      textColor: "text-purple-600",
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const { data } = await axios.get('/api/owner/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setData(data.dashboardData);
      } else {
        toast.error(data.message || 'Failed to load dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData();
    }
  }, [isOwner]);

  if (loading) {
    return (
      <div className="px-4 pt-6 md:px-8 flex-1">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 md:px-8 flex-1 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <Title
          title="Admin Dashboard"
          subtitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
          align="left"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`${card.iconBg} p-3 rounded-full`}>
                  <img src={card.icon} alt="" className="h-6 w-6" />
                </div>
              </div>
              <div className={`mt-4 h-1 bg-gradient-to-r ${card.gradient} rounded-full`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <p className="text-gray-500 text-sm mt-1">Latest customer bookings</p>
          </div>
          
          <div className="p-6">
            {data.recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img src={assets.listIconColored} alt="" className="h-8 w-8 opacity-50" />
                </div>
                <p className="text-gray-500">No recent bookings</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentBookings.slice(0, 5).map((booking, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <img src={assets.carIconColored} alt="" className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {booking.car?.brand} {booking.car?.model}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {currency} {booking.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Monthly Revenue</h2>
            <p className="text-gray-500 text-sm mt-1">Revenue for the current month</p>
          </div>
          
          <div className="p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {currency} {data.monthlyRevenue?.toLocaleString()}
              </p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">75% of monthly target</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


