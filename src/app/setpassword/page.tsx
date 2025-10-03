import SetPasswordClient from "./setpassword-client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tenant?: string; token?: string; next?: string | string[] }>;
}) {
  const sp = await searchParams;

  const tenant = typeof sp.tenant === "string" ? sp.tenant : "";
  const token  = typeof sp.token  === "string" ? sp.token  : "";

  const nextRaw = sp.next;
  const nextStr = Array.isArray(nextRaw) ? nextRaw[0] : nextRaw ?? null;

  const nextPath =
    typeof nextStr === "string" && nextStr.startsWith("/")
      ? decodeURIComponent(nextStr)
      : null;

  return <SetPasswordClient tenant={tenant} token={token} nextPath={nextPath} />;
}
