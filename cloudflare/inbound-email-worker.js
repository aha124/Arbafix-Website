// Cloudflare Email Worker for repairs@arbafix.com.
//
// 1. Forwards every message to Gmail (same as the old routing rule), so mail
//    keeps arriving even if the site is down.
// 2. Posts a copy to arbafix.com so customer replies attach to their ticket
//    and the repair agent drafts the next response.
//
// Variables to set on the worker:
//   FORWARD_TO            the Gmail address (already verified in Email Routing)
//   WEBHOOK_URL           https://www.arbafix.com/api/inbound-email
//   INBOUND_EMAIL_SECRET  same value as the Vercel env var (mark as secret)

export default {
  async email(message, env, ctx) {
    // Forward first so the email always reaches Gmail.
    await message.forward(env.FORWARD_TO);

    const raw = await new Response(message.raw).text();

    ctx.waitUntil(
      fetch(env.WEBHOOK_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-inbound-secret": env.INBOUND_EMAIL_SECRET,
        },
        body: JSON.stringify({ from: message.from, to: message.to, raw }),
      }).catch(() => {})
    );
  },
};
