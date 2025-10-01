import Login from "./login-client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const sp = await searchParams;
  const nextRaw = sp?.next;
  const next =
    Array.isArray(nextRaw) ? nextRaw[0] : nextRaw || null; // null if not set

  return <Login nextPath={next} />;
}
