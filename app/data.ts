export type Agent = { code: string; name: string; job: string; metric: string; unit: string };
export type Dept = { id: string; name: string; color: string; blurb: string; agents: Agent[] };

export const DEPTS: Dept[] = [
  {
    id: "acquisitions",
    name: "Acquisitions",
    color: "#2F6BFF",
    blurb: "Finds the deals, works them up and keeps a seller lead from going cold.",
    agents: [
      { code: "Leak", name: "Lead Leak Fix", job: "Answers every seller lead in under a minute, follows up for weeks and books the call.", metric: "47", unit: "s first reply" },
      { code: "Broker", name: "Deal Flow", job: "Works broker and listing-agent inboxes, logs every deal sent and asks for the T-12.", metric: "120", unit: "deals / mo" },
      { code: "Radar", name: "Distress Radar", job: "Watches county records for liens, probate, code violations and pre-foreclosures.", metric: "9", unit: "counties" },
      { code: "Comp", name: "Underwriter", job: "Pulls comps and rents, then builds a first-pass model you can check in minutes.", metric: "6", unit: "min / deal" },
      { code: "DD", name: "Due Diligence", job: "Runs the checklist, chases missing documents and flags what looks off.", metric: "84", unit: "item list" },
    ],
  },
  {
    id: "operations",
    name: "Operations",
    color: "#0E9F6E",
    blurb: "Keeps residents answered, units turned and rent coming in on time.",
    agents: [
      { code: "Desk", name: "Resident Desk", job: "Answers residents by text, email and phone at any hour, in plain language.", metric: "24/7", unit: "coverage" },
      { code: "Wrench", name: "Maintenance", job: "Triages requests, dispatches vendors, confirms the fix and closes the ticket.", metric: "3", unit: "vendor quotes" },
      { code: "Rent", name: "Rent Follow-up", job: "Sends reminders, logs promises to pay and escalates late rent on your rules.", metric: "Day 1", unit: "first nudge" },
      { code: "Turn", name: "Turnover", job: "Schedules move-out inspections, cleaners and paint so units relist fast.", metric: "7", unit: "day target" },
      { code: "Tax", name: "Tax Watch", job: "Tracks assessments, spots over-valuations and prepares the appeal packet.", metric: "Every", unit: "notice read" },
    ],
  },
  {
    id: "back-office",
    name: "Back office",
    color: "#D97706",
    blurb: "Closes the books, checks your managers and never misses a deadline.",
    agents: [
      { code: "Ledger", name: "Bookkeeper", job: "Codes bills, matches receipts and keeps the books ready for your CPA.", metric: "Daily", unit: "reconcile" },
      { code: "Report", name: "Asset Reports", job: "Writes the monthly asset-management report for every property.", metric: "1st", unit: "of the month" },
      { code: "Audit", name: "PM Oversight", job: "Checks third-party managers against their own reports and your agreement.", metric: "100%", unit: "of invoices" },
      { code: "Lease", name: "Lease & Compliance", job: "Tracks renewals, notices, inspections and licence deadlines.", metric: "90", unit: "day lookahead" },
      { code: "Cover", name: "Insurance & Expense", job: "Watches premiums, renewals and spend creep across the portfolio.", metric: "Line", unit: "by line" },
    ],
  },
  {
    id: "capital",
    name: "Capital & investors",
    color: "#E0457B",
    blurb: "Keeps your LPs informed and your lenders a step behind you, not ahead.",
    agents: [
      { code: "LP", name: "Investor Updates", job: "Drafts quarterly updates and distribution notices from your real numbers.", metric: "Quarterly", unit: "on time" },
      { code: "Packet", name: "Lender Packets", job: "Assembles rent rolls, T-12s and PFS into a clean lender package.", metric: "1", unit: "click export" },
      { code: "Refi", name: "Maturity Tracker", job: "Tracks every loan maturity and rate reset and starts the refi early.", metric: "18", unit: "mo runway" },
    ],
  },
  {
    id: "lending",
    name: "Lending",
    color: "#0891B2",
    blurb: "For private lenders: intake, servicing and draws without the spreadsheet.",
    agents: [
      { code: "Loan", name: "Loan Desk", job: "Takes in applications, collects documents and services the loan after close.", metric: "Same day", unit: "term sheet" },
      { code: "Draw", name: "Draw Tracker", job: "Logs rehab draw requests, checks them against budget and photos.", metric: "Line", unit: "item check" },
    ],
  },
  {
    id: "brain",
    name: "The Brain",
    color: "#0B1215",
    blurb: "One agent over the whole portfolio that tells you what needs you this week.",
    agents: [
      { code: "Brain", name: "The Brain", job: "Reads what every other agent did and sends you a short list: what needs you, and why.", metric: "Monday", unit: "7am brief" },
    ],
  },
];

export const ALL_AGENTS = DEPTS.flatMap((d) => d.agents.map((a) => ({ ...a, color: d.color, dept: d.name })));

export const CREW_NAMES = ["Leak", "Desk", "Ledger", "Rent", "Radar", "LP", "Comp", "Draw", "Wrench", "Tax", "Brain", "Report"];

export const FAQ = [
  {
    q: "Do I need new software?",
    a: "No. The agents work inside the tools you already run, like your property management system, inbox, phone line, accounting and shared drive. Your team keeps working the way it does today.",
  },
  {
    q: "Do I have to take all 21 agents?",
    a: "No. Most owners start with one department, usually Lead Leak Fix or the Resident Desk, see the results, then add more. Every agent works alone or as part of the crew.",
  },
  {
    q: "Who checks the agents' work?",
    a: "You set the rules. Anything that moves money, signs a document or goes to an investor waits for your approval. Everything else is logged, so you can see what was done and why.",
  },
  {
    q: "How long does it take to go live?",
    a: "A single agent is usually live in one to two weeks. A full department takes three to six weeks, depending on how many systems it needs to connect to.",
  },
  {
    q: "Is my data safe?",
    a: "Your data stays in your accounts. Agents get the narrowest access they need, every action is logged, and you can switch any agent off at any time.",
  },
];

// Placeholder contact details until RKV supplies real ones.
export const CONTACT = {
  email: "hello@rkvconsulting.example",
  phone: "Phone number coming soon",
  calendly: "#contact",
};
