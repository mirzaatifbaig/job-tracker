import { addDays, addHours } from "date-fns";

// Generate a unique ID
const generateId = () =>
    Math.random().toString(36).substring(2, 10);

// Create mock reminders
const createReminders = (jobId) => {
  const now = new Date();

  return [
    {
      id: generateId(),
      title: "Follow-up email",
      description: "Send a follow-up email to check on proposal status",
      date: addDays(now, 3),
      sent: false,
      jobId
    },
    {
      id: generateId(),
      title: "Schedule call",
      date: addHours(now, 36),
      sent: true,
      jobId
    }
  ];
};

// Create mock jobs data
export const mockJobs = [
  {
    id: generateId(),
    company: "TechVision Inc.",
    position: "Frontend Development",
    contactName: "Sarah Johnson",
    contactEmail: "sarah@techvision.com",
    contactPhone: "555-123-4567",
    status: "proposal",
    value: 5000,
    notes: "Website redesign project with possible ongoing maintenance",
    createdAt: new Date(2025, 3, 5),
    updatedAt: new Date(2025, 3, 15),
    tags: ["website", "design", "react"],
    reminders: createReminders(generateId())
  },
  {
    id: generateId(),
    company: "GreenLeaf Studios",
    position: "E-commerce Platform",
    contactName: "Mike Chen",
    contactEmail: "mike@greenleaf.co",
    contactPhone: "555-987-6543",
    status: "interviewing",
    value: 8500,
    notes: "Building custom e-commerce solution with inventory management",
    createdAt: new Date(2025, 3, 10),
    updatedAt: new Date(2025, 3, 12),
    tags: ["e-commerce", "full-stack", "javascript"],
    reminders: createReminders(generateId())
  },
  {
    id: generateId(),
    company: "Apex Dynamics",
    position: "Mobile App Development",
    contactName: "Taylor Reynolds",
    contactEmail: "taylor@apexdynamics.io",
    contactPhone: "555-345-6789",
    status: "won",
    value: 12000,
    notes: "iOS and Android app for fitness tracking",
    createdAt: new Date(2025, 2, 20),
    updatedAt: new Date(2025, 3, 1),
    tags: ["mobile", "react-native", "fitness"],
    reminders: createReminders(generateId())
  },
  {
    id: generateId(),
    company: "Horizon Marketing",
    position: "Landing Page Creation",
    contactName: "Jessica Park",
    contactEmail: "jessica@horizonmktg.com",
    contactPhone: "555-234-5678",
    status: "lead",
    value: 0,
    notes: "Potential project for series of campaign landing pages",
    createdAt: new Date(2025, 3, 18),
    updatedAt: new Date(2025, 3, 18),
    tags: ["marketing", "landing-page"],
    reminders: createReminders(generateId())
  },
  {
    id: generateId(),
    company: "Quantum Solutions",
    position: "Dashboard UI/UX",
    contactName: "Alex Rivera",
    contactEmail: "alex@quantumsol.tech",
    contactPhone: "555-456-7890",
    status: "lost",
    value: 7500,
    notes: "Client went with another agency due to budget constraints",
    createdAt: new Date(2025, 2, 28),
    updatedAt: new Date(2025, 3, 10),
    tags: ["dashboard", "ui/ux", "data-viz"],
    reminders: createReminders(generateId())
  },
  {
    id: generateId(),
    company: "BlueWave Systems",
    position: "API Integration",
    contactName: "Jordan Smith",
    contactEmail: "jordan@bluewave.dev",
    contactPhone: "555-876-5432",
    status: "negotiating",
    value: 4200,
    notes: "Connecting existing website with payment processor and CRM",
    createdAt: new Date(2025, 3, 8),
    updatedAt: new Date(2025, 3, 16),
    tags: ["api", "integration", "backend"],
    reminders: createReminders(generateId())
  }
];

// Status options with labels and colors
export const statusOptions = [
  {
    value: "lead",
    label: "Lead",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  },
  {
    value: "prospect",
    label: "Prospect",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
  },
  {
    value: "interviewing",
    label: "Interviewing",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
  },
  {
    value: "proposal",
    label: "Proposal Sent",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
  },
  {
    value: "negotiating",
    label: "Negotiating",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
  },
  {
    value: "won",
    label: "Won",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  },
  {
    value: "lost",
    label: "Lost",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  },
  {
    value: "archived",
    label: "Archived",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
];

// Mock tag list
export const availableTags = [
  "website",
  "design",
  "react",
  "e-commerce",
  "full-stack",
  "javascript",
  "mobile",
  "react-native",
  "fitness",
  "marketing",
  "landing-page",
  "dashboard",
  "ui/ux",
  "data-viz",
  "api",
  "integration",
  "backend"
];

// Get status info by status value
export const getStatusDetails = (status) => {
  return statusOptions.find((s) => s.value === status) || statusOptions[0];
};

// Calculate job statistics
export const calculateStats = (jobs) => {
  const totalValue = jobs.reduce((sum, job) => sum + (job.value || 0), 0);
  const activeJobs = jobs.filter(
      (job) => !["lost", "archived"].includes(job.status)
  ).length;
  const wonJobs = jobs.filter((job) => job.status === "won").length;
  const winRate = jobs.length > 0 ? (wonJobs / jobs.length) * 100 : 0;

  return {
    totalValue: totalValue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    }),
    activeJobs,
    wonJobs,
    winRate: winRate.toFixed(1) + "%"
  };
};

// Mock current user
export const currentUser = {
  id: "1",
  name: "Jamie Smith",
  email: "jamie@example.com"
};
