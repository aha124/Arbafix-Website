import { Resend } from "resend";

// Lazy initialization to avoid build-time errors when env vars aren't available
function getResendClient(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

// Brand colors
const BRAND_BLUE = "#2563eb";
const TEXT_DARK = "#1e293b";
const TEXT_BODY = "#64748b";
const BG_LIGHT = "#f8fafc";

// Base email template wrapper
function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Arbafix</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BG_LIGHT};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${BG_LIGHT};">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: ${BRAND_BLUE}; padding: 24px 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Arbafix</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Video Game Console Repair</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: ${BG_LIGHT}; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: ${TEXT_BODY}; font-size: 14px;">
                Questions? Reply to this email or contact us anytime.
              </p>
              <p style="margin: 12px 0 0 0; color: ${TEXT_BODY}; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Arbafix. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Status display names and descriptions
const STATUS_INFO: Record<string, { label: string; description: string; nextSteps: string }> = {
  PENDING: {
    label: "Pending",
    description: "Your repair request has been received and is awaiting review.",
    nextSteps: "We'll review your request and send you a quote within 24 hours.",
  },
  APPROVED: {
    label: "Approved",
    description: "Your repair request has been approved and payment has been received.",
    nextSteps: "Please ship your device to us. We'll begin repairs as soon as it arrives.",
  },
  IN_PROGRESS: {
    label: "In Progress",
    description: "Great news! We've started working on your repair.",
    nextSteps: "We'll keep you updated on the progress and notify you when it's complete.",
  },
  COMPLETED: {
    label: "Completed",
    description: "Your repair has been completed successfully!",
    nextSteps: "Your device is ready for pickup or will be shipped back to you shortly.",
  },
  CANCELLED: {
    label: "Cancelled",
    description: "This repair request has been cancelled.",
    nextSteps: "If you have questions or would like to submit a new request, please contact us.",
  },
};

interface RepairRequestData {
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  deviceType: string;
  issueDescription: string;
  commonIssues?: string[];
}

// Email 1: Customer confirmation when they submit a request
export async function sendCustomerConfirmationEmail(data: RepairRequestData) {
  // Log input data for debugging (same as status update email for comparison)
  console.log("[sendCustomerConfirmationEmail] Called with data:", {
    ticketNumber: data.ticketNumber,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    deviceType: data.deviceType,
  });

  const { ticketNumber, customerName, customerEmail, deviceType, issueDescription } = data;

  const content = `
    <h2 style="margin: 0 0 16px 0; color: ${TEXT_DARK}; font-size: 24px; font-weight: 600;">
      Thank You for Your Repair Request!
    </h2>
    <p style="margin: 0 0 24px 0; color: ${TEXT_BODY}; font-size: 16px; line-height: 1.6;">
      Hi ${customerName},
    </p>
    <p style="margin: 0 0 24px 0; color: ${TEXT_BODY}; font-size: 16px; line-height: 1.6;">
      We've received your repair request and our team is reviewing it now.
    </p>

    <!-- Ticket Number Box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
      <tr>
        <td style="background-color: ${BG_LIGHT}; border-radius: 8px; padding: 20px; text-align: center; border: 2px dashed ${BRAND_BLUE};">
          <p style="margin: 0 0 8px 0; color: ${TEXT_BODY}; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Ticket Number</p>
          <p style="margin: 0; color: ${BRAND_BLUE}; font-size: 32px; font-weight: 700; letter-spacing: 2px;">${ticketNumber}</p>
        </td>
      </tr>
    </table>

    <!-- Request Details -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: ${BG_LIGHT}; border-radius: 8px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px 0; color: ${TEXT_DARK}; font-size: 16px; font-weight: 600;">Request Details</p>
          <p style="margin: 0 0 8px 0; color: ${TEXT_BODY}; font-size: 14px;">
            <strong style="color: ${TEXT_DARK};">Device:</strong> ${deviceType}
          </p>
          <p style="margin: 0; color: ${TEXT_BODY}; font-size: 14px;">
            <strong style="color: ${TEXT_DARK};">Issue:</strong> ${issueDescription}
          </p>
        </td>
      </tr>
    </table>

    <!-- Next Steps -->
    <h3 style="margin: 0 0 16px 0; color: ${TEXT_DARK}; font-size: 18px; font-weight: 600;">What's Next?</h3>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 0 0 12px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 28px; height: 28px; background-color: ${BRAND_BLUE}; border-radius: 50%; text-align: center; vertical-align: middle;">
                <span style="color: #ffffff; font-size: 14px; font-weight: 600;">1</span>
              </td>
              <td style="padding-left: 12px; color: ${TEXT_BODY}; font-size: 14px; line-height: 1.5;">
                We'll review your request and assess the repair needs
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 0 12px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 28px; height: 28px; background-color: ${BRAND_BLUE}; border-radius: 50%; text-align: center; vertical-align: middle;">
                <span style="color: #ffffff; font-size: 14px; font-weight: 600;">2</span>
              </td>
              <td style="padding-left: 12px; color: ${TEXT_BODY}; font-size: 14px; line-height: 1.5;">
                You'll receive a quote via email within 24 hours
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 28px; height: 28px; background-color: ${BRAND_BLUE}; border-radius: 50%; text-align: center; vertical-align: middle;">
                <span style="color: #ffffff; font-size: 14px; font-weight: 600;">3</span>
              </td>
              <td style="padding-left: 12px; color: ${TEXT_BODY}; font-size: 14px; line-height: 1.5;">
                Once approved, we'll begin your repair right away
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin: 24px 0 0 0; color: ${TEXT_BODY}; font-size: 14px; line-height: 1.6;">
      Save this email for your records. You can reference your ticket number <strong style="color: ${TEXT_DARK};">${ticketNumber}</strong> in any future communications.
    </p>
  `;

  // Log the full email payload before sending
  const emailPayload = {
    from: "Arbafix <onboarding@resend.dev>",
    to: customerEmail,
    subject: `Repair Request Received - ${ticketNumber}`,
  };
  console.log("[sendCustomerConfirmationEmail] Email payload:", emailPayload);

  try {
    console.log("[sendCustomerConfirmationEmail] Calling resend.emails.send()...");
    const { data: responseData, error } = await getResendClient().emails.send({
      from: emailPayload.from,
      to: emailPayload.to,
      subject: emailPayload.subject,
      html: emailWrapper(content),
    });

    if (error) {
      console.error("[sendCustomerConfirmationEmail] Resend API error:", JSON.stringify(error, null, 2));
      return { success: false, error };
    }

    console.log("[sendCustomerConfirmationEmail] Email sent successfully:", responseData);
    return { success: true };
  } catch (error) {
    console.error("[sendCustomerConfirmationEmail] Exception caught:", error);
    return { success: false, error };
  }
}

