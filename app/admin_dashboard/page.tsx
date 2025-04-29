"use client";

import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiBook,
  FiUsers,
  FiFileText,
  FiDollarSign,
  FiSettings,
} from "react-icons/fi";
import FetchAllUsers from "../component/FetchAllUsers";
import FetchAllProperties from "../component/FetchAllProperties";
import Cartes from "../component/Cartes";
import { IoIosNotifications } from "react-icons/io";
import {
  fetchProperties,
  getAllVirtualCard,
  getTotalSales,
  getRevenue,
  getUserProfile,
  getMembershipPlans,
  getDailyTransactions,
  getAllUserProfile,
  getId,
  getAdmin,
} from "../api/action";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

import { getToken } from "../lib/auth";
import { CiLogout } from "react-icons/ci";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LmsDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("Dashboard");

  const [isMounted, setIsMounted] = useState(false);
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  const [amount, setAmount] = useState("");
  const [inCome, setInCome] = useState("");

  const [allUserProfile, setAllUserProfile] = useState([]);
  const [allMemberships, setAllMembershps] = useState([]);
  const [dailyTransactions, setDailyTransactions] = useState([]);

  const value = Number(inCome);
  const all_total_properties = Number(allProperties[0]?.all_total_properties);

  const [allUsers, setAllUsers] = useState(0);

  const [notificationCount, setNotificationCount] = useState(0);
  const [allNotification, setAllNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(false)

  const admin = getAdmin();
  const [isAdmin, setIsAdmin] = useState(admin)

  // const [allRecharges, setAllRecharges] = useState([]);

  const token = getToken();
  const router = useRouter();
  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;


  
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="flex flex-col items-center">
          {/* Pulsing dot animation */}
          <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse mb-2"></div>
          {/* Optional text */}
          <span className="text-gray-600">Vérification...</span>
        </div>
      </div>
    );
  }

  if (isAdmin!=="valid") {
    setLoading(true)
    router.push("/admin_verification_check")
    return
  }



  console.log("allProperties: ", allProperties);
  console.log("allUserProfile: ", allUserProfile);
  console.log("notificationCount: ", notificationCount);
  console.log("allNotification: ", allNotification);


  const markNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${api_url}/recharges/mark-as-read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    fetchAllRecharges();
  }, []);

  const handleRechargeConfirmation = async (amount, cardId, id) => {
    try {
      // 1. Update the card amount
      const response = await axios.post(
        `${api_url}/card/${cardId}/update-amount/`,
        { amount: Number(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 2. Approve the recharge AFTER card amount is updated
      const approvedResponse = await axios.post(
        `${api_url}/recharges/${id}/approve/`,
        { is_approved: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 3. Do your UI updates and success handling
      fetchAllRecharges();
      toast.success("Approved successfully! ✅");

      console.log("Amount updated:", response.data);
      console.log("Recharge approved:", approvedResponse.data);
    } catch (error) {
      toast.error("Error occurred ❌");
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://127.0.0.1:8000/api/recharges/unread/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotificationCount(res.data.length);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
    }
  };

  const fetchAllRecharges = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api_url}/recharges/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Recharge data : ", res.data);
      setAllNotifications(res.data);
    } catch (error) {
      console.error("Error fetching recharges:", error);
    }
  };

  const handleNavClick = async (name) => {
    setActiveNav(name);

    if (name === "Recharges") {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://127.0.0.1:8000/api/recharges/mark-as-read/",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotificationCount(0); // Update badge
        fetchAllRecharges(); // Refresh the list with updated is_read flags
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchProperties();
        const revenues = await getRevenue();
        const daily_transactons = await getDailyTransactions();
        const all_users_profile = await getAllUserProfile();
        const all_users = await getUserProfile();

        console.log("daily_transactons values : ", daily_transactons);
        console.log("The property list : ", result);
        console.log("The revenues information : ", revenues[0].amount);
        console.log("Get all user profile  : ", all_users_profile);
        console.log("all_users  : ", all_users.all_users);

        setAllUsers(all_users.all_users);
        setDailyTransactions(daily_transactons);
        setAllProperties(result); // Set propertyState with the fetched result
        setInCome(revenues[0].amount);
        setAllUserProfile(all_users_profile);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchData();
  }, []);

  const handleActivation = async (id, active) => {
    try {
      const res = await fetch("http://localhost:8000/api/toggle-activation/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // make sure token is defined
        },
        body: JSON.stringify({
          user_id: id, // make sure userId is defined
          is_active: active, // make sure isActive is a boolean
        }),
      });

      if (!res.ok) throw new Error("Something went wrong");

      const data = await res.json();
      console.log("Activation toggled:", data);
      return data;
    } catch (err) {
      console.error("Toggle user error:", err);
      throw err;
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [totalSales, setTotalSales] = useState([]);
  console.log("totalSales: ", totalSales);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTotalSales();
      const memberships = await getMembershipPlans();
      console.log("memberships : ", memberships);
      setAllMembershps(memberships.plans);
      setTotalSales(data);
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const res = await axios.get("http://127.0.0.1:8000/api/recharges/unread/", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setAllNotifications(res.data)
  //       setNotificationCount(res.data.length);
  //     } catch (error) {
  //       console.error("Failed to fetch unread recharges:", error);
  //     }
  //   };

  //   fetchNotifications();
  // }, [token]);

  const start_date = "2025-04-01";
  const calculateDaysByTwo = (startDate) => {
    // Convert the start_date string to a Date object
    const startDateObj = new Date(startDate);

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in time (milliseconds)
    const timeDifference = currentDate - startDateObj;

    // Convert time difference to days (1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const dayDifference = timeDifference / (1000 * 3600 * 24);

    // Multiply the difference by 2 and round it
    const daysMultiplied = Math.round(dayDifference * 1);

    // Format the result
    let result;
    if (daysMultiplied < 7) {
      result = `${daysMultiplied} day${daysMultiplied !== 1 ? "s" : ""} ago`;
    } else {
      const weeks = Math.floor(daysMultiplied / 7);
      result = `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    }

    return result;
  };

  // Call the function and log the result
  const result = calculateDaysByTwo(start_date);
  console.log(`Time elapsed: ${result}`);

  const formatNumber = (num: any) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + "M"; // M for million
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + "k"; // k for thousand
    } else {
      return num;
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const stats = [
    {
      title: "Total Proprietes",
      value: formatNumber(all_total_properties),
      color: "from-purple-500 to-indigo-500",
    },

    {
      title: "Revenues HTG ",
      value: `${formatNumber(value)}`,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Listes des utilisateurs",

      value: formatNumber(allUsers),
      color: "from-amber-500 to-orange-500",
    },
  ];

  const recentActivities = [
    {
      user: "Emma Smith",
      date: "Mar 3, 2024",
      action: 'Completed "React Advanced" course',
    },
    {
      user: "John Doe",
      date: "Feb 28, 2024",
      action: 'Submitted "Web Development" assignment',
    },
    {
      user: "Sarah Johnson",
      date: "Feb 25, 2024",
      action: 'Enrolled in "UI/UX Design"',
    },
  ];

  const transactions = [
    { amount: "$127.50", date: "3 days ago", via: "Stripe" },
    { amount: "$89.00", date: "5 days ago", via: "PayPal" },
    { amount: "$199.00", date: "1 week ago", via: "Bank Transfer" },
  ];

  const navItems = [
    { name: "Dashboard", icon: <FiHome /> },
    { name: "Add properties", icon: <FiBook /> },
    { name: "Properties list", icon: <FiUsers /> },
    { name: "User list", icon: <FiFileText /> },
    { name: "Cartes", icon: <FiDollarSign /> },
    {
      name: "Recharges",
      icon: (
        <div className="relative">
          <IoIosNotifications />
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 text-xs text-white bg-red-500 rounded-full px-1.5">
              {notificationCount}
            </span>
          )}
        </div>
      ),
    },
    { name: "Settings", icon: <FiSettings /> },
  ];

  const renderContent = () => {
    switch (activeNav) {
      case "Dashboard":
        return (
          <div className="mt-4">
            <p className="m-4">Welcome to the Dashboard!</p>
            {/* Include your stats grid here */}

            {/* Stats Grid */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all`}
                >
                  <p className="text-sm font-light mb-2 text-white/80">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-xs font-light mt-2 text-white/60">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Recent Activities & Transactions */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Recent Activities</h3>
                <div className="space-y-4">
                  {allMemberships.map((activity, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-700 pb-4 last:border-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {activity.firstname} {activity.lastname}
                          </p>
                          <p className="text-sm text-gray-400">
                            Completed {activity.name} plan successfully for{" "}
                            {activity.get_duration} months
                          </p>
                        </div>
                        <span className="text-sm text-gray-400">
                          {activity.start_date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
                <div className="space-y-4">
                  {dailyTransactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b border-gray-700 pb-4 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{transaction.total} HTG</p>
                        <p className="text-sm text-gray-400">
                          via EspasLink card
                        </p>
                      </div>
                      <span className="text-sm text-gray-400">
                        {calculateDaysByTwo(transaction.day)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "Add Propeties":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Add Propeties</h2>
          </div>
        );

      case "Cartes":
        return <Cartes />;

      case "Properties list":
        return (
          <>
            {/* Main Content */}
            <FetchAllProperties />
          </>
        );

      case "Recharges":
        return (
          <>
            <div className="p-4 min-h-screen bg-gray-900 overflow-y-auto">
              <div className="w-full mx-auto">
                {/* Search Input */}
                <div className="mb-8 group relative max-w-md mx-auto">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition-opacity" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-3 bg-gray-900/50 backdrop-blur-sm border border-cyan-400/30 rounded-lg text-cyan-300 placeholder-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                </div>

                {/* Table Container */}
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-cyan-400/20 shadow-[0_0_40px_rgba(34,211,238,0.1)]">
                  {/* Responsive Table */}
                  <div className="overflow-x-auto h-screen sm:overflow-y-auto rounded-md">
                    <table className="w-full hidden sm:table">
                      <thead className="bg-gradient-to-r from-cyan-400/10 to-purple-600/10">
                        <tr>
                          {["Username", "amount", "Status"].map((header) => (
                            <th
                              key={header}
                              className="px-6 py-4 text-left text-sm font-semibold text-cyan-400 border-b border-cyan-400/20"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      {selectedNotification && (
                        <Dialog
                          open={isModalOpen}
                          onOpenChange={setIsModalOpen}
                        >
                          <DialogContent className="bg-gray-900/95 backdrop-blur-2xl border-0 max-w-md rounded-2xl overflow-hidden">
                            <DialogHeader>
                              <DialogTitle className="text-3xl cyber-font bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                                MORE INFORMATION ABOUT THIS USER
                              </DialogTitle>
                              <DialogDescription className="text-cyan-400/80 mt-2">
                                {selectedNotification.user_profile.firstname}{" "}
                                {selectedNotification.user_profile.lastname}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="mt-6 space-y-3 text-sm text-cyan-300 font-mono">
                              <div>
                                <span className="font-semibold text-green-400">
                                  Country:
                                </span>{" "}
                                {selectedNotification.user_profile.country}
                              </div>
                              <div>
                                <span className="font-semibold text-green-400">
                                  Phone:
                                </span>{" "}
                                {selectedNotification.user_profile.phone_number}
                              </div>
                              <div>
                                <span className="font-semibold text-green-400">
                                  City:
                                </span>{" "}
                                {selectedNotification.user_profile.city}
                              </div>
                              <div>
                                <span className="font-semibold text-green-400">
                                  State:
                                </span>{" "}
                                {selectedNotification.user_profile.state}
                              </div>
                              <div>
                                <span className="font-semibold text-green-400">
                                  Address:
                                </span>{" "}
                                {selectedNotification.user_profile.address}
                              </div>
                              <div>
                                <span className="font-semibold text-green-400">
                                  Joined On:
                                </span>{" "}
                                {new Date(
                                  selectedNotification.user_profile.created_at
                                ).toLocaleDateString()}
                              </div>
                            </div>

                            {selectedNotification.user_profile.imageUrl && (
                              <div className="mt-6 w-full flex justify-center">
                                <img
                                  src={
                                    selectedNotification.user_profile.imageUrl
                                  }
                                  alt="Profile"
                                  className="w-24 h-24 rounded-full border-2 border-cyan-400 shadow-lg"
                                />
                              </div>
                            )}

                            <DialogClose className="absolute top-4 right-4 p-1 text-cyan-400 hover:text-cyan-300 transition-colors">
                              <span className="text-2xl">⨉</span>
                            </DialogClose>
                          </DialogContent>
                        </Dialog>
                      )}

                      <tbody className="divide-y divide-cyan-400/10">
                        {allNotification.map((notification) => (
                          <tr
                            key={notification.id}
                            className={`hover:bg-gray-900/50 transition-colors duration-200 `}
                          >
                            <td
                              onClick={() => {
                                setSelectedNotification(notification);
                                setIsModalOpen(true);
                              }}
                              className="px-6 cursor-pointer py-4 text-sm text-cyan-300"
                            >
                              {notification?.user}
                            </td>

                            <td className="px-6 py-4 text-sm text-cyan-300">
                              HTG- {notification?.amount}
                            </td>

                            <td className="px-6 py-4 text-sm cursor-pointer">
                              {notification.is_approved ? (
                                <span className="inline-block px-3 py-1 text-green-700 bg-green-100 rounded-full font-semibold text-xs shadow-sm">
                                  Approved
                                </span>
                              ) : (
                                <span
                                  onClick={() =>
                                    handleRechargeConfirmation(
                                      notification.amount,
                                      notification.virtual_card_id,
                                      notification.id
                                    )
                                  }
                                  className="inline-block px-3 py-1 text-red-700 bg-red-100 rounded-full font-semibold text-xs shadow-sm"
                                >
                                  Unapproved
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Mobile Version (Scrollable Key-Value Pairs) */}
                    <div className="block sm:hidden overflow-x-auto  min-h-screen">
                      {allNotification.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 mb-4 rounded-lg border border-cyan-400/20 bg-gray-900/50 text-left"
                        >
                          <div className="flex flex-wrap">
                            <div className="w-1/2 text-cyan-400 font-semibold">
                              Username:
                            </div>
                            <div className="w-1/2 text-cyan-300">
                              {notification.user}
                            </div>
                          </div>
                          <div className="flex flex-wrap">
                            <div className="w-1/2 text-cyan-400 font-semibold">
                              Status:
                            </div>
                            <div className="w-1/2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  notification.is_approved
                                    ? "bg-green-400/10 text-green-400"
                                    : "bg-red-400/10 text-red-400 animate-pulse"
                                }`}
                              >
                                {notification.is_approved
                                  ? "Approve"
                                  : "Unapprove"}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap">
                            <div className="w-1/2 text-cyan-400 font-semibold">
                              Amount:
                            </div>
                            <div className="w-1/2 text-cyan-300">
                              HTG- {notification.amount}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "User list":
        return <FetchAllUsers />;

      default:
        return <p>Welcome!</p>;
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-900 to-gray-800 w-full text-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 p-6 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-28"
        }`}
      >
        <div className="flex-grow space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <FiBook className="text-indigo-600 text-2xl" />
            </div>
            {isSidebarOpen && (
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Espaslink
              </h2>
            )}
          </div>


          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.name)}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
                  activeNav === item.name
                    ? "bg-white/10 text-cyan-400 shadow-lg"
                    : "hover:bg-white/5 hover:text-cyan-200"
                } ${isSidebarOpen ? "px-4 justify-start" : "justify-center"}`}
              >
                <div className="relative">
                  {item.icon}
                  {item.name === "Recharges" && notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1.5">
                      {notificationCount}
                    </span>
                  )}
                </div>
                {isSidebarOpen && <span>{item.name}</span>}
              </button>
            ))}
          </nav>

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-300"
          >
            <CiLogout className="text-xl" />
            Home Page
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg ${
            isSidebarOpen ? "self-start" : "self-center"
          }`}
        >
          {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-8 transition-all duration-300 ${
          // isSidebarOpen ? 'ml-64' : 'ml-20'
          isSidebarOpen ? "ml-18" : "ml-20"
        }`}
      >
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          {/* Learning Analytics Dashboard */}
          {activeNav}
        </h1>

        {renderContent()}
      </div>
    </div>
  );
};

export default LmsDashboard;
