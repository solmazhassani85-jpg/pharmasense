import { getSessionWithAdmin } from "@/lib/auth";
import NavbarClient from "./NavbarClient";

// Server Component: کاربر فعلی + وضعیت ادمین را می‌خواند و پاس می‌دهد.
export default async function Navbar() {
  const { user, isAdmin } = await getSessionWithAdmin();
  return (
    <NavbarClient
      isAuthed={Boolean(user)}
      email={user?.email ?? null}
      isAdmin={isAdmin}
    />
  );
}
