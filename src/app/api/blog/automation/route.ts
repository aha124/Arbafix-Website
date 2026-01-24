import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Generate a URL-friendly slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();
}

/**
 * Find a unique slug by appending -2, -3, etc. if the base slug exists
 */
async function findUniqueSlug(baseSlug: string): Promise<string> {
  // Check if base slug is available
  const existing = await prisma.blogPost.findUnique({
    where: { slug: baseSlug },
  });

  if (!existing) {
    return baseSlug;
  }

  // Find the next available slug
  let counter = 2;
  while (true) {
    const candidateSlug = `${baseSlug}-${counter}`;
    const exists = await prisma.blogPost.findUnique({
      where: { slug: candidateSlug },
    });

    if (!exists) {
      return candidateSlug;
    }

    counter++;

    // Safety limit to prevent infinite loops
    if (counter > 1000) {
      throw new Error("Unable to generate unique slug");
    }
  }
}

/**
 * POST /api/blog/automation
 *
 * Secure endpoint for automated blog post creation (Zapier/Make.com integration).
 *
 * Headers:
 *   x-automation-key: Secret key matching BLOG_AUTOMATION_KEY environment variable
 *
 * Body:
 *   - title: string (required)
 *   - content: string (required) - HTML content
 *   - excerpt: string (optional)
 *   - coverImage: string (optional) - URL
 *   - metaTitle: string (optional)
 *   - metaDescription: string (optional)
 *   - publish: boolean (optional, default false) - if true, publish immediately
 */
export async function POST(request: NextRequest) {
  try {
    // Validate automation key
    const automationKey = request.headers.get("x-automation-key");
    const expectedKey = process.env.BLOG_AUTOMATION_KEY;

    if (!expectedKey) {
      console.error("BLOG_AUTOMATION_KEY environment variable is not set");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!automationKey || automationKey !== expectedKey) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      coverImage,
      metaTitle,
      metaDescription,
      publish,
    } = body;

    // Validate required fields
    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = generateSlug(title.trim());
    if (!baseSlug) {
      return NextResponse.json(
        { success: false, error: "Title must contain alphanumeric characters" },
        { status: 400 }
      );
    }

    const slug = await findUniqueSlug(baseSlug);

    // Determine publish status
    const shouldPublish = publish === true;

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt: excerpt?.trim() || null,
        coverImage: coverImage?.trim() || null,
        metaTitle: metaTitle?.trim() || null,
        metaDescription: metaDescription?.trim() || null,
        published: shouldPublish,
        publishedAt: shouldPublish ? new Date() : null,
      },
    });

    // Build response
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://arbafix.com";
    const postUrl = `${baseUrl}/blog/${post.slug}`;

    return NextResponse.json(
      {
        success: true,
        post: {
          id: post.id,
          slug: post.slug,
          title: post.title,
          url: postUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog post via automation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
