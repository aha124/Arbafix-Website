"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  completedThisMonth: number;
}

interface BlogStats {
  published: number;
  drafts: number;
}

interface RepairRequest {
  id: string;
  ticketNumber: string;
  status: string;
  deviceType: string;
  customerName: string;
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  const labels: Record<string, string> = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [blogStats, setBlogStats] = useState<BlogStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const [statsRes, requestsRes, blogRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/requests?limit=5"),
        fetch("/api/admin/blog"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setRecentRequests(requestsData.requests);
      }

      if (blogRes.ok) {
        const blogData = await blogRes.json();
        const published = blogData.posts.filter((p: { published: boolean }) => p.published).length;
        const drafts = blogData.posts.filter((p: { published: boolean }) => !p.published).length;
        setBlogStats({ published, drafts });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-bg-light">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-text-dark">Arbafix Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-body">{session.user?.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-body">Total Requests</p>
                <p className="text-2xl font-bold text-text-dark">{stats?.total ?? "-"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-50">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-body">Pending</p>
                <p className="text-2xl font-bold text-text-dark">{stats?.pending ?? "-"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-body">In Progress</p>
                <p className="text-2xl font-bold text-text-dark">{stats?.inProgress ?? "-"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50">
                <svg
                  className="w-6 h-6 text-success"
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
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-body">Completed (Month)</p>
                <p className="text-2xl font-bold text-text-dark">
                  {stats?.completedThisMonth ?? "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-50">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-dark">Blog Posts</h2>
                <p className="text-sm text-text-body">
                  {blogStats ? (
                    <>
                      <span className="text-success font-medium">{blogStats.published} published</span>
                      {" · "}
                      <span className="text-yellow-600 font-medium">{blogStats.drafts} drafts</span>
                    </>
                  ) : (
                    "Loading..."
                  )}
                </p>
              </div>
            </div>
            <Link
              href="/admin/blog"
              className="px-4 py-2 bg-primary text-white font-medium text-sm rounded-lg hover:bg-primary-dark transition-colors"
            >
              Manage Blog →
            </Link>
          </div>
        </div>

        {/* Recent Requests Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text-dark">Recent Repair Requests</h2>
            <Link
              href="/admin/requests"
              className="text-primary hover:text-primary-dark font-medium text-sm transition-colors"
            >
              View All Requests →
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="px-6 py-12 text-center text-text-body">
              <svg
                className="w-12 h-12 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p>No repair requests yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-body uppercase tracking-wider">
                      Ticket #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-body uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-body uppercase tracking-wider">
                      Device
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-body uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-body uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentRequests.map((request) => (
                    <tr
                      key={request.id}
                      onClick={() => router.push(`/admin/requests/${request.id}`)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                        {request.ticketNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">
                        {request.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-body">
                        {request.deviceType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-body">
                        {formatDate(request.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