// Email 2: Admin notification when new request comes in
export async function sendAdminNotificationEmail(data: RepairRequestData & { requestId: string }) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.error("ADMIN_EMAIL not configured");
    return { success: false, error: "ADMIN_EMAIL not configured" };
  }

  const { ticketNumber, customerName, customerEmail, deviceType, issueDescription, commonIssues, requestId } = data;
  const adminDashboardUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/admin/requests/${requestId}`
    : `/admin/requests/${requestId}`;

  const issuesList = commonIssues && commonIssues.length > 0
    ? commonIssues.map(issue => `<li style="color: ${TEXT_BODY}; font-size: 14px; margin-bottom: 4px;">${issue}</li>`).join("")
    : "";

  const content = `
    <h2 style="margin: 0 0 16px 0; color: ${TEXT_DARK}; font-size: 24px; font-weight: 600;">
      New Repair Request Received
    </h2>

    <!-- Ticket Number Box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
      <tr>
        <td style="background-color: #fef3c7; border-radius: 8px; padding: 16px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: ${TEXT_DARK}; font-size: 16px;">
            <strong>Ticket:</strong> ${ticketNumber}
          </p>
        </td>
      </tr>
    </table>

    <!-- Customer Info -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: ${BG_LIGHT}; border-radius: 8px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 16px 0; color: ${TEXT_DARK}; font-size: 16px; font-weight: 600;">Customer Information</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 4px 0; color: ${TEXT_BODY}; font-size: 14px; width: 100px;">Name:</td>
              <td style="padding: 4px 0; color: ${TEXT_DARK}; font-size: 14px; font-weight: 500;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: ${TEXT_BODY}; font-size: 14px;">Email:</td>
              <td style="padding: 4px 0; color: ${TEXT_DARK}; font-size: 14px;">
                <a href="mailto:${customerEmail}" style="color: ${BRAND_BLUE}; text-decoration: none;">${customerEmail}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Device Info -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: ${BG_LIGHT}; border-radius: 8px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 16px 0; color: ${TEXT_DARK}; font-size: 16px; font-weight: 600;">Device Details</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 4px 0; color: ${TEXT_BODY}; font-size: 14px; width: 100px;">Device:</td>
              <td style="padding: 4px 0; color: ${TEXT_DARK}; font-size: 14px; font-weight: 500;">${deviceType}</td>
            </tr>
          </table>
          ${issuesList ? `
          <p style="margin: 12px 0 8px 0; color: ${TEXT_BODY}; font-size: 14px;">Reported Issues:</p>
          <ul style="margin: 0; padding-left: 20px;">${issuesList}</ul>
          ` : ""}
          <p style="margin: 12px 0 8px 0; color: ${TEXT_BODY}; font-size: 14px;">Description:</p>
          <p style="margin: 0; color: ${TEXT_DARK}; font-size: 14px; background-color: #ffffff; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">${issueDescription}</p>
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="text-align: center;">
          <a href="${adminDashboardUrl}" style="display: inline-block; background-color: ${BRAND_BLUE}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
            View in Dashboard
          </a>
        </td>
      </tr>
    </table>
  `;

  try {
    const { error } = await getResendClient().emails.send({
      from: "Arbafix <onboarding@resend.dev>",
      to: adminEmail,
      subject: `New Repair Request - ${ticketNumber}`,
      html: emailWrapper(content),
    });

    if (error) {
      console.error("Failed to send admin notification email:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
    return { success: false, error };
  }
}

// Helper function to add timeout to a promise
function withTimeout<T>(promise: Promise<T>, ms: number, operation: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${operation} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

// Email 3: Customer notification when status changes
export async function sendStatusUpdateEmail(data: {
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  deviceType: string;
  oldStatus: string;
  newStatus: string;
}) {
  // Log input data for debugging
  console.log("[sendStatusUpdateEmail] Called with data:", {
    ticketNumber: data.ticketNumber,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    deviceType: data.deviceType,
    oldStatus: data.oldStatus,
    newStatus: data.newStatus,
  });

  // Validate customer email
  if (!data.customerEmail) {
    console.error("[sendStatusUpdateEmail] ERROR: customerEmail is undefined or empty");
    return { success: false, error: "Customer email is missing" };
  }

  const { ticketNumber, customerName, customerEmail, deviceType, newStatus } = data;
  const statusInfo = STATUS_INFO[newStatus] || STATUS_INFO.PENDING;

  // Set status badge color
  let statusColor = BRAND_BLUE;
  if (newStatus === "COMPLETED") statusColor = "#16a34a";
  if (newStatus === "CANCELLED") statusColor = "#dc2626";
  if (newStatus === "IN_PROGRESS") statusColor = "#f59e0b";

  const content = `
    <h2 style="margin: 0 0 16px 0; color: ${TEXT_DARK}; font-size: 24px; font-weight: 600;">
      Repair Status Update
    </h2>
    <p style="margin: 0 0 24px 0; color: ${TEXT_BODY}; font-size: 16px; line-height: 1.6;">
      Hi ${customerName},
    </p>
    <p style="margin: 0 0 24px 0; color: ${TEXT_BODY}; font-size: 16px; line-height: 1.6;">
      There's an update on your repair request for your <strong style="color: ${TEXT_DARK};">${deviceType}</strong>.
    </p>

    <!-- Status Box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
      <tr>
        <td style="background-color: ${BG_LIGHT}; border-radius: 8px; padding: 24px; text-align: center;">
          <p style="margin: 0 0 8px 0; color: ${TEXT_BODY}; font-size: 14px;">Ticket: <strong style="color: ${TEXT_DARK};">${ticketNumber}</strong></p>
          <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 16px auto;">
            <tr>
              <td style="background-color: ${statusColor}; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                ${statusInfo.label}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Status Description -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: ${BG_LIGHT}; border-radius: 8px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px 0; color: ${TEXT_DARK}; font-size: 16px; font-weight: 600;">What This Means</p>
          <p style="margin: 0 0 16px 0; color: ${TEXT_BODY}; font-size: 14px; line-height: 1.6;">
            ${statusInfo.description}
          </p>
          <p style="margin: 0 0 8px 0; color: ${TEXT_DARK}; font-size: 14px; font-weight: 600;">Next Steps:</p>
          <p style="margin: 0; color: ${TEXT_BODY}; font-size: 14px; line-height: 1.6;">
            ${statusInfo.nextSteps}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0; color: ${TEXT_BODY}; font-size: 14px; line-height: 1.6;">
      If you have any questions about your repair, feel free to reply to this email and we'll get back to you as soon as possible.
    </p>
  `;

  // Log the full email payload before sending
  const emailPayload = {
    from: "Arbafix <onboarding@resend.dev>",
    to: customerEmail,
    subject: `Repair Update - ${ticketNumber}`,
  };
  console.log("[sendStatusUpdateEmail] Email payload:", emailPayload);

  try {
    console.log("[sendStatusUpdateEmail] Calling resend.emails.send() with 30s timeout...");
    const { data: responseData, error } = await withTimeout(
      getResendClient().emails.send({
        from: emailPayload.from,
        to: emailPayload.to,
        subject: emailPayload.subject,
        html: emailWrapper(content),
      }),
      30000,
      "Status update email send"
    );

    if (error) {
      console.error("[sendStatusUpdateEmail] Resend API error:", JSON.stringify(error, null, 2));
      return { success: false, error };
    }

    console.log("[sendStatusUpdateEmail] Email sent successfully:", responseData);
    return { success: true };
  } catch (error) {
    console.error("[sendStatusUpdateEmail] Exception caught:", error);
    return { success: false, error };
  }
}

// Email 4: Quote email sent to customer
export async function sendQuoteEmail(data: {
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  deviceType: string;
  issueDescription: string;
  quoteAmount: number; // in cents
  depositAmount: number | null; // in cents
  paymentUrl: string;
}) {
  console.log("[sendQuoteEmail] Called with data:", {
    ticketNumber: data.ticketNumber,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    quoteAmount: data.quoteAmount,
    depositAmount: data.depositAmount,
  });

  const {
    ticketNumber,
    customerName,
    customerEmail,
    deviceType,
    issueDescription,
    quoteAmount,
    depositAmount,
    paymentUrl,
  } = data;

  const formattedQuote = (quoteAmount / 100).toFixed(2);
  const formattedDeposit = depositAmount ? (depositAmount / 100).toFixed(2) : null;
  const paymentAmount = depositAmount || quoteAmount;
  const formattedPaymentAmount = (paymentAmount / 100).toFixed(2);

  const content = `
    <h2 style="margin: 0 0 16px 0; color: ${TEXT_DARK}; font-size: 24px; font-weight: 600;">
      Your Repair Quote is Ready
    </h2>
    <p style="margin: 0 0 24px 0; color: ${TEXT_BODY}; font-size: 16px; line-height: 1.6;">
      Hi ${customerName},
    </p>
    <p style="margin: 0 0 24px 0; color: ${TEXT_BODY}; font-size: 16px; line-height: 1.6;">
      We've reviewed your repair request and prepared a quote for you.
    </p>

    <!-- Ticket Number Box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
      <tr>
        <td style="background-color: ${BG_LIGHT}; border-radius: 8px; padding: 16px; border-left: 4px solid ${BRAND_BLUE};">
          <p style="margin: 0; color: ${TEXT_DARK}; font-size: 14px;">
            <strong>Ticket:</strong> ${ticketNumber}
          </p>
          <p style="margin: 8px 0 0 0; color: ${TEXT_DARK}; font-size: 14px;">
            <strong>Device:</strong> ${deviceType}
          </p>
        </td>
      </tr>
    </table>

    <!-- Quote Amount -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
      <tr>
        <td style="background-color: #ecfdf5; border-radius: 8px; padding: 24px; text-align: center; border: 2px solid #10b981;">
          <p style="margin: 0 0 8px 0; color: ${TEXT_BODY}; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
            ${depositAmount ? "Total Quote" : "Repair Quote"}
          </p>
          <p style="margin: 0; color: #059669; font-size: 36px; font-weight: 700;">$${formattedQuote}</p>
          ${depositAmount ? `
          <p style="margin: 16px 0 0 0; color: ${TEXT_BODY}; font-size: 14px;">
            <strong>Deposit Required:</strong> $${formattedDeposit}
          </p>
          <p style="margin: 4px 0 0 0; color: ${TEXT_BODY}; font-size: 12px;">
            (Remaining balance due upon completion)
          </p>
          ` : ""}
        </td>
      </tr>
    </table>

    <!-- Issue Description -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: ${BG_LIGHT}; border-radius: 8px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px 0; color: ${TEXT_DARK}; font-size: 16px; font-weight: 600;">Repair Details</p>
          <p style="margin: 0; color: ${TEXT_BODY}; font-size: 14px; line-height: 1.6; background-color: #ffffff; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">
            ${issueDescription}
          </p>
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
      <tr>
        <td style="text-align: center;">
          <a href="${paymentUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 18px; font-weight: 600;">
            Pay Now - $${formattedPaymentAmount}
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 0; color: ${TEXT_BODY}; font-size: 14px; line-height: 1.6; text-align: center;">
      Once payment is received, we'll begin your repair right away.
    </p>
  `;

  const emailPayload = {
    from: "Arbafix <onboarding@resend.dev>",
    to: customerEmail,
    subject: `Your Repair Quote - ${ticketNumber}`,
  };
  console.log("[sendQuoteEmail] Email payload:", emailPayload);

  try {
    const { data: responseData, error } = await getResendClient().emails.send({
      from: emailPayload.from,
      to: emailPayload.to,
      subject: emailPayload.subject,
      html: emailWrapper(content),
    });

    if (error) {
      console.error("[sendQuoteEmail] Resend API error:", JSON.stringify(error, null, 2));
      return { success: false, error };
    }

    console.log("[sendQuoteEmail] Email sent successfully:", responseData);
    return { success: true };
  } catch (error) {
    console.error("[sendQuoteEmail] Exception caught:", error);
    return { success: false, error };
  }
}

// Email 5: Payment confirmation to customer
export async function sendPaymentConfirmationEmail(data: {
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  deviceType: string;
  amountPaid: number; // in cents
  paymentType: string; // "deposit" or "full"
}) {
  console.log("[sendPaymentConfirmationEmail] Called with data:", {
    ticketNumber: data.ticketNumber,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    amountPaid: data.amountPaid,
  });

  const { ticketNumber, customerName, customerEmail, deviceType, amountPaid, paymentType } = data;
  const formattedAmount = (amountPaid / 100).toFixed(2);
  const isDeposit = paymentType === "deposit";

  const content = `
    <h2 style="margin: 0 0 16px 0; color: ${TEXT_DARK}; font-size: 24px; font-weight: 600;">
      Payment Confirmed!
    </h2>
    <p style="margin: 0 0 24px 0; color: ${TEXT_BODY}; font-size: 16px; line-height: 1.6;">
      Hi ${customerName},
    </p>
    <p style="margin: 0 0 24px 0; color: ${TEXT_BODY}; font-size: 16px; line-height: 1.6;">
      Thank you for your payment! Your repair request has been approved and we'll begin working on it shortly.
    </p>

    <!-- Payment Success Box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
      <tr>
        <td style="background-color: #ecfdf5; border-radius: 8px; padding: 24px; text-align: center; border: 2px solid #10b981;">
          <div style="width: 48px; height: 48px; background-color: #10b981; border-radius: 50%; margin: 0 auto 16px auto; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 24px;">✓</span>
          </div>
          <p style="margin: 0 0 8px 0; color: ${TEXT_BODY}; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
            ${isDeposit ? "Deposit Paid" : "Payment Received"}
          </p>
          <p style="margin: 0; color: #059669; font-size: 36px; font-weight: 700;">$${formattedAmount}</p>
        </td>
      </tr>
    </table>

    <!-- Order Details -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: ${BG_LIGHT}; border-radius: 8px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 16px 0; color: ${TEXT_DARK}; font-size: 16px; font-weight: 600;">Order Details</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 4px 0; color: ${TEXT_BODY}; font-size: 14px; width: 120px;">Ticket Number:</td>
              <td style="padding: 4px 0; color: ${TEXT_DARK}; font-size: 14px; font-weight: 500;">${ticketNumber}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: ${TEXT_BODY}; font-size: 14px;">Device:</td>
              <td style="padding: 4px 0; color: ${TEXT_DARK}; font-size: 14px;">${deviceType}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: ${TEXT_BODY}; font-size: 14px;">Status:</td>
              <td style="padding: 4px 0;">
                <span style="background-color: ${BRAND_BLUE}; color: #ffffff; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">APPROVED</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Next Steps -->
    <h3 style="margin: 0 0 16px 0; color: ${TEXT_DARK}; font-size: 18px; font-weight: 600;">What's Next?</h3>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 0 0 12px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 28px; height: 28px; background-color: ${BRAND_BLUE}; border-radius: 50%; text-align: center; vertical-align: middle;">
                <span style="color: #ffffff; font-size: 14px; font-weight: 600;">1</span>
              </td>
              <td style="padding-left: 12px; color: ${TEXT_BODY}; font-size: 14px; line-height: 1.5;">
                Ship your device to our repair center
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 0 12px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 28px; height: 28px; background-color: ${BRAND_BLUE}; border-radius: 50%; text-align: center; vertical-align: middle;">
                <span style="color: #ffffff; font-size: 14px; font-weight: 600;">2</span>
              </td>
              <td style="padding-left: 12px; color: ${TEXT_BODY}; font-size: 14px; line-height: 1.5;">
                We'll repair your device and keep you updated
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 28px; height: 28px; background-color: ${BRAND_BLUE}; border-radius: 50%; text-align: center; vertical-align: middle;">
                <span style="color: #ffffff; font-size: 14px; font-weight: 600;">3</span>
              </td>
              <td style="padding-left: 12px; color: ${TEXT_BODY}; font-size: 14px; line-height: 1.5;">
                We'll ship it back to you once complete
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const emailPayload = {
    from: "Arbafix <onboarding@resend.dev>",
    to: customerEmail,
    subject: `Payment Confirmed - ${ticketNumber}`,
  };

  try {
    const { data: responseData, error } = await getResendClient().emails.send({
      from: emailPayload.from,
      to: emailPayload.to,
      subject: emailPayload.subject,
      html: emailWrapper(content),
    });

    if (error) {
      console.error("[sendPaymentConfirmationEmail] Resend API error:", JSON.stringify(error, null, 2));
      return { success: false, error };
    }

    console.log("[sendPaymentConfirmationEmail] Email sent successfully:", responseData);
    return { success: true };
  } catch (error) {
    console.error("[sendPaymentConfirmationEmail] Exception caught:", error);
    return { success: false, error };
  }
}

