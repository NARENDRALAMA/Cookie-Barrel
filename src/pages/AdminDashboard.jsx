import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  useEffect(() => {
    // Mock orders data
    const mockOrders = [
      {
        id: 1,
        orderNumber: "CB001",
        customerName: "John Doe",
        items: ["Chocolate Chip Cookies x2", "Oatmeal Raisin x1"],
        total: 8.47,
        status: "preparing",
        date: "2024-01-15 14:30",
        phone: "+1 (555) 123-4567",
      },
      {
        id: 2,
        orderNumber: "CB002",
        customerName: "Jane Smith",
        items: ["Gluten-Free Almond x3"],
        total: 11.97,
        status: "ready",
        date: "2024-01-15 14:15",
        phone: "+1 (555) 987-6543",
      },
      {
        id: 3,
        orderNumber: "CB003",
        customerName: "Mike Johnson",
        items: ["Peanut Butter x2", "Snickerdoodle x1"],
        total: 8.17,
        status: "delivered",
        date: "2024-01-15 13:45",
        phone: "+1 (555) 456-7890",
      },
      {
        id: 4,
        orderNumber: "CB004",
        customerName: "Sarah Wilson",
        items: ["Double Chocolate x2", "Lemon Poppy x1"],
        total: 9.87,
        status: "ordered",
        date: "2024-01-15 14:45",
        phone: "+1 (555) 321-6540",
      },
    ];

    // Mock users data
    const mockUsers = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        orders: 5,
        totalSpent: 45.2,
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1 (555) 987-6543",
        orders: 3,
        totalSpent: 28.5,
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike@example.com",
        phone: "+1 (555) 456-7890",
        orders: 7,
        totalSpent: 62.8,
      },
      {
        id: 4,
        name: "Sarah Wilson",
        email: "sarah@example.com",
        phone: "+1 (555) 321-6540",
        orders: 2,
        totalSpent: 18.9,
      },
    ];

    setOrders(mockOrders);
    setUsers(mockUsers);
  }, []);

  // Check if user is admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || !user.isAdmin) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "ordered":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "preparing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "delivered":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ordered":
        return <Clock className="h-4 w-4" />;
      case "preparing":
        return <AlertCircle className="h-4 w-4" />;
      case "ready":
        return <CheckCircle className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const deleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    }
  };

  const deleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    }
  };

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    activeOrders: orders.filter((order) => order.status !== "delivered").length,
    totalCustomers: users.length,
  };

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <Package className="h-8 w-8" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: <DollarSign className="h-8 w-8" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
      change: "+8.5%",
    },
    {
      title: "Active Orders",
      value: stats.activeOrders,
      icon: <Clock className="h-8 w-8" />,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-100",
      change: "+3",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: <Users className="h-8 w-8" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      change: "+5",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-orange-50/50 via-white to-red-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
                <span className="gradient-text">Admin Dashboard</span>
                <Sparkles className="h-8 w-8 ml-3 text-orange-600" />
              </h1>
              <p className="text-gray-600 text-lg">
                Manage orders, customers, and business operations
              </p>
            </div>
            <button className="btn-primary flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="card card-hover relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-10">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br ${stat.color}`}
                ></div>
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <div
                      className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold text-sm flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="glass rounded-2xl shadow-xl mb-8 overflow-hidden">
          <nav className="flex space-x-1 p-2">
            {[
              {
                id: "overview",
                label: "Overview",
                icon: <BarChart3 className="h-5 w-5" />,
              },
              {
                id: "orders",
                label: "Orders",
                icon: <Package className="h-5 w-5" />,
              },
              {
                id: "customers",
                label: "Customers",
                icon: <Users className="h-5 w-5" />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-orange-50"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Recent Orders Table */}
            <div className="glass rounded-3xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Recent Orders
                </h2>
                <button className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center">
                  View All
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-orange-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {order.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="ml-2 capitalize">
                              {order.status}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-900">
                            ${order.total.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="glass rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Order Management
              </h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-colors">
                  <Filter className="h-5 w-5" />
                  <span className="font-medium">Filter</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-orange-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500 mb-1">
                          {order.date}
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center">
                              <span className="inline-block w-1.5 h-1.5 bg-orange-600 rounded-full mr-2"></span>
                              {item}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {order.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none cursor-pointer"
                        >
                          <option value="ordered">Ordered</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">
                          ${order.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="glass rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Customer Management
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-orange-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {user.name.charAt(0)}
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {user.orders} orders
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">
                          ${user.totalSpent.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
