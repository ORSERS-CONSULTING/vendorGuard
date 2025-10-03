import Login from "./login-client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const nextRaw = sp?.next;
  const next = Array.isArray(nextRaw) ? nextRaw[0] : nextRaw ?? null;

  const nextPath =
    typeof next === "string" && next.startsWith("/")
      ? decodeURIComponent(next)
      : null;

  return <Login nextPath={nextPath} />;
}