// Email 6: Admin notification when payment is received
export async function sendAdminPaymentNotificationEmail(data: {
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  deviceType: string;
  amountPaid: number; // in cents
  paymentType: string;
  requestId: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.error("ADMIN_EMAIL not configured");
    return { success: false, error: "ADMIN_EMAIL not configured" };
  }

  const { ticketNumber, customerName, customerEmail, deviceType, amountPaid, paymentType, requestId } = data;
  const formattedAmount = (amountPaid / 100).toFixed(2);
  const adminDashboardUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/admin/requests/${requestId}`
    : `/admin/requests/${requestId}`;

  const content = `
    <h2 style="margin: 0 0 16px 0; color: ${TEXT_DARK}; font-size: 24px; font-weight: 600;">
      Payment Received!
    </h2>

    <!-- Payment Box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
      <tr>
        <td style="background-color: #ecfdf5; border-radius: 8px; padding: 20px; border-left: 4px solid #10b981;">
          <p style="margin: 0 0 8px 0; color: ${TEXT_DARK}; font-size: 16px;">
            <strong>Amount:</strong> $${formattedAmount} (${paymentType === "deposit" ? "Deposit" : "Full Payment"})
          </p>
          <p style="margin: 0; color: ${TEXT_DARK}; font-size: 16px;">
            <strong>Ticket:</strong> ${ticketNumber}
          </p>
        </td>
      </tr>
    </table>

    <!-- Customer Info -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: ${BG_LIGHT}; border-radius: 8px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 16px 0; color: ${TEXT_DARK}; font-size: 16px; font-weight: 600;">Customer Information</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 4px 0; color: ${TEXT_BODY}; font-size: 14px; width: 100px;">Name:</td>
              <td style="padding: 4px 0; color: ${TEXT_DARK}; font-size: 14px; font-weight: 500;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: ${TEXT_BODY}; font-size: 14px;">Email:</td>
              <td style="padding: 4px 0; color: ${TEXT_DARK}; font-size: 14px;">
                <a href="mailto:${customerEmail}" style="color: ${BRAND_BLUE}; text-decoration: none;">${customerEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: ${TEXT_BODY}; font-size: 14px;">Device:</td>
              <td style="padding: 4px 0; color: ${TEXT_DARK}; font-size: 14px;">${deviceType}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="text-align: center;">
          <a href="${adminDashboardUrl}" style="display: inline-block; background-color: ${BRAND_BLUE}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
            View in Dashboard
          </a>
        </td>
      </tr>
    </table>
  `;

  try {
    const { error } = await getResendClient().emails.send({
      from: "Arbafix <onboarding@resend.dev>",
      to: adminEmail,
      subject: `Payment Received - ${ticketNumber} ($${formattedAmount})`,
      html: emailWrapper(content),
    });

    if (error) {
      console.error("Failed to send admin payment notification email:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send admin payment notification email:", error);
    return { success: false, error };
  }
}
