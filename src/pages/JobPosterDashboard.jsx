import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FaPlus,
  FaChartBar,
  FaList,
  FaUsers,
  FaClipboardCheck,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaBars,
  FaTimes,
  FaEnvelope,
  FaUser,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import authService from "../services/auth";
import JobCreateForm from "../components/jobs/JobCreateForm";
import Modal from "../components/common/Modal";

const JobPosterDashboard = () => {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedJobToEdit, setSelectedJobToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [reviewComments, setReviewComments] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobFilter, setJobFilter] = useState(null);
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone_number: user?.phone_number || '',
    email: user?.email || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      fetchPermissions();
      fetchStats();
      fetchMyJobs();
      // Initialize profile data from user
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        email: user.email || '',
      });
    }
  }, [user, token]);

  const fetchPermissions = async () => {
    try {
      const response = await authService.getJobPostingPermissions();
      setPermissions(response);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await authService.getPosterStats();
      const statsData = Array.isArray(response)
        ? response[0]
        : response.results
        ? response.results[0]
        : response;
      setStats(statsData || {});
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchMyJobs = async () => {
    try {
      const response = await authService.fetchJobs({ user_jobs: true });
      const jobsData = Array.isArray(response) ? response : response.results || response;
      setMyJobs(jobsData || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const fetchReviewComments = async (jobId) => {
    try {
      const response = await authService.getJobReviewHistory(jobId);
      setReviewComments(response || []);
    } catch (error) {
      console.error("Failed to fetch review comments:", error);
      setReviewComments([]);
    }
  };

  useEffect(() => {
    if (selectedJob) {
      fetchReviewComments(selectedJob.id);
    }
  }, [selectedJob]);

  const handleCreateJob = () => {
    setActiveTab("post-new");
    setMobileMenuOpen(false);
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
    setActiveTab("jobs");
    setMobileMenuOpen(false);
  };

  const closeDetailsModal = () => {
    setSelectedJob(null);
    setShowDetailsModal(false);
    setReviewComments([]);
  };

   const handleEditJob = (job) => {
     setSelectedJobToEdit(job);
     setShowEditModal(true);
   };

   const handleProfileUpdate = async (e) => {
     e.preventDefault();
     setProfileLoading(true);
     try {
       const response = await authService.updateProfile(profileData);
       toast.success('Profile updated successfully!');
       // Update user data in context if needed
       // Note: This assumes the auth context updates automatically or we need to refresh
       setProfileLoading(false);
     } catch (error) {
       console.error('Failed to update profile:', error);
       toast.error('Failed to update profile. Please try again.');
       setProfileLoading(false);
     }
   };

   const closeEditModal = () => {
    setSelectedJobToEdit(null);
    setShowEditModal(false);
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.is_staff_poster) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 transform transition-all">
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-3xl sm:text-4xl text-yellow-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Access Restricted</h2>
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              Your account is not authorized to post jobs. Please contact your administrator to request access.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !permissions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

const tabs = [
  { id: "overview", label: "Overview", icon: FaChartBar },
  { id: "profile", label: "Profile", icon: FaUser },
  { id: "jobs", label: "My Jobs", icon: FaList },
  { id: "post-new", label: "Post Job", icon: FaPlus },
  { id: "support", label: "Support", icon: FaUsers },
];

  const StatCard = ({ title, value, icon: Icon, color, bgColor, onClick }) => (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:scale-105 transform' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-1">
            {value}
          </p>
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${bgColor} rounded-full flex items-center justify-center`}>
          <Icon className={`text-lg sm:text-xl ${color}`} />
        </div>
      </div>
    </div>
  );

const renderOverview = () => (
  <div className="space-y-4 sm:space-y-6">
    {/* Stats Grid */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StatCard 
        title="Total Posted" 
        value={stats?.total_jobs_posted || 0} 
        icon={FaClipboardCheck}
        color="text-primary-600"
        bgColor="bg-primary-50"
        onClick={() => {
          setJobFilter(null);
          setActiveTab("jobs");
          setMobileMenuOpen(false);
        }}
      />
      <StatCard 
        title="Approved" 
        value={stats?.total_jobs_approved || 0} 
        icon={FaCheckCircle}
        color="text-green-600"
        bgColor="bg-green-50"
        onClick={() => {
          setJobFilter("approved");
          setActiveTab("jobs");
          setMobileMenuOpen(false);
        }}
      />
      <StatCard 
        title="Pending" 
        value={stats?.total_jobs_pending || 0} 
        icon={FaClock}
        color="text-yellow-600"
        bgColor="bg-yellow-50"
        onClick={() => {
          setJobFilter("pending");
          setActiveTab("jobs");
          setMobileMenuOpen(false);
        }}
      />
      <StatCard 
        title="Rejected" 
        value={stats?.total_jobs_rejected || 0} 
        icon={FaTimesCircle}
        color="text-red-600"
        bgColor="bg-red-50"
        onClick={() => {
          setJobFilter("rejected");
          setActiveTab("jobs");
          setMobileMenuOpen(false);
        }}
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Posting Limits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Posting Limits</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs sm:text-sm mb-2">
              <span className="text-gray-600">Daily Usage</span>
              <span className="font-medium text-gray-900">
                {permissions.limits.posted_today} / {permissions.limits.daily_limit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((permissions.limits.posted_today / permissions.limits.daily_limit) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs sm:text-sm mb-2">
              <span className="text-gray-600">Monthly Usage</span>
              <span className="font-medium text-gray-900">
                {permissions.limits.posted_this_month} / {permissions.limits.monthly_limit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-accent-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((permissions.limits.posted_this_month / permissions.limits.monthly_limit) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-600">{permissions.posting_status}</p>
        </div>
      </div>

      {/* Approval Rate */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Approval Rate</h3>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary-50 mb-3">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600">
              {stats?.approval_rate || 0}%
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            {stats?.total_jobs_approved || 0} approved out of{" "}
            {stats?.total_jobs_posted || 0} jobs posted
          </p>
        </div>
        {permissions.assigned_to_staff && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <FaUser className="text-primary-600" />
              <span>Assigned to: <strong>{permissions.assigned_to_staff.username}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Recent Jobs - Shows last 5 posted jobs (most recent first) */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Jobs</h3>
        <button
          onClick={() => {
            setJobFilter(null);
            setActiveTab("jobs");
          }}
          className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium transition-colors"
        >
          View All →
        </button>
      </div>
      {myJobs.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <FaClipboardCheck className="text-4xl sm:text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm sm:text-base">No jobs posted yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...myJobs]
            .sort((a, b) => new Date(b.posted_at) - new Date(a.posted_at)) // Sort by most recent first
            .slice(0, 5) // Take only the first 5
            .map((job) => (
              <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1 mb-2 sm:mb-0">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{job.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{job.company?.name}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                      job.approval_status === "approved"
                        ? "bg-green-100 text-green-800"
                        : job.approval_status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {job.approval_status}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(job.posted_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  </div>
);

  const renderMyJobs = () => {
    const getFilteredJobs = () => {
      if (!jobFilter) {
        // Show all non-approved jobs (pending + rejected) when no filter
        return myJobs.filter(job => !job.is_approved);
      }
      
      if (jobFilter === "approved") {
        return myJobs.filter(job => job.is_approved);
      }
      
      if (jobFilter === "pending") {
        return myJobs.filter(job => !job.is_approved && job.approval_status === "pending");
      }
      
      if (jobFilter === "rejected") {
        return myJobs.filter(job => job.approval_status === "rejected");
      }
      
      return myJobs.filter(job => !job.is_approved);
    };

    const getFilterTitle = () => {
      if (!jobFilter) return "All Jobs (Pending & Rejected)";
      if (jobFilter === "approved") return "Approved Jobs";
      if (jobFilter === "pending") return "Pending Jobs";
      if (jobFilter === "rejected") return "Rejected Jobs";
      return "My Jobs";
    };

    const filteredJobs = getFilteredJobs();

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6 flex-wrap gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{getFilterTitle()}</h2>
          {jobFilter && (
            <button
              onClick={() => setJobFilter(null)}
              className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Clear filter ×
            </button>
          )}
        </div>
        
        {filteredJobs.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClipboardCheck className="text-3xl sm:text-4xl text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm sm:text-base mb-4">
              {jobFilter === "approved" && "You don't have any approved jobs yet."}
              {jobFilter === "pending" && "You don't have any pending jobs."}
              {jobFilter === "rejected" && "You don't have any rejected jobs."}
              {!jobFilter && "You haven't posted any jobs yet."}
            </p>
            {!jobFilter && (
              <button
                onClick={() => setActiveTab("post-new")}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Post Your First Job
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaBuilding className="text-gray-400" />
                        {job.company?.name}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-gray-400" />
                        {job.location}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-400" />
                        {new Date(job.posted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${
                        job.is_approved
                          ? "bg-green-100 text-green-800"
                          : job.approval_status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {job.is_approved ? "Approved" : job.approval_status}
                    </span>
                  </div>
                </div>

                {job.rejection_reason && (
                  <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs sm:text-sm text-red-800">
                      <strong>Rejection reason:</strong> {job.rejection_reason}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleViewJob(job)}
                    className="border border-gray-300 px-4 py-1.5 text-xs sm:text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </button>
                  {!job.is_approved && (
                    <button
                      onClick={() => handleEditJob(job)}
                      className="border border-amber-300 text-amber-700 px-4 py-1.5 text-xs sm:text-sm rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      Edit Job
                    </button>
                  )}
                  {!job.is_approved && job.approval_status !== "rejected" && (
                    <span className="text-xs sm:text-sm text-yellow-600 flex items-center gap-1">
                      <FaClock className="text-yellow-500" />
                      Pending Review
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPostNewJob = () => (
    <div className="space-y-4">
      {/* Compact Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0">
            <FaPlus className="text-lg text-primary-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-gray-900">Post a New Job</h2>
            <p className="text-xs text-gray-600">
              Create job postings directly from your dashboard. Admin will review them before going live.
            </p>
          </div>
        </div>
        
        {/* Compact Note */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 m-4 rounded">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> All job postings are submitted for admin review before they go live.
          </p>
        </div>
      </div>

      {/* Job Form */}
      <JobCreateForm
        initialData={null}
        onCancel={() => setActiveTab('overview')}
        onSuccess={() => {
          toast.success('Job submitted for review.');
          fetchStats();
          fetchMyJobs();
          setActiveTab('jobs');
        }}
      />
    </div>
  );

   const renderSupport = () => (
     <div className="space-y-6">
       {/* Success Center */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
         <div className="flex items-start justify-between gap-4 mb-6">
           <div>
             <h2 className="text-lg sm:text-xl font-bold text-gray-900">
               Job Posting Success Center
             </h2>
             <p className="text-sm text-gray-600 mt-1">
               Improve your approval rate and attract better candidates with these recommendations.
             </p>
           </div>

           <div className="hidden sm:flex w-14 h-14 bg-primary-50 rounded-full items-center justify-center">
             <FaChartBar className="text-2xl text-primary-600" />
           </div>
         </div>

         {/* Tips Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[
             {
               title: "Use Clear Job Titles",
               text: "Specific titles like 'Frontend React Developer' perform better than generic titles.",
               icon: FaClipboardCheck,
               color: "bg-blue-50 text-blue-600",
             },
             {
               title: "Add Salary Information",
               text: "Jobs with salary ranges usually attract more applications and faster approvals.",
               icon: FaCheckCircle,
               color: "bg-green-50 text-green-600",
             },
             {
               title: "Write Detailed Requirements",
               text: "Clearly list skills, experience, and expectations to reduce low-quality applications.",
               icon: FaList,
               color: "bg-purple-50 text-purple-600",
             },
             {
               title: "Keep Descriptions Professional",
               text: "Avoid incomplete or unclear job descriptions to improve approval chances.",
               icon: FaUsers,
               color: "bg-orange-50 text-orange-600",
             },
           ].map((tip, index) => {
             const Icon = tip.icon;

             return (
               <div
                 key={index}
                 className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all"
               >
                 <div
                   className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${tip.color}`}
                 >
                   <Icon className="text-lg" />
                 </div>

                 <h3 className="font-semibold text-gray-900 mb-2">
                   {tip.title}
                 </h3>

                 <p className="text-sm text-gray-600 leading-relaxed">
                   {tip.text}
                 </p>
               </div>
             );
           })}
         </div>
       </div>

       {/* Smart Insights */}
       <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-5 sm:p-6 text-white">
         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
           <div>
             <h3 className="text-lg font-semibold">
               Smart Recommendation
             </h3>

             <p className="text-sm text-primary-100 mt-2 max-w-2xl">
               Posters with complete job descriptions, salary ranges, and clear
               requirements typically receive faster approvals and more qualified applicants.
             </p>
           </div>

           <button
             onClick={() => setActiveTab("post-new")}
             className="bg-white text-primary-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
           >
             Post Better Jobs
           </button>
         </div>
       </div>

       {/* Performance Summary */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
         <div className="flex items-center justify-between mb-5">
           <h3 className="text-lg font-semibold text-gray-900">
             Your Posting Performance
           </h3>

           <div className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full">
             Live Insights
           </div>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-gray-50 rounded-xl p-4 text-center">
             <p className="text-2xl font-bold text-gray-900">
               {stats?.total_jobs_posted || 0}
             </p>
             <p className="text-xs text-gray-500 mt-1">
               Total Jobs
             </p>
           </div>

           <div className="bg-green-50 rounded-xl p-4 text-center">
             <p className="text-2xl font-bold text-green-700">
               {stats?.approval_rate || 0}%
             </p>
             <p className="text-xs text-green-600 mt-1">
               Approval Rate
             </p>
           </div>

           <div className="bg-yellow-50 rounded-xl p-4 text-center">
             <p className="text-2xl font-bold text-yellow-700">
               {stats?.total_jobs_pending || 0}
             </p>
             <p className="text-xs text-yellow-600 mt-1">
               Pending Review
             </p>
           </div>

           <div className="bg-blue-50 rounded-xl p-4 text-center">
             <p className="text-2xl font-bold text-blue-700">
               {permissions?.limits?.posted_this_month || 0}
             </p>
             <p className="text-xs text-blue-600 mt-1">
               Posted This Month
             </p>
           </div>
         </div>
       </div>
     </div>
   );

   const renderProfile = () => {
     return (
       <div className="space-y-6">
         {/* Profile Header */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg sm:text-xl font-bold text-gray-900">
               Profile Settings
             </h2>
             <div className="flex items-center gap-2">
               <FaUser className="text-primary-600 w-8 h-8" />
               <span className="font-medium text-gray-900">
                 {user?.first_name || user?.username || 'User'}
               </span>
             </div>
           </div>
           <p className="text-sm text-gray-600">
             Update your personal information and account details.
           </p>
         </div>

         {/* Profile Form */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
           <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
             Personal Information
           </h3>
           <form onSubmit={handleProfileUpdate}>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   First Name
                 </label>
                 <input
                   type="text"
                   value={profileData.first_name}
                   onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                   placeholder="Enter your first name"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Last Name
                 </label>
                 <input
                   type="text"
                   value={profileData.last_name}
                   onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                   placeholder="Enter your last name"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Phone Number
                 </label>
                 <input
                   type="tel"
                   value={profileData.phone_number}
                   onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                   placeholder="Enter your phone number"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Email
                 </label>
                 <input
                   type="email"
                   value={profileData.email}
                   onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                   placeholder="Enter your email"
                 />
               </div>
             </div>
             <div className="mt-6">
               <button
                 type="submit"
                 className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto"
               >
                 Update Profile
               </button>
             </div>
           </form>
         </div>

         {/* Security Section */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
           <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
             Account Security
           </h3>
           <p className="text-sm text-gray-600 mb-4">
             For security reasons, password changes should be done through the account settings page.
           </p>
           <button
             onClick={() => navigate("/settings")}
             className="border border-primary-300 text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
           >
             Go to Account Settings
           </button>
         </div>
       </div>
     );
   };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Job Poster Dashboard</h1>
            <p className="text-xs text-gray-600 mt-0.5">
              Welcome, {user?.first_name || user?.username}
            </p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-2 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === id
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="text-lg" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
            <button
              onClick={() => {
                authService.logout();
                window.location.href = '/login';
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <FaTimesCircle className="text-lg" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Job Poster Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.first_name || user?.username}!
            </p>
          </div>
          <button
            onClick={() => {
              authService.logout();
              window.location.href = '/login';
            }}
            className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden lg:block border-b border-gray-200 mb-6">
          <nav className="flex space-x-6">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="text-base" />
                {label}
              </button>
            ))}
          </nav>
        </div>

         {/* Content */}
         <div className="mt-4 lg:mt-0">
           {activeTab === "overview" && renderOverview()}
           {activeTab === "profile" && renderProfile()}
           {activeTab === "jobs" && renderMyJobs()}
           {activeTab === "post-new" && renderPostNewJob()}
           {activeTab === "support" && renderSupport()}
         </div>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={closeEditModal}
        title={selectedJobToEdit ? "Edit job submission" : "Edit job"}
        size="xl"
      >
        {selectedJobToEdit && (
          <JobCreateForm
            initialData={selectedJobToEdit}
            onCancel={closeEditModal}
            onSuccess={() => {
              toast.success("Job updated and resubmitted for review.");
              closeEditModal();
              fetchStats();
              fetchMyJobs();
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={showDetailsModal}
        onClose={closeDetailsModal}
        title="Job details"
        size="xl"
      >
        {selectedJob && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{selectedJob.title}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedJob.is_approved ? 'bg-green-100 text-green-800' : selectedJob.approval_status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {selectedJob.is_approved ? 'Approved' : selectedJob.approval_status || 'Pending'}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Company</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{selectedJob.company?.name || selectedJob.company || '—'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{selectedJob.location || '—'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Job Type</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{selectedJob.job_type || '—'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Experience</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{selectedJob.experience_level || '—'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</p>
                <p className="text-sm text-gray-900 mt-2 whitespace-pre-wrap">{selectedJob.description || 'No description provided.'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Requirements</p>
                <p className="text-sm text-gray-900 mt-2 whitespace-pre-wrap">{selectedJob.requirements || 'No requirements provided.'}</p>
              </div>
            </div>

            {(selectedJob.rejection_reason || reviewComments.length > 0) && (
              <div className="space-y-4 bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-red-800">Review feedback</p>
                {selectedJob.rejection_reason && (
                  <p className="text-sm text-red-700">{selectedJob.rejection_reason}</p>
                )}
                {reviewComments.length > 0 && (
                  <div className="space-y-3">
                    {reviewComments.map((comment) => (
                      <div key={comment.id} className="rounded-xl bg-white p-3 border border-red-100">
                        <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-2">
                          <span>{comment.reviewer || 'Reviewer'}</span>
                          <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-red-700 whitespace-pre-wrap">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              {!selectedJob.is_approved && (
                <button
                  type="button"
                  onClick={() => {
                    closeDetailsModal();
                    handleEditJob(selectedJob);
                  }}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
                >
                  Edit Job
                </button>
              )}
              <button
                type="button"
                onClick={closeDetailsModal}
                className="rounded-xl bg-gray-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobPosterDashboard;