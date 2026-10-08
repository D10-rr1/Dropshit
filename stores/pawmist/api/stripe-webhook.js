// Stripe webhook: when a Payment Link checkout is paid, create the matching order at CJdropshipping.
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   STRIPE_SECRET_KEY       sk_live_... (used to read the paid line items)
//   STRIPE_WEBHOOK_SECRET   whsec_... (from the Stripe webhook endpoint)
//   CJ_API_KEY              from CJ dashboard → Authorization → API
//   CJ_LOGISTIC_NAME        shipping method name exactly as CJ shows it for the destination
//   CJ_FROM_COUNTRY         warehouse country code, optional (default "CN")
//   CJ_PRODUCT_MAP          JSON keyed by Stripe unit price in cents, e.g.
//                           {"3499":{"vid":"<CJ variant id>","quantity":1}, ...}

const crypto = require("crypto");

const CJ_API = "https://developers.cjdropshipping.com/api2.0/v1";
const TOLERANCE_SECONDS = 300;

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// Checks the Stripe-Signature header (https://stripe.com/docs/webhooks/signatures).
function verifySignature(raw, header, secret) {
  if (!header || !secret) return false;
  const timestamp = header.split(",").find((p) => p.startsWith("t="))?.slice(2);
  const signatures = header.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  if (!timestamp || !signatures.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > TOLERANCE_SECONDS) return false;

  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest("hex");
  return signatures.some((sig) =>
    sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  );
}

async function stripeLineItems(sessionId) {
  const res = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${sessionId}/line_items?expand[]=data.price&limit=100`,
    { headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } }
  );
  const body = await res.json();
  if (!res.ok) throw new Error(`Stripe line_items failed: ${body.error?.message}`);
  return body.data;
}

async function cjAccessToken() {
  const res = await fetch(`${CJ_API}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: process.env.CJ_API_KEY }),
  });
  const body = await res.json();
  if (!body.result) throw new Error(`CJ auth failed: ${body.message}`);
  return body.data.accessToken;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const raw = await readRawBody(req);
  if (!verifySignature(raw, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET)) {
    return res.status(400).send("Invalid signature");
  }

  const event = JSON.parse(raw.toString("utf8"));
  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({ ignored: event.type });
  }

  const session = event.data.object;
  const shipping = session.shipping_details;
  if (!shipping?.address) {
    // Payment Links must collect a shipping address, otherwise there is nowhere to ship to.
    console.error("No shipping address on session", session.id);
    return res.status(500).json({ error: "No shipping address" });
  }

  try {
    const productMap = JSON.parse(process.env.CJ_PRODUCT_MAP || "{}");
    const lines = await stripeLineItems(session.id);

    const products = lines.map((line) => {
      const mapped = productMap[String(line.price.unit_amount)];
      if (!mapped) throw new Error(`No CJ product for unit price ${line.price.unit_amount}`);
      return { vid: mapped.vid, quantity: mapped.quantity * line.quantity };
    });

    const a = shipping.address;
    const token = await cjAccessToken();
    const orderRes = await fetch(`${CJ_API}/shopping/order/createOrderV2`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "CJ-Access-Token": token },
      body: JSON.stringify({
        orderNumber: session.id,
        shippingCustomerName: shipping.name,
        shippingCountryCode: a.country,
        shippingCountry: a.country,
        shippingProvince: a.state || "",
        shippingCity: a.city || "",
        shippingZip: a.postal_code || "",
        shippingAddress: a.line1 || "",
        shippingAddress2: a.line2 || "",
        shippingPhone: session.customer_details?.phone || "",
        email: session.customer_details?.email || "",
        logisticName: process.env.CJ_LOGISTIC_NAME,
        fromCountryCode: process.env.CJ_FROM_COUNTRY || "CN",
        products,
      }),
    });
    const order = await orderRes.json();
    if (!order.result) throw new Error(`CJ createOrderV2 failed: ${order.message}`);

    return res.status(200).json({ ok: true, cjOrderId: order.data.orderId });
  } catch (err) {
    // Non-2xx makes Stripe retry the webhook, which is what we want for transient failures.
    console.error("Order sync failed for", session.id, err.message);
    return res.status(500).json({ error: err.message });
  }
};
