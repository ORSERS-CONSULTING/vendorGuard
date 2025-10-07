// app/tenants/[code]/page.tsx
import { notFound } from "next/navigation";
import TenantScreen from "../TenantScreen";
import { absUrl } from "@/lib/abs-url";

type Company = {
  code: string;
  name: string;
  type?: string;
  industry?: string;
  plan?: string;
  country?: string;
  status: "ACTIVE" | "PENDING" | "CLOSED";
  timezone?: string;
  currency?: string;
  repName?: string;
  repPhone?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  profileCompletion?: number;
};

async function getCompany(code: string): Promise<Company | null> {
  const url = await absUrl(`/api/organizations?code=${encodeURIComponent(code)}`);
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Upstream ${res.status}`);
  return res.json();
}

// --- Fix: params is a Promise in your PageProps --- //
type TenantPageProps = { params: Promise<{ code: string }> };

export default async function TenantPage({ params }: TenantPageProps) {
  const { code } = await params; // <-- await the promised params
  const company = await getCompany(code);
  if (!company) notFound();
  return <TenantScreen company={company} />;
}
