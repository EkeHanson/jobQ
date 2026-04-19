import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import StatisticsCard from "../components/common/StatisticsCard";
import adminService from "../services/admin";
import { useToast } from "../components/common/Toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    staffUsers: 0,
    suspendedUsers: 0,
    premiumUsers: 0
  });
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    location: "",
    is_staff: false,
    is_active: true,
  });
  const { addToast } = useToast();

  useEffect(() => {
    fetchUsers(currentPage);
    fetchStatistics();
  }, [currentPage]);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const data = await adminService.getUsers(page);
      let usersWithSubscriptions = data.results || [];

      // Load subscription data and merge with users
      try {
        const subscriptionData = await adminService.getUserSubscriptions();
        const subscriptions = subscriptionData || [];

        usersWithSubscriptions = usersWithSubscriptions.map((user) => {
          const userSubscription = subscriptions.find(
            (sub) => sub.user === user.id,
          );
          return {
            ...user,
            subscription: userSubscription
              ? {
                  plan_name: userSubscription.plan?.name || "Unknown",
                  active: userSubscription.active,
                  plan_id: userSubscription.plan?.id,
                }
              : null,
          };
        });
      } catch (err) {
        console.warn("Failed to load subscription data:", err);
        // Continue without subscription data
      }

      setUsers(
        searchTerm
          ? filterUsers(usersWithSubscriptions, searchTerm)
          : usersWithSubscriptions,
      );
      setAllUsers(usersWithSubscriptions);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(Number(data.current_page) || 1);
    } catch (err) {
      console.error("Failed to load users", err);
      addToast(
        "Unable to load users. Make sure you are logged in as an admin.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      // Calculate statistics from all loaded users
      const totalUsers = allUsers.length;
      const activeUsers = allUsers.filter((user) => user.is_active).length;
      const staffUsers = allUsers.filter((user) => user.is_staff).length;
      const suspendedUsers = allUsers.filter((user) => user.is_suspended).length;

      // Get subscription data for premium users calculation
      let premiumUsers = 0;
      try {
        const subscriptionData = await adminService.getUserSubscriptions();
        const subscriptions = subscriptionData || [];
        premiumUsers = subscriptions.filter(
          (sub) => sub.active && sub.plan?.name !== "Free",
        ).length;
      } catch (err) {
        console.warn("Failed to load subscription data for statistics:", err);
        // Continue without subscription data
      }

      setStatistics({
        totalUsers,
        activeUsers,
        staffUsers,
        suspendedUsers,
        premiumUsers,
      });
    } catch (err) {
      console.warn("Failed to calculate user statistics:", err);
      // Set default values if calculation fails
      setStatistics({
        totalUsers: 0,
        activeUsers: 0,
        staffUsers: 0,
        suspendedUsers: 0,
        premiumUsers: 0,
      });
    }
  };

  const filterUsers = (userList, term) => {
    if (!term) return userList;

    const lowerTerm = term.toLowerCase();
    return userList.filter((user) => {
      const fullName = `${user.first_name || ""} ${user.last_name || ""}`
        .toLowerCase()
        .trim();
      const username = (user.username || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const subscriptionPlan = (
        user.subscription?.plan_name || ""
      ).toLowerCase();

      return (
        fullName.includes(lowerTerm) ||
        username.includes(lowerTerm) ||
        email.includes(lowerTerm) ||
        subscriptionPlan.includes(lowerTerm)
      );
    });
  };

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    if (allUsers.length > 0) {
      setUsers(filterUsers(allUsers, value));
    } else {
      // If we don't have all users loaded, filter current page
      setUsers(filterUsers(users, value));
    }
  };

  const handleNewUserChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateUser = async () => {
    try {
      setLoading(true);
      await adminService.createUser(newUser);
      addToast("User created successfully.", "success");
      setNewUser({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        location: "",
        is_staff: false,
        is_active: true,
      });
      setShowCreateForm(false);
      fetchUsers(currentPage);
    } catch (err) {
      console.error("Failed to create user", err);
      addToast(
        "Unable to create user. Check required fields and permissions.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewUser({
      username: user.username || "",
      email: user.email || "",
      password: "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
      location: user.location || "",
      is_staff: user.is_staff || false,
      is_active: user.is_active !== false,
    });
    setShowEditForm(true);
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      const payload = { ...newUser };
      if (!payload.password) {
        delete payload.password;
      }
      await adminService.updateUser(selectedUser.id, payload);
      addToast("User updated successfully.", "success");
      setShowEditForm(false);
      setSelectedUser(null);
      fetchUsers(currentPage);
    } catch (err) {
      console.error("Failed to update user", err);
      addToast("Unable to update user. Check permissions.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete user "${user.username}" permanently?`)) return;
    try {
      await adminService.deleteUser(user.id);
      addToast("User deleted successfully.", "success");
      fetchUsers(currentPage);
    } catch (err) {
      console.error("Failed to delete user", err);
      addToast("Unable to delete user. Check permissions.", "error");
    }
  };

  const handleToggleSuspension = async (user) => {
    try {
      const action = user.is_suspended ? "unsuspend" : "suspend";
      const response = user.is_suspended
        ? await adminService.unsuspendUser(user.id)
        : await adminService.suspendUser(user.id);

      addToast(response.detail || `User ${action}ed successfully`, "success");
      fetchUsers(currentPage);
    } catch (err) {
      console.error("Failed to update user status", err);
      addToast("Unable to update user status. Check permissions.", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Back Navigation */}
        <div className="mb-4 sm:mb-6">
          <a
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Admin
          </a>
        </div>

        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Manage registered users, create new accounts, and control user
                permissions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateForm((prev) => !prev)}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-200 w-full sm:w-auto"
            >
              {showCreateForm ? "Hide create form" : "+ Create new user"}
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatisticsCard
              title="Total Users"
              value={statistics.totalUsers}
              color="blue"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              }
            />
            <StatisticsCard
              title="Active Users"
              value={statistics.activeUsers}
              color="green"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <StatisticsCard
              title="Staff Members"
              value={statistics.staffUsers}
              color="purple"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A9 9 0 1112 21h0a9 9 0 01-6.879-3.196m6.879-12.804a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
            />
            <StatisticsCard
              title="Suspended"
              value={statistics.suspendedUsers}
              color="red"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              }
            />
            <StatisticsCard
              title="Premium Users"
              value={statistics.premiumUsers}
              color="amber"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              }
            />
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email, username, or subscription plan..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="text-sm text-gray-600">
                Found {users.length} user{users.length !== 1 ? "s" : ""}{" "}
                matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        {/* Create User Form - Fully Responsive */}
        {showCreateForm && (
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">
                +
              </span>
              Create User
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  name="username"
                  value={newUser.username}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  name="first_name"
                  value={newUser.first_name}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  name="last_name"
                  value={newUser.last_name}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={newUser.phone}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  name="location"
                  value={newUser.location}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_staff"
                    checked={newUser.is_staff}
                    onChange={handleNewUserChange}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Staff status</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={newUser.is_active}
                    onChange={handleNewUserChange}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateUser}
                className="w-full sm:w-auto"
              >
                Create User
              </Button>
            </div>
          </div>
        )}

        {/* Edit User Form - Fully Responsive */}
        {showEditForm && selectedUser && (
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm">
                ✎
              </span>
              Edit User: {selectedUser.username}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  name="username"
                  value={newUser.username}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  name="first_name"
                  value={newUser.first_name}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  name="last_name"
                  value={newUser.last_name}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={newUser.phone}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  name="location"
                  value={newUser.location}
                  onChange={handleNewUserChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_staff"
                    checked={newUser.is_staff}
                    onChange={handleNewUserChange}
                    className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">Staff status</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={newUser.is_active}
                    onChange={handleNewUserChange}
                    className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowEditForm(false);
                  setSelectedUser(null);
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpdateUser}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700"
              >
                Update User
              </Button>
            </div>
          </div>
        )}

        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Username
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Subscription
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Staff
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Suspended
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16 text-center text-sm text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading users…
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16 text-center text-sm text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.subscription ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.subscription.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.subscription.plan_name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">
                          No subscription
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_staff ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {user.is_staff ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_suspended ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                      >
                        {user.is_suspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleViewUser(user)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditUser(user)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleSuspension(user)}
                          className={`p-1.5 rounded-lg transition-colors ${user.is_suspended ? "text-green-600 hover:bg-green-50" : "text-orange-600 hover:bg-orange-50"}`}
                          title={user.is_suspended ? "Unsuspend" : "Suspend"}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {user.is_suspended ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            )}
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Table View - Visible only on mobile */}
        <div className="md:hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  User
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Plan
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-3 py-12 text-center text-sm text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading users…</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-3 py-12 text-center text-sm text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="px-3 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {user.username}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {user.email}
                        </span>
                        <div className="flex gap-1 mt-1">
                          {user.is_staff && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              Staff
                            </span>
                          )}
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            ID:{user.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`text-xs ${user.subscription?.active ? "text-green-600" : "text-gray-500"}`}
                      >
                        {user.subscription?.plan_name || "None"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.is_suspended ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                      >
                        {user.is_suspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleViewUser(user)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditUser(user)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleSuspension(user)}
                          className={`p-1.5 rounded-lg transition-colors ${user.is_suspended ? "text-green-600 hover:bg-green-50" : "text-orange-600 hover:bg-orange-50"}`}
                          title={user.is_suspended ? "Unsuspend" : "Suspend"}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {user.is_suspended ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            )}
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Fully Responsive */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-600 order-2 sm:order-1">
            Page{" "}
            <span className="font-semibold text-gray-900">{currentPage}</span>{" "}
            of <span className="font-semibold text-gray-900">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={currentPage <= 1}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              disabled={currentPage >= totalPages}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>

        {/* View User Modal - Fully Responsive */}
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  User details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Compact summary of account status, permissions, and activity
                  metadata.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="mt-3 sm:mt-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50 transition-colors"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {selectedUser && (
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Username
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-900 break-all">
                      {selectedUser.username}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Email
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-900 break-all">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Name
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-900 break-all">
                      {`${selectedUser.first_name || "-"} ${selectedUser.last_name || "-"}`}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Contact
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-900 break-all">
                      {selectedUser.phone || selectedUser.location || "—"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Status
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {selectedUser.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Role
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {selectedUser.is_staff ? "Staff" : "User"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Suspension
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {selectedUser.is_suspended ? "Suspended" : "Clear"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      2FA
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {selectedUser.is_2fa_enabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Joined
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {selectedUser.date_joined
                        ? new Date(
                            selectedUser.date_joined,
                          ).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Last login
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {selectedUser.last_login
                        ? new Date(selectedUser.last_login).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>

                {selectedUser.is_suspended && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-800">
                      Suspension details
                    </p>
                    <p className="mt-2 text-sm text-red-700 break-all">
                      {selectedUser.suspension_reason || "No reason provided"}
                    </p>
                    <p className="mt-2 text-xs text-red-500">
                      Suspended at:{" "}
                      {selectedUser.suspended_at
                        ? new Date(selectedUser.suspended_at).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="p-5 border-t border-gray-200 flex justify-end">
              <Button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
