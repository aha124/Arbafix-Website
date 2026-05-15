import { NextResponse } from "next/server";

/**
 * POST /api/blog/automation
 *
 * DISABLED. Automated blog post generation via Make.com / Zapier has been
 * paused. The route is kept (instead of deleted) so any external scheduler
 * still firing receives an explicit 410 Gone response and can be turned
 * off cleanly. Existing posts are intentionally preserved — they're
 * indexed by Google and removing them would create 404s.
 *
 * To re-enable: restore the implementation from git history at commit
 * eeba606 ("Add blog automation API endpoint for Zapier/Make.com
 * integration") and remove this stub.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Blog automation is disabled. Posts must be created via the admin dashboard.",
    },
    { status: 410 }
  );
}
