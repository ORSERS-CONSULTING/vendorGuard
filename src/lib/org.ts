export type Organization = {
  code: string;
  name: string;
  type: "Corporate" | "Retailer";
  industry: "Education" | "Healthcare" | "Other";
  plan: "Basic Plan" | "Enterprise Plan" | "Professional Plan" | "UAE Plan";
  country: string;
  admin: string;
  status: "Active" | "Pending Activation" | "Suspended";
  timezone: string;
  currency: string;
};

export const allOrgs: Organization[] = [
  {
    code: "TNT-0006",
    name: "ahmed org",
    type: "Corporate",
    industry: "Education",
    plan: "UAE Plan",
    country: "UAE",
    admin: "Ahmed Abdelrahman",
    status: "Pending Activation",
    timezone: "Gulf Standard Time",
    currency: "AED",
  },
  {
    code: "TNT-0014",
    name: "AHMED IBRAHIM 3",
    type: "Corporate",
    industry: "Education",
    plan: "Enterprise Plan",
    country: "Algeria",
    admin: "Ahmed",
    status: "Active",
    timezone: "West Africa Time",
    currency: "USD",
  },
    {
    code: "TNT-0007",
    name: "ahmed org",
    type: "Corporate",
    industry: "Education",
    plan: "UAE Plan",
    country: "UAE",
    admin: "Ahmed Abdelrahman",
    status: "Pending Activation",
    timezone: "Gulf Standard Time",
    currency: "AED",
  },
  {
    code: "TNT-0015",
    name: "AHMED IBRAHIM 3",
    type: "Corporate",
    industry: "Education",
    plan: "Enterprise Plan",
    country: "Algeria",
    admin: "Ahmed",
    status: "Active",
    timezone: "West Africa Time",
    currency: "USD",
  },
    {
    code: "TNT-0008",
    name: "ahmed org",
    type: "Corporate",
    industry: "Education",
    plan: "UAE Plan",
    country: "UAE",
    admin: "Ahmed Abdelrahman",
    status: "Pending Activation",
    timezone: "Gulf Standard Time",
    currency: "AED",
  },
  {
    code: "TNT-0016",
    name: "AHMED IBRAHIM 3",
    type: "Corporate",
    industry: "Education",
    plan: "Enterprise Plan",
    country: "Algeria",
    admin: "Ahmed",
    status: "Active",
    timezone: "West Africa Time",
    currency: "USD",
  },
    {
    code: "TNT-0009",
    name: "ahmed org",
    type: "Corporate",
    industry: "Education",
    plan: "UAE Plan",
    country: "UAE",
    admin: "Ahmed Abdelrahman",
    status: "Pending Activation",
    timezone: "Gulf Standard Time",
    currency: "AED",
  },
  {
    code: "TNT-0017",
    name: "AHMED IBRAHIM 3",
    type: "Corporate",
    industry: "Education",
    plan: "Enterprise Plan",
    country: "Algeria",
    admin: "Ahmed",
    status: "Active",
    timezone: "West Africa Time",
    currency: "USD",
  },
  // ...add more rows to mirror your screenshot
];
