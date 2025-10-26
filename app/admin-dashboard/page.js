"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManagerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    preparing: 0,
    ready: 0,
    delivered: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Define functions BEFORE useEffect
  const fetchOrders = async (token) => {
    console.log("🔵 [AdminDashboard] Fetching orders...");
    try {
      const response = await fetch("http://localhost:5001/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("🔵 [AdminDashboard] Orders response:", data);
      if (data.success) {
        console.log(
          "✅ [AdminDashboard] Orders fetched:",
          data.data.length,
          "orders"
        );
        setOrders(data.data);
        setStats(data.stats);
      } else {
        console.error("❌ [AdminDashboard] Orders fetch failed:", data.message);
      }
    } catch (error) {
      console.error("❌ [AdminDashboard] Error fetching orders:", error);
    }
  };

  const fetchProducts = async (token) => {
    console.log("🔵 [AdminDashboard] Fetching products...");
    try {
      const response = await fetch("/api/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("🔵 [AdminDashboard] Products response:", data);
      if (data.success) {
        console.log(
          "✅ [AdminDashboard] Products fetched:",
          data.data.length,
          "items"
        );
        setProducts(data.data);
      } else {
        console.error(
          "❌ [AdminDashboard] Products fetch failed:",
          data.message
        );
      }
    } catch (error) {
      console.error("❌ [AdminDashboard] Error fetching products:", error);
    }
  };

  useEffect(() => {
    console.log("🔵 [AdminDashboard] Checking authentication...");
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    console.log("🔵 [AdminDashboard] Token exists:", !!token);
    console.log("🔵 [AdminDashboard] User data exists:", !!userData);

    if (!token || !userData) {
      console.log(
        "❌ [AdminDashboard] No token or user data, redirecting to login"
      );
      router.push("/manager-login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      console.log("🔵 [AdminDashboard] Parsed user:", parsedUser);
      console.log("🔵 [AdminDashboard] User role:", parsedUser.role);

      setUser(parsedUser);

      // STRICT: Only admin and manager roles allowed
      if (parsedUser.role !== "manager" && parsedUser.role !== "admin") {
        console.log(
          "❌ [AdminDashboard] Access denied - not admin/manager. Role:",
          parsedUser.role
        );
        // Clear unauthorized access
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Access denied. Admin credentials required.");
        router.push("/login");
        return;
      }

      console.log(
        "✅ [AdminDashboard] Access granted for role:",
        parsedUser.role
      );
      setLoading(false);
      fetchOrders(token);
      fetchProducts(token);
    } catch (error) {
      console.error("❌ [AdminDashboard] Error parsing user data:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/manager-login");
    }
  }, [router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const deleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this dish?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        await fetchProducts(token);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5001/api/admin/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();
      if (data.success) {
        // Refresh orders list
        const refreshResponse = await fetch(
          "http://localhost:5001/api/admin/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setOrders(refreshData.data);
          setStats(refreshData.stats);
        }
        setSelectedOrder(null);
      } else {
        alert("Failed to update order: " + data.message);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating order. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      ready: "bg-green-100 text-green-800",
      delivered: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/manager-login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-orange-600">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("orders")}
              className={`${
                activeTab === "orders"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Orders Management
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`${
                activeTab === "products"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Menu Management
            </button>
          </nav>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Confirmed</div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.confirmed}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Preparing</div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.preparing}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Ready</div>
            <div className="text-2xl font-bold text-green-600">
              {stats.ready}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Delivered</div>
            <div className="text-2xl font-bold text-gray-600">
              {stats.delivered}
            </div>
          </div>
        </div>

        {/* Orders Management Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              <div className="space-y-4">
                {orders.slice(0, 10).map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">
                          Order #{order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.customer?.name} - {order.customer?.email}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total: ${order.finalAmount?.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusBadge(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Management Tab */}
        {activeTab === "products" && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Menu Items</h2>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductModal(true);
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  + Add New Dish
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => {
                  // Check if product.image is a valid URL or emoji
                  const isUrl =
                    product.image && product.image.startsWith("http");
                  const isEmoji = product.image && product.image.length <= 5;

                  return (
                    <div
                      key={product._id}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col h-full"
                    >
                      {/* Image Section - Full Width */}
                      <div className="relative w-full h-48 bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center overflow-hidden">
                        {isUrl ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="absolute inset-0 flex items-center justify-center text-8xl"
                          style={{ display: isUrl ? "none" : "flex" }}
                        >
                          {isEmoji ? product.image : "🍽️"}
                        </div>
                      </div>

                      {/* Content Section - Flex grow to push buttons down */}
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-bold text-lg mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xl font-bold text-orange-600">
                            ${product.price}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              product.isAvailable
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-auto">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowProductModal(true);
                            }}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  Order #{selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Customer Info */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p>Name: {selectedOrder.customer?.name}</p>
                <p>Email: {selectedOrder.customer?.email}</p>
                <p>Phone: {selectedOrder.customer?.phone}</p>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Order Items</h3>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="border rounded p-2 mb-2">
                    <div className="font-semibold">{item.product?.name}</div>
                    <div className="text-sm text-gray-600">
                      Qty: {item.quantity} × ${item.price}
                    </div>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Delivery Address</h3>
                <p>{selectedOrder.deliveryAddress?.street}</p>
                <p>
                  {selectedOrder.deliveryAddress?.city},{" "}
                  {selectedOrder.deliveryAddress?.state}{" "}
                  {selectedOrder.deliveryAddress?.zipCode}
                </p>
              </div>

              {/* Status Update Buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() =>
                    updateOrderStatus(selectedOrder._id, "confirmed")
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Confirm
                </button>
                <button
                  onClick={() =>
                    updateOrderStatus(selectedOrder._id, "preparing")
                  }
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  Start Preparing
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder._id, "ready")}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Mark Ready
                </button>
                <button
                  onClick={() =>
                    updateOrderStatus(selectedOrder._id, "out_for_delivery")
                  }
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                >
                  Out for Delivery
                </button>
                <button
                  onClick={() =>
                    updateOrderStatus(selectedOrder._id, "delivered")
                  }
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Mark Delivered
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <ProductFormModal
                product={editingProduct}
                onClose={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                }}
                onSave={async () => {
                  const token = localStorage.getItem("token");
                  await fetchProducts(token);
                  setShowProductModal(false);
                  setEditingProduct(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductFormModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "",
    image: product?.image || "🍽️",
    isAvailable: product?.isAvailable ?? true,
    stock: product?.stock || 100,
    popular: product?.popular || false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "🔵 [ProductModal] Submitting form for:",
      product ? "edit" : "add",
      formData
    );
    try {
      const token = localStorage.getItem("token");
      const url = product
        ? `/api/admin/products/${product._id}`
        : "/api/admin/products";
      const method = product ? "PATCH" : "POST";

      console.log(
        "🔵 [ProductModal] Making request to:",
        url,
        "Method:",
        method
      );

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("🔵 [ProductModal] Response:", data);

      if (data.success) {
        console.log("✅ [ProductModal] Successfully saved product");
        onSave();
      } else {
        console.error("❌ [ProductModal] Error:", data.message);
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("❌ [ProductModal] Network or other error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {product ? "Edit Dish" : "Add New Dish"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dish Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="e.g., Chocolate Chip Cookies"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Describe the dish..."
            rows="3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price * $
            </label>
            <input
              type="number"
              required
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="9.99"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="cookies, burgers, drinks"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (Emoji 🍪 or Web URL)
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="🍪 or https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use an emoji (🍪) or a full web image URL
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="100"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) =>
                setFormData({ ...formData, isAvailable: e.target.checked })
              }
              className="mr-2"
            />
            Available
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.popular}
              onChange={(e) =>
                setFormData({ ...formData, popular: e.target.checked })
              }
              className="mr-2"
            />
            Popular
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            {product ? "Update Dish" : "Add Dish"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
