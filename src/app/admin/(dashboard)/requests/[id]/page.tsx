import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import StatusUpdateForm from './StatusUpdateForm';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  QUOTED: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-purple-100 text-purple-800',
  RECEIVED: 'bg-indigo-100 text-indigo-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  COMPLETED: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-teal-100 text-teal-800',
};

async function getRequest(id: string) {
  return prisma.repairRequest.findUnique({
    where: { id },
  });
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getRequest(id);

  if (!request) {
    notFound();
  }

  return (
    <div>
      {/* Back Button */}
      <Link
        href="/admin/requests"
        className="inline-flex items-center gap-2 text-text-body hover:text-text-dark mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Requests
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">
            Request {request.ticketNumber}
          </h1>
          <p className="text-text-body mt-1">
            Submitted on{' '}
            {new Date(request.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span
          className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-full ${
            statusColors[request.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {request.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Device Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-text-dark mb-4">
              Device Information
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-text-body">Device Type</dt>
                <dd className="mt-1 text-text-dark font-medium">{request.deviceType}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-body">Ticket Number</dt>
                <dd className="mt-1 text-text-dark font-mono">{request.ticketNumber}</dd>
              </div>
            </dl>
          </div>

          {/* Issue Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-text-dark mb-4">Issue Details</h2>

            {request.commonIssues && request.commonIssues.length > 0 && (
              <div className="mb-4">
                <dt className="text-sm text-text-body mb-2">Reported Issues</dt>
                <dd className="flex flex-wrap gap-2">
                  {request.commonIssues.map((issue, index) => (
                    <span
                      key={index}
                      className="inline-flex px-3 py-1 bg-gray-100 text-text-dark text-sm rounded-full"
                    >
                      {issue}
                    </span>
                  ))}
                </dd>
              </div>
            )}

            <div>
              <dt className="text-sm text-text-body mb-2">Description</dt>
              <dd className="text-text-dark bg-gray-50 rounded-lg p-4">
                {request.issueDescription || 'No additional description provided.'}
              </dd>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-text-dark mb-4">Shipping Address</h2>
            <address className="not-italic text-text-dark">
              <p>{request.customerName}</p>
              <p>{request.shippingAddress}</p>
              <p>
                {request.shippingCity}, {request.shippingState} {request.shippingZip}
              </p>
            </address>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Update Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-text-dark mb-4">Update Status</h2>
            <StatusUpdateForm requestId={request.id} currentStatus={request.status} />
          </div>

          {/* Customer Contact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-text-dark mb-4">Customer Contact</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-text-body">Name</dt>
                <dd className="mt-1 text-text-dark font-medium">{request.customerName}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-body">Email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${request.customerEmail}`}
                    className="text-primary hover:text-primary-dark"
                  >
                    {request.customerEmail}
                  </a>
                </dd>
              </div>
              {request.customerPhone && (
                <div>
                  <dt className="text-sm text-text-body">Phone</dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${request.customerPhone}`}
                      className="text-primary hover:text-primary-dark"
                    >
                      {request.customerPhone}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-text-dark mb-4">Timeline</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-body">Created</dt>
                <dd className="text-text-dark">
                  {new Date(request.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-body">Last Updated</dt>
                <dd className="text-text-dark">
                  {new Date(request.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
