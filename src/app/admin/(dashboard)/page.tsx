import Link from 'next/link';
import { prisma } from '@/lib/db';
import {
  ClipboardList,
  Clock,
  Loader,
  CheckCircle,
  Eye
} from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  QUOTED: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-purple-100 text-purple-800',
  RECEIVED: 'bg-indigo-100 text-indigo-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  COMPLETED: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-teal-100 text-teal-800',
};

async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, pending, inProgress, completedThisMonth] = await Promise.all([
    prisma.repairRequest.count(),
    prisma.repairRequest.count({ where: { status: 'PENDING' } }),
    prisma.repairRequest.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.repairRequest.count({
      where: {
        status: 'COMPLETED',
        updatedAt: { gte: startOfMonth },
      },
    }),
  ]);

  return { total, pending, inProgress, completedThisMonth };
}

async function getRecentRequests() {
  return prisma.repairRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
}

export default async function AdminDashboardPage() {
  const [stats, requests] = await Promise.all([getStats(), getRecentRequests()]);

  const statCards = [
    {
      label: 'Total Requests',
      value: stats.total,
      icon: ClipboardList,
      color: 'bg-blue-500',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Loader,
      color: 'bg-orange-500',
    },
    {
      label: 'Completed This Month',
      value: stats.completedThisMonth,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-dark mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-dark">{stat.value}</p>
                  <p className="text-sm text-text-body">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-dark">Recent Requests</h2>
            <Link
              href="/admin/requests"
              className="text-primary hover:text-primary-dark text-sm font-medium"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-body uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-body uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-body uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-body uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-body uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-body uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-body">
                    No repair requests yet.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium text-text-dark">
                        {request.ticketNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-text-dark">{request.customerName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-text-body">{request.deviceType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          statusColors[request.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {request.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-text-body">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/requests/${request.id}`}
                        className="inline-flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
