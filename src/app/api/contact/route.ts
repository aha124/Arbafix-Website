import { NextRequest, NextResponse } from "next/server";
import { sendContactFormEmail } from "@/lib/email";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    const errors: Record<string, string> = {};

    if (!body.name?.trim()) {
      errors.name = "Name is required";
    }

    if (!body.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.email = "Invalid email format";
    }

    if (!body.message?.trim()) {
      errors.message = "Message is required";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 }
      );
    }

    // Validate subject is one of the allowed options
    const validSubjects = [
      "General Question",
      "Repair Inquiry",
      "Quote Request",
      "Warranty Claim",
      "Other",
    ];
    const subject = validSubjects.includes(body.subject) ? body.subject : "General Question";

    // Send email to admin
    const emailResult = await sendContactFormEmail({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || "",
      subject,
      message: body.message.trim(),
    });

    if (!emailResult.success) {
      console.error("Failed to send contact form email:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
