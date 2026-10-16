// Price list and policies the repair agent quotes from.
//
// The agent will only send a QUOTE for a service whose price is set here.
// A service with price: null makes the agent escalate to you instead of
// guessing. Fill in the nulls to let it quote those jobs.

export interface ServicePrice {
  id: string;
  devices: string[]; // device types / models this applies to
  service: string;
  price: number | null; // USD, null = not set yet (agent escalates)
  notes?: string;
}

export const SERVICES: ServicePrice[] = [
  {
    id: "hdmi-port",
    devices: ["PS4", "PS4 Slim", "PS4 Pro", "PS5", "Xbox One", "Xbox One S", "Xbox One X", "Xbox Series X", "Xbox Series S"],
    service: "HDMI port replacement",
    price: 85,
    notes: "No video / no signal / bent or loose HDMI port. If the port looks fine, the retimer/encoder chip may be the cause; quote port only and say chip work is extra if found.",
  },
  {
    id: "switch-usbc-port",
    devices: ["Nintendo Switch", "Nintendo Switch OLED", "Nintendo Switch Lite"],
    service: "USB-C charging port replacement",
    price: 69.99,
    notes: "If the port checks out fine on the bench, the charging IC is the likely cause (same price). If both are bad, we contact the customer before doing extra work.",
  },
  {
    id: "switch-charging-ic",
    devices: ["Nintendo Switch", "Nintendo Switch OLED", "Nintendo Switch Lite"],
    service: "Charging IC repair (M92T36 / P13USB / BQ24193)",
    price: 69.99,
    notes: "Typical symptoms: won't charge, won't turn on, often after a third-party dock or charger. Price covers one IC; if more than one chip is bad, or the CPU/board is damaged, we contact the customer before doing extra work.",
  },
  {
    id: "laptop-dc-jack",
    devices: ["Windows laptop"],
    service: "DC jack / USB-C charging port repair",
    price: 69.99,
    notes: "No MacBooks.",
  },
  {
    id: "joycon-drift",
    devices: ["Joy-Con"],
    service: "Joy-Con analog stick replacement (drift), Hall-effect stick",
    price: 29.99,
    notes: "Price is per Joy-Con. Hall-effect sticks use magnets instead of a worn contact pad, so they don't develop drift again. Joy-Cons only; not Switch Lite sticks.",
  },
  {
    id: "og-xbox-drive-service",
    devices: ["Original Xbox (2001)"],
    service: "Disc drive service: clean lens, replace tray belt, tune laser",
    price: 49.99,
    notes: "Fixes most 'won't read games' and 'tray won't open/close' cases. Quote this first. Before quoting, ask: does the tray open and close, does the disc spin, and does it fail on every original game or only some/burned discs. Clock capacitor removal included free.",
  },
  {
    id: "og-xbox-drive-replacement",
    devices: ["Original Xbox (2001)"],
    service: "Disc drive replacement with a tested used drive",
    price: 129.99,
    notes: "Only if the service above doesn't fix it, or the laser is dead. Drives are no longer made, so this is a tested used pull. If the customer already paid for the drive service, contact them before upgrading to a replacement. Clock capacitor removal included free.",
  },
  {
    id: "no-power-diagnosis",
    devices: ["Any console"],
    service: "No-power diagnosis",
    price: 0,
    notes: "Diagnosis is free. Quote the likely repair after the customer answers questions, or say the final price is confirmed after bench diagnosis.",
  },
];

export const POLICIES = {
  defaultDepositPercent: 50,
  turnaround: "3-5 business days after we receive the device; complex repairs can take longer",
  warranty: "90 days, parts and labor, same issue",
  returnShipping: "Free return shipping with a prepaid USPS label once paid in full",
  inboundShipping: "Customer ships the device to us with any carrier after paying the deposit; we email the shipping address after the deposit",
  unrepairable: "If we can't repair it, the deposit is refunded in full and the device is returned free",
  waterDamage: "We assess water damage but can't guarantee a repair",
  payment: "Major credit cards through Stripe: a deposit up front, the balance after the repair",
  notOffered: ["MacBook repairs"],
};

export function pricingForPrompt(): string {
  const lines = SERVICES.map((s) => {
    const price = s.price === null ? "PRICE NOT SET (escalate, do not quote)" : s.price === 0 ? "free" : `$${s.price.toFixed(2)}`;
    return `- [${s.id}] ${s.service} | devices: ${s.devices.join(", ")} | ${price}${s.notes ? ` | ${s.notes}` : ""}`;
  });
  const policy = Object.entries(POLICIES)
    .map(([k, v]) => `- ${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
    .join("\n");
  return `SERVICES AND PRICES\n${lines.join("\n")}\n\nPOLICIES\n${policy}`;
}

export function priceIsListed(amountCents: number): boolean {
  return SERVICES.some((s) => s.price !== null && s.price > 0 && Math.round(s.price * 100) === amountCents);
}
